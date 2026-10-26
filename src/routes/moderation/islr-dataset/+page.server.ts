import {
	clearStaleInviteUser,
	clearStaleInviteUserById,
	listAuthUsersByEmail,
} from '@/server/pending-invite';
import { announceContributorAccess } from '@/server/contributor-access';
import { createSupabaseAdminClient } from '@/server/supabase-admin';
import {
	inviteContributorSchema,
	type InviteContributorSchema,
} from '@/schemas/invite-contributor';
import { resendPendingInvitesSchema } from '@/schemas/resend-pending-invites';
import type { ContributorInvite } from '@/types/types';
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

	// Status is deliberately ignored: there is no peer review, so every
	// submitted video counts.
	const { data: submissions, error: submissionsError } = await event.locals.supabase
		.from('islr_submissions')
		.select('sign_id, contributor_id');

	if (submissionsError) {
		const errorMessage = 'Error fetching dataset submissions, please try again later.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}

	const videoCountByContributor = new Map<string, number>();
	for (const { contributor_id } of submissions) {
		videoCountByContributor.set(
			contributor_id,
			(videoCountByContributor.get(contributor_id) ?? 0) + 1
		);
	}

	// Invites are keyed by email, submissions by user id - bridge them through profiles.
	const { data: invitedProfiles, error: profilesError } = await event.locals.supabase
		.from('profiles')
		.select('id, email')
		.in(
			'email',
			invites.map((invite) => invite.email)
		);

	if (profilesError) {
		const errorMessage = 'Error fetching contributor profiles, please try again later.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}

	const videoCountByEmail: Record<string, number> = {};
	for (const profile of invitedProfiles) {
		videoCountByEmail[profile.email.toLowerCase()] = videoCountByContributor.get(profile.id) ?? 0;
	}

	return {
		invites,
		videoCountByEmail,
		datasetSummary: {
			signsRecorded: new Set(submissions.map((s) => s.sign_id)).size,
			videosRecorded: submissions.length,
			contributorsWhoRecorded: videoCountByContributor.size,
			contributorsInvited: invites.length,
		},
		inviteContributorForm: await superValidate(zod(inviteContributorSchema), {
			id: 'invite-contributor',
		}),
		resendPendingInvitesForm: await superValidate(zod(resendPendingInvitesSchema), {
			id: 'resend-pending-invites',
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

// Invite emails go out through Gmail SMTP, capped at 80 per hour. Keeping
// one batch well under that leaves room for other auth emails (single
// invites, password resets) in the same hour, and keeps the request short
// enough not to hit the host's function timeout.
const BULK_RESEND_LIMIT = 50;

export const actions = {
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
					.select('email')
					.is('used_at', null);

				if (pendingError) {
					setFlash({ type: 'error', message: pendingError.message }, event.cookies);
					return fail(500, { message: pendingError.message, form });
				}

				if (pendingInvites.length === 0) {
					const message = 'Não há convites pendentes para reenviar.';
					setFlash({ type: 'success', message }, event.cookies);
					return { form };
				}

				const adminClient = createSupabaseAdminClient();

				const lookup = await listAuthUsersByEmail(adminClient);
				if (!lookup.ok) {
					setFlash({ type: 'error', message: lookup.reason }, event.cookies);
					return fail(500, { message: lookup.reason, form });
				}

				// Every resend replaces the auth user, so its invited_at is when this
				// email last got an invite. Oldest first means repeated clicks work
				// through the whole list instead of re-sending the same batch.
				const batch = pendingInvites
					.map(({ email }) => ({ email, authUser: lookup.users.get(email.toLowerCase()) }))
					.sort((a, b) => (a.authUser?.invitedAt ?? '').localeCompare(b.authUser?.invitedAt ?? ''))
					.slice(0, BULK_RESEND_LIMIT);

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

					sent++;
				}

				const summary = [`Convites reenviados: ${sent}.`];
				if (failures.length > 0) {
					summary.push(`Falharam ${failures.length}: ${failures.join(' | ')}`);
				}
				const leftOver = pendingInvites.length - batch.length;
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
						{ email, role: 'contributor', invited_by: userId, used_at: null },
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
