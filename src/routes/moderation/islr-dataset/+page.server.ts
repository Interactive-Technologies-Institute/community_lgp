import {
	clearStaleInviteUser,
	clearStaleInviteUserById,
	listAuthUsersByEmail,
} from '@/server/pending-invite';
import { env } from '$env/dynamic/private';
import { announceContributorAccess } from '@/server/contributor-access';
import {
	COLLECTION_START,
	countByWeek,
	getAllSubmissions,
	getTargetSigns,
	startOfWeek,
	TARGET_VIDEO_COUNT,
	weeksSince,
} from '@/server/islr';
import { createSupabaseAdminClient } from '@/server/supabase-admin';
import {
	inviteContributorSchema,
	type InviteContributorSchema,
} from '@/schemas/invite-contributor';
import { remindConsentSchema } from '@/schemas/remind-consent';
import { resendPendingInvitesSchema } from '@/schemas/resend-pending-invites';
import type { ContributorActivity, ContributorInvite, ContributorStage } from '@/types/types';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getInvites(): Promise<ContributorInvite[]> {
		const { data, error: invitesError } = await event.locals.supabase
			.from('contributor_invites')
			.select('*')
			.order('created_at', { ascending: false });

		if (invitesError) {
			const errorMessage = 'Error fetching contributor invites, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return data as ContributorInvite[];
	}

	const invites = await getInvites();

	const submissions = await getAllSubmissions(event.locals.supabase);

	const currentWeekStart = startOfWeek(new Date());
	const videoCountByContributor = new Map<string, number>();
	const videosThisWeekByContributor = new Map<string, number>();
	const lastRecordedAtByContributor = new Map<string, string>();
	for (const { contributor_id, inserted_at } of submissions) {
		videoCountByContributor.set(
			contributor_id,
			(videoCountByContributor.get(contributor_id) ?? 0) + 1
		);
		if (new Date(inserted_at) >= currentWeekStart) {
			videosThisWeekByContributor.set(
				contributor_id,
				(videosThisWeekByContributor.get(contributor_id) ?? 0) + 1
			);
		}
		const lastRecordedAt = lastRecordedAtByContributor.get(contributor_id);
		if (!lastRecordedAt || inserted_at > lastRecordedAt) {
			lastRecordedAtByContributor.set(contributor_id, inserted_at);
		}
	}

	// Invites are keyed by email, submissions by user id - bridge them through profiles.
	const { data: invitedProfiles, error: profilesError } = await event.locals.supabase
		.from('profiles')
		.select('id, email, display_name')
		.in(
			'email',
			invites.map((invite) => invite.email)
		);

	if (profilesError) {
		const errorMessage = 'Error fetching contributor profiles, please try again later.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}

	const contributorActivityByEmail: Record<string, ContributorActivity> = {};
	for (const profile of invitedProfiles) {
		contributorActivityByEmail[profile.email.toLowerCase()] = {
			name: profile.display_name?.trim() || null,
			videoCount: videoCountByContributor.get(profile.id) ?? 0,
			videosThisWeek: videosThisWeekByContributor.get(profile.id) ?? 0,
			lastRecordedAt: lastRecordedAtByContributor.get(profile.id) ?? null,
		};
	}

	// Progress only counts the target vocabulary, so videos of signs that were
	// dropped from it don't make the dataset look further along than it is.
	const targetSigns = await getTargetSigns(event.locals.supabase);
	const videoCountBySign = new Map<number, number>(targetSigns.map((sign) => [sign.id, 0]));
	for (const { sign_id } of submissions) {
		const count = videoCountBySign.get(sign_id);
		if (count !== undefined) videoCountBySign.set(sign_id, count + 1);
	}
	const signCounts = [...videoCountBySign.values()];
	const videosRecorded = signCounts.reduce((sum, count) => sum + count, 0);

	// Same target-vocabulary filter as the total, so the two numbers agree.
	const weeklyVideoCounts = countByWeek(
		submissions
			.filter(({ sign_id }) => videoCountBySign.has(sign_id))
			.map(({ inserted_at }) => inserted_at),
		Math.max(1, Math.min(MAX_WEEKS_TO_SHOW, weeksSince(COLLECTION_START)))
	);

	const { data: consentedContributors, error: consentedError } = await event.locals.supabase
		.from('islr_contributors')
		.select('id');

	if (consentedError) {
		const errorMessage = 'Error fetching dataset contributors, please try again later.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}

	// Where each invited contributor got to: invite accepted, consent given,
	// or recording started. Videos are checked first because
	// recording requires consent, so they prove it on their own - the consent
	// list only matters for telling apart those who haven't recorded yet.
	const consentedIds = new Set(consentedContributors.map((c) => c.id));
	const profileIdByEmail = new Map(
		invitedProfiles.map((profile) => [profile.email.toLowerCase(), profile.id])
	);
	const contributorStageByEmail: Record<string, ContributorStage> = {};
	for (const invite of invites) {
		const email = invite.email.toLowerCase();
		const profileId = profileIdByEmail.get(email);
		const videoCount = profileId ? (videoCountByContributor.get(profileId) ?? 0) : 0;
		contributorStageByEmail[email] =
			videoCount > 0
				? 'recording'
				: !invite.used_at
					? 'pending'
					: profileId && consentedIds.has(profileId)
						? 'consented'
						: 'accepted';
	}

	const now = new Date();
	const pendingInvites = invites.filter((invite) => !invite.used_at);
	const inviteResendDueCount = pendingInvites.filter((invite) =>
		isResendDue(invite.invite_sent_at, now)
	).length;
	const awaitingConsent = invites.filter(
		(invite) => contributorStageByEmail[invite.email.toLowerCase()] === 'accepted'
	);
	const consentReminderDueCount = awaitingConsent.filter((invite) =>
		isResendDue(invite.consent_reminded_at, now)
	).length;

	return {
		invites,
		contributorActivityByEmail,
		contributorStageByEmail,
		inviteResendDueCount,
		inviteResendRecentCount: pendingInvites.length - inviteResendDueCount,
		consentReminderDueCount,
		consentReminderRecentCount: awaitingConsent.length - consentReminderDueCount,
		datasetProgress: {
			videosRecorded,
			targetVideoCount: TARGET_VIDEO_COUNT,
		},
		weeklyVideoCounts,
		collectionStart: COLLECTION_START,
		maxWeeksToShow: MAX_WEEKS_TO_SHOW,
		inviteContributorForm: await superValidate(zod(inviteContributorSchema), {
			id: 'invite-contributor',
		}),
		resendPendingInvitesForm: await superValidate(zod(resendPendingInvitesSchema), {
			id: 'resend-pending-invites',
		}),
		remindConsentForm: await superValidate(zod(remindConsentSchema), {
			id: 'remind-consent',
		}),
		bulkResendLimit: BULK_RESEND_LIMIT,
	};
};

async function promoteExistingUser(
	event: RequestEvent,
	adminClient: ReturnType<typeof createSupabaseAdminClient>,
	form: SuperValidated<Infer<InviteContributorSchema>>,
	profileId: string,
	email: string,
	invitedBy: string
) {
	const { data: existingRole, error: roleError } = await event.locals.supabase
		.from('user_roles')
		.select('role')
		.eq('id', profileId)
		.maybeSingle();

	if (roleError) {
		setFlash({ type: 'error', message: roleError.message }, event.cookies);
		return fail(500, { message: roleError.message, form });
	}

	// Only plain users are promoted: contributors already have access, and any
	// other role either has it too or outranks contributor.
	if (existingRole?.role !== 'user') {
		const errorMessage = `A conta ${email} já tem o papel ${existingRole?.role ?? 'desconhecido'} e não precisa de convite.`;
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return fail(400, { message: errorMessage, form });
	}

	// Moderators can't update user_roles through RLS (see the
	// contributor_invites_moderator_access migration), so this goes through
	// the service role - but only for user -> contributor, the same thing an
	// accepted invite does.
	const { error: updateError } = await adminClient
		.from('user_roles')
		.update({ role: 'contributor' })
		.eq('id', profileId)
		.eq('role', 'user');

	if (updateError) {
		setFlash({ type: 'error', message: updateError.message }, event.cookies);
		return fail(500, { message: updateError.message, form });
	}

	const problems = await announceContributorAccess(adminClient, email, invitedBy);

	setFlash(
		problems.length > 0
			? {
					type: 'error',
					message: `${email} já tinha conta e passou a Contribuidor, mas: ${problems.join(' | ')}`,
				}
			: {
					type: 'success',
					message: `${email} já tinha conta: passou a Contribuidor e recebeu um email a avisar.`,
				},
		event.cookies
	);

	return { form };
}

// The weekly videos chart starts at the collection's first week, and once
// that's further back than this only shows the most recent weeks.
const MAX_WEEKS_TO_SHOW = 12;

// Invite emails go out through Gmail SMTP, capped at 80 per hour. Keeping
// one batch well under that leaves room for other auth emails (single
// invites, password resets) in the same hour, and keeps the request short
// enough not to hit the host's function timeout.
const BULK_RESEND_LIMIT = 50;

// Bulk resends and consent reminders skip anyone emailed less than this long
// ago, so nobody gets the same email more than once a day however often the
// buttons are clicked.
const RESEND_COOLDOWN_HOURS = 24;

function isResendDue(lastSentAt: string | null, now: Date) {
	if (!lastSentAt) return true;
	return now.getTime() - new Date(lastSentAt).getTime() >= RESEND_COOLDOWN_HOURS * 60 * 60 * 1000;
}

export const actions = {
	remindConsent: async (event) =>
		handleFormAction(event, remindConsentSchema, 'remind-consent', async (event, _userId, form) => {
			const adminClient = createSupabaseAdminClient();

			// Who still owes consent is only knowable if this user can read every
			// islr_contributors row (the islr_contributors_moderator_read
			// migration). If they can't, everyone would look like they owe it and
			// people who already consented would get the reminder too - so refuse.
			const [visible, total] = await Promise.all([
				event.locals.supabase
					.from('islr_contributors')
					.select('id', { count: 'exact', head: true }),
				adminClient.from('islr_contributors').select('id', { count: 'exact', head: true }),
			]);
			if (visible.error || total.error || visible.count !== total.count) {
				const message =
					'Não foi possível confirmar quem já deu consentimento, por isso não foi enviado nenhum lembrete. Confirme que a migração islr_contributors_moderator_read está aplicada.';
				setFlash({ type: 'error', message }, event.cookies);
				return fail(500, { message, form });
			}

			// Read through the user's own client so RLS decides who can do this:
			// anyone without access to contributor_invites just gets an empty list.
			const { data: acceptedInvites, error: invitesError } = await event.locals.supabase
				.from('contributor_invites')
				.select('email, used_at, consent_reminded_at')
				.not('used_at', 'is', null);

			if (invitesError) {
				setFlash({ type: 'error', message: invitesError.message }, event.cookies);
				return fail(500, { message: invitesError.message, form });
			}

			const [{ data: profiles, error: profilesError }, { data: consented, error: consentedError }] =
				await Promise.all([
					event.locals.supabase
						.from('profiles')
						.select('id, email')
						.in(
							'email',
							acceptedInvites.map((invite) => invite.email)
						),
					event.locals.supabase.from('islr_contributors').select('id'),
				]);

			if (profilesError || consentedError) {
				const message = (profilesError ?? consentedError)!.message;
				setFlash({ type: 'error', message }, event.cookies);
				return fail(500, { message, form });
			}

			const consentedIds = new Set(consented.map((c) => c.id));
			const profileIdByEmail = new Map(
				profiles.map((profile) => [profile.email.toLowerCase(), profile.id])
			);
			const now = new Date();

			// Never-reminded first, then whoever was reminded longest ago, so
			// repeated clicks work through the whole list.
			const due = acceptedInvites
				.filter((invite) => {
					const profileId = profileIdByEmail.get(invite.email.toLowerCase());
					return (
						profileId &&
						!consentedIds.has(profileId) &&
						isResendDue(invite.consent_reminded_at, now)
					);
				})
				.sort((a, b) => (a.consent_reminded_at ?? '').localeCompare(b.consent_reminded_at ?? ''));

			if (due.length === 0) {
				const message =
					'Não há ninguém a quem enviar lembrete de consentimento - quem falta já recebeu um nas últimas 24 horas.';
				setFlash({ type: 'success', message }, event.cookies);
				return { form };
			}

			const batch = due.slice(0, BULK_RESEND_LIMIT);

			let sent = 0;
			const failures: string[] = [];

			for (const { email } of batch) {
				const { error: mailError } = await adminClient.functions.invoke(
					'send-consent-reminder-email',
					{
						headers: { 'x-islr-secret': env.ISLR_DIGEST_SECRET ?? '' },
						body: { email },
					}
				);
				if (mailError) {
					failures.push(`${email}: ${mailError.message}`);
					continue;
				}

				const { error: markError } = await event.locals.supabase
					.from('contributor_invites')
					.update({ consent_reminded_at: new Date().toISOString() })
					.eq('email', email);
				if (markError) {
					failures.push(`${email}: email enviado, mas não ficou registado (${markError.message})`);
					continue;
				}

				sent++;
			}

			const summary = [`Lembretes enviados: ${sent}.`];
			if (failures.length > 0) {
				summary.push(`Falharam ${failures.length}: ${failures.join(' | ')}`);
			}
			const leftOver = due.length - batch.length;
			if (leftOver > 0) {
				summary.push(
					`Ficaram ${leftOver} por enviar - aguarde cerca de uma hora antes de repetir, por causa do limite de envio do Gmail.`
				);
			}

			setFlash(
				{ type: failures.length > 0 ? 'error' : 'success', message: summary.join(' ') },
				event.cookies
			);

			return { form };
		}),
	resendPending: async (event) =>
		handleFormAction(
			event,
			resendPendingInvitesSchema,
			'resend-pending-invites',
			async (event, _userId, form) => {
				// Read through the user's own client so RLS decides who can do this:
				// anyone without access to contributor_invites just gets an empty list.
				const { data: pendingInvites, error: pendingError } = await event.locals.supabase
					.from('contributor_invites')
					.select('email, invite_sent_at')
					.is('used_at', null);

				if (pendingError) {
					setFlash({ type: 'error', message: pendingError.message }, event.cookies);
					return fail(500, { message: pendingError.message, form });
				}

				const now = new Date();

				// Never-sent first, then whoever was sent one longest ago, so
				// repeated clicks work through the whole list.
				const due = pendingInvites
					.filter((invite) => isResendDue(invite.invite_sent_at, now))
					.sort((a, b) => (a.invite_sent_at ?? '').localeCompare(b.invite_sent_at ?? ''));

				if (due.length === 0) {
					const message =
						pendingInvites.length === 0
							? 'Não há convites pendentes para reenviar.'
							: 'Não há convites para reenviar - os pendentes já receberam um nas últimas 24 horas.';
					setFlash({ type: 'success', message }, event.cookies);
					return { form };
				}

				const adminClient = createSupabaseAdminClient();

				const lookup = await listAuthUsersByEmail(adminClient);
				if (!lookup.ok) {
					setFlash({ type: 'error', message: lookup.reason }, event.cookies);
					return fail(500, { message: lookup.reason, form });
				}

				const batch = due
					.slice(0, BULK_RESEND_LIMIT)
					.map(({ email }) => ({ email, authUser: lookup.users.get(email.toLowerCase()) }));

				let sent = 0;
				const failures: string[] = [];

				for (const { email, authUser } of batch) {
					const cleared = await clearStaleInviteUserById(adminClient, email, authUser?.id ?? null);
					if (!cleared.ok) {
						failures.push(`${email}: ${cleared.reason}`);
						continue;
					}

					const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
						redirectTo: `${event.url.origin}/accept-invite`,
					});
					if (inviteError) {
						failures.push(`${email}: ${inviteError.message}`);
						continue;
					}

					const { error: markError } = await event.locals.supabase
						.from('contributor_invites')
						.update({ invite_sent_at: new Date().toISOString() })
						.eq('email', email);
					if (markError) {
						failures.push(
							`${email}: convite enviado, mas não ficou registado (${markError.message})`
						);
						continue;
					}

					sent++;
				}

				const summary = [`Convites reenviados: ${sent}.`];
				if (failures.length > 0) {
					summary.push(`Falharam ${failures.length}: ${failures.join(' | ')}`);
				}
				const leftOver = due.length - batch.length;
				if (leftOver > 0) {
					summary.push(
						`Ficaram ${leftOver} por reenviar - aguarde cerca de uma hora antes de repetir, por causa do limite de envio do Gmail.`
					);
				}

				setFlash(
					{ type: failures.length > 0 ? 'error' : 'success', message: summary.join(' ') },
					event.cookies
				);

				return { form };
			}
		),
	invite: async (event) =>
		handleFormAction(
			event,
			inviteContributorSchema,
			'invite-contributor',
			async (event, userId, form) => {
				const email = form.data.email.toLowerCase();

				// A still-open invite (sent but never accepted) means Supabase already
				// created an unconfirmed auth user for this email that never completed
				// signup - e.g. the link expired before they opened it. That's a
				// resend, not a conflict, so it skips the "already registered" guard
				// below and instead gets its stale auth user cleared out further down.
				const { data: existingInvite } = await event.locals.supabase
					.from('contributor_invites')
					.select('used_at')
					.eq('email', email)
					.maybeSingle();

				const isResend = !!existingInvite && existingInvite.used_at === null;

				const adminClient = createSupabaseAdminClient();

				// An email that's already a registered user can't get a Supabase
				// invite (and the upsert below would wrongly show them as "Pendente"
				// again), so give them the role directly and email them instead.
				if (!isResend) {
					const { data: existingProfile } = await event.locals.supabase
						.from('profiles')
						.select('id')
						.eq('email', email)
						.maybeSingle();

					if (existingProfile) {
						return promoteExistingUser(event, adminClient, form, existingProfile.id, email, userId);
					}
				}

				if (isResend) {
					// Supabase refuses to invite an email that already has a user, even
					// an unconfirmed one - so clear the leftover out first to get a
					// fresh link with a new expiry. Refuses (rather than deletes) if the
					// account looks like it's actually been used.
					const result = await clearStaleInviteUser(adminClient, email);
					if (!result.ok) {
						setFlash({ type: 'error', message: result.reason }, event.cookies);
						return fail(400, { message: result.reason, form });
					}
				}

				const { error: upsertError } = await event.locals.supabase
					.from('contributor_invites')
					.upsert(
						{
							email,
							role: 'contributor',
							invited_by: userId,
							used_at: null,
							invite_sent_at: new Date().toISOString(),
						},
						{ onConflict: 'email' }
					);

				if (upsertError) {
					setFlash({ type: 'error', message: upsertError.message }, event.cookies);
					return fail(500, { message: upsertError.message, form });
				}

				const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
					redirectTo: `${event.url.origin}/accept-invite`,
				});

				if (inviteError) {
					// Roll back - Supabase never actually created the account, so don't
					// leave a dangling "pending" row behind.
					await event.locals.supabase
						.from('contributor_invites')
						.delete()
						.eq('email', email)
						.is('used_at', null);
					setFlash({ type: 'error', message: inviteError.message }, event.cookies);
					return fail(500, { message: inviteError.message, form });
				}

				setFlash({ type: 'success', message: `Convite enviado para ${email}.` }, event.cookies);

				return { form };
			}
		),
};
