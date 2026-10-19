import { signInSchema } from '@/schemas/sign-in';
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
		form: await superValidate(zod(signInSchema), { id: 'sign-in' }),
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(
			event,
			signInSchema,
			'sign-in',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.auth.signInWithPassword({
					email: form.data.email,
					password: form.data.password,
				});

				if (error) {
					// Invited contributors who never finished /accept-invite have no
					// password at all, so this is the error they hit. Shown for every
					// bad login, so it doesn't reveal whether the account exists.
					const message =
						error.code === 'invalid_credentials'
							? 'Email ou palavra-passe incorretos. Se foi convidado como contribuidor e nunca chegou a definir uma palavra-passe, use "Esqueci-me da minha palavra-passe" para criar uma.'
							: error.message;
					setFlash({ type: 'error', message }, event.cookies);
					return fail(500, { message, form });
				}

				if (event.url.searchParams.has('redirectTo')) {
					return redirect(303, event.url.searchParams.get('redirectTo')!);
				}

				// Contributors land straight in their dashboard instead of the
				// homepage - that's where their work actually happens.
				const { user } = await event.locals.safeGetSession();
				if (user?.role === 'contributor') {
					return redirect(303, '/islr-dataset/dashboard');
				}

				return redirect(303, '/');
			},
			{ requireAuth: false }
		),
};
