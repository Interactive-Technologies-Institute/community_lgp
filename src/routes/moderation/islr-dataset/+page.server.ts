import { clearStaleInviteUser } from '@/server/pending-invite';
import { createSupabaseAdminClient } from '@/server/supabase-admin';
import { inviteContributorSchema } from '@/schemas/invite-contributor';
import type { ContributorInvite } from '@/types/types';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
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
	};
};

export const actions = {
	default: async (event) =>
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

				// Guard against re-inviting an email that's already a registered user
				// (possibly already an accepted contributor) - otherwise the upsert
				// below would reset used_at to null and the admin table would wrongly
				// show them as "Pendente" again once Supabase rejects the invite.
				if (!isResend) {
					const { data: existingProfile } = await event.locals.supabase
						.from('profiles')
						.select('id')
						.eq('email', email)
						.maybeSingle();

					if (existingProfile) {
						const errorMessage = `Já existe uma conta registada com o email ${email}. Use o separador Utilizadores para lhe atribuir o papel de Contributor.`;
						setFlash({ type: 'error', message: errorMessage }, event.cookies);
						return fail(400, { message: errorMessage, form });
					}
				}

				const adminClient = createSupabaseAdminClient();

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

				setFlash(
					{ type: 'success', message: `Convite enviado para ${email}.` },
					event.cookies
				);

				return { form };
			}
		),
};
