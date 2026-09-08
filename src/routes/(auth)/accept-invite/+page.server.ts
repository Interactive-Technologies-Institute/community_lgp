import { acceptInviteSchema } from '@/schemas/accept-invite';
import { createSupabaseAdminClient } from '@/server/supabase-admin';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	return {
		acceptInvite: await superValidate(zod(acceptInviteSchema), {
			id: 'accept-invite',
		}),
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(
			event,
			acceptInviteSchema,
			'accept-invite',
			async (event, userId, form) => {
				const { error: passwordError } = await event.locals.supabase.auth.updateUser({
					password: form.data.newPassword,
				});

				if (passwordError) {
					setFlash({ type: 'error', message: passwordError.message }, event.cookies);
					return fail(500, { message: passwordError.message, form });
				}

				const { error: profileError } = await event.locals.supabase
					.from('profiles')
					.update({ display_name: form.data.displayName })
					.eq('id', userId);

				if (profileError) {
					setFlash({ type: 'error', message: profileError.message }, event.cookies);
					return fail(500, { message: profileError.message, form });
				}

				const { user } = await event.locals.safeGetSession();
				if (user?.email) {
					// Only now is the invite actually "accepted" - mark it used so the
					// admin table reflects real completion, not just that it was sent.
					// Regular clients can't write here (RLS restricts contributor_invites
					// to admins), so this needs the service-role client.
					await createSupabaseAdminClient()
						.from('contributor_invites')
						.update({ used_at: new Date().toISOString() })
						.eq('email', user.email.toLowerCase())
						.is('used_at', null);
				}

				setFlash({ type: 'success', message: 'Bem-vindo! A sua conta está pronta.' }, event.cookies);
				redirect(302, '/islr-dataset');

				return { form };
			}
		),
};
