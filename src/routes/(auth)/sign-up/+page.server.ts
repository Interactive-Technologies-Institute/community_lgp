import { signUpSchema } from '@/schemas/sign-up';
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
		form: await superValidate(zod(signUpSchema), { id: 'sign-up' }),
	};
};

export const actions = {
	default: async ({ request, cookies, url, locals: { supabase } }) => {
		const form = await superValidate(request, zod(signUpSchema), { id: 'sign-up' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				data: {
					display_name: form.data.displayName,
				},
				emailRedirectTo: `${url.origin}/auth/callback`,
			},
		});

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash(
			{ type: 'success', message: 'Please check your email for a confirmation link.' },
			cookies
		);
		return { form };
	},
};
