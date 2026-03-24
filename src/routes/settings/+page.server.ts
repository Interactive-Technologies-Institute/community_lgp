import { updatePasswordSchema } from '@/schemas/password';
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
    updatePassword: await superValidate(zod(updatePasswordSchema), {
      id: 'update-password',
    }),
  };
};

export const actions = {
  updatePassword: async (event) =>
    handleFormAction(
      event,
      updatePasswordSchema,
      'update-password',
      async (event, userId, form) => {
        const { data: verifyData } = await event.locals.supabase.rpc('verify_user_password', {
          password: form.data.currentPassword,
        });

        if (!verifyData) {
          setFlash({ type: 'error', message: 'Palavra passe atual incorreta.' }, event.cookies);
          return fail(500, { message: 'Palavra passe atual incorreta.', form });
        }

        const { error: updateError } = await event.locals.supabase.auth.updateUser({
          password: form.data.newPassword,
        });

        if (updateError) {
          setFlash({ type: 'error', message: updateError.message }, event.cookies);
          return fail(500, { message: updateError.message, form });
        }

        setFlash({ type: 'success', message: 'Password atualizada com sucesso.' }, event.cookies);
        return { form };
      }
    ),
};
