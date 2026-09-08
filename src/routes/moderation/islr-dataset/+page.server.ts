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

	return {
		invites: await getInvites(),
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

				// Guard against re-inviting an email that's already a registered user
				// (possibly already an accepted contributor) - otherwise the upsert
				// below would reset used_at to null and the admin table would wrongly
				// show them as "Pendente" again once Supabase rejects the invite.
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

				const adminClient = createSupabaseAdminClient();
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
