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
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				if (event.url.searchParams.has('redirectTo')) {
					return redirect(303, event.url.searchParams.get('redirectTo')!);
				}
				return redirect(303, '/');
			},
			{ requireAuth: false }
		),
};
