import { resetPasswordSchema } from '@/schemas/password';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
  const { session, user } = await event.locals.safeGetSession();
  if (!session) {
    return redirect(302, handleSignInRedirect(event));
  }

  let id = event.params.id;
  if (id === 'me') {
    if (!session || !user) {
      return redirect(302, handleSignInRedirect(event));
    }
    id = user.id;
  }

  return {
    resetPassword: await superValidate(zod(resetPasswordSchema), {
      id: 'reset-password',
    }),
  };
};

export const actions = {
  resetPassword: async (event) =>
    handleFormAction(
      event,
      resetPasswordSchema,
      'reset-password',
      async (event, userId, form) => {
        const { error: resetError } = await event.locals.supabase.auth.updateUser({
          password: form.data.newPassword,
        });

        if (resetError) {
          setFlash({ type: 'error', message: resetError.message }, event.cookies);
          return fail(500, { message: resetError.message, form });
        }

        setFlash({ type: 'success', message: 'Password redifinida com sucesso.' }, event.cookies);
        
        await event.locals.supabase.auth.signOut();
        redirect(302, '/');

        return { form };
      }
    ),
};
