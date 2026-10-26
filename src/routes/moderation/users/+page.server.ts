import { updateUserRoleSchema } from '@/schemas/user-role';
import { announceContributorAccess } from '@/server/contributor-access';
import { createSupabaseAdminClient } from '@/server/supabase-admin';
import type { UserProfile } from '@/types/types';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}
	async function getUsers(): Promise<UserProfile[]> {
		const query = event.locals.supabase.from('profiles_view').select('*');

		const { data: users, error: usersError } = await query;

		if (usersError) {
			const errorMessage = 'Error fetching users, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return users as UserProfile[];
	}

	return {
		users: await getUsers(),
		updateUserRoleForm: await superValidate(zod(updateUserRoleSchema), {
			id: 'update-user-role',
		}),
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(
			event,
			updateUserRoleSchema,
			'update-user-role',
			async (event, loggedInUserId, form) => {
				const userId = form.data.userId;

				const { data: previous } = await event.locals.supabase
					.from('user_roles')
					.select('role')
					.eq('id', userId)
					.maybeSingle();

				const { error: supabaseError } = await event.locals.supabase
					.from('user_roles')
					.update({ role: form.data.role })
					.eq('id', userId);

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				// Same follow-up as "Convidar Contribuidor" for an existing account.
				// Other roles already had access to the dataset, so only user ->
				// contributor gets the email.
				if (previous?.role === 'user' && form.data.role === 'contributor') {
					const { data: profile } = await event.locals.supabase
						.from('profiles')
						.select('email')
						.eq('id', userId)
						.maybeSingle();

					const problems = profile?.email
						? await announceContributorAccess(
								createSupabaseAdminClient(),
								profile.email,
								loggedInUserId
							)
						: ['Utilizador sem email no perfil.'];

					setFlash(
						problems.length > 0
							? {
									type: 'error',
									message: `Passou a Contribuidor, mas: ${problems.join(' | ')}`,
								}
							: {
									type: 'success',
									message: `${profile!.email} passou a Contribuidor e recebeu um email a avisar.`,
								},
						event.cookies
					);
				}

				return { form };
			}
		),
};
