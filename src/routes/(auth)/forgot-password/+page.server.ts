import { forgotPasswordSchema } from '@/schemas/forgot-password';
import { handleFormAction } from '@/utils.js';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
  const { session } = await event.locals.safeGetSession();
  if (session) {
    return redirect(303, '/');
  }

  return {
    form: await superValidate(zod(forgotPasswordSchema), { id: 'forgot-password' }),
  };
};

export const actions = {
  default: async (event) =>
    handleFormAction(
      event,
      forgotPasswordSchema,
      'forgot-password',
      async (event, userId, form) => {
        const { error } = await event.locals.supabase.auth.resetPasswordForEmail(form.data.email);

        if (error) {
          setFlash({ type: 'error', message: error.message }, event.cookies);
          return fail(500, { message: error.message, form });
        }

        redirect(302, '/forgot-password/success');
        return { form };
      },
      { requireAuth: false }
    ),
};
