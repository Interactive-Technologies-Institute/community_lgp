import { consentSchema } from '@/schemas/consent';
import { isIslrFeatureEnabled } from '@/server/islr';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

	if (user.role !== 'admin' && user.role !== 'contributor') {
		return redirect(302, '/');
	}

	if (!(await isIslrFeatureEnabled(event.locals.supabase))) {
		return redirect(302, '/');
	}

	const { data: contributor, error: contributorError } = await event.locals.supabase
		.from('islr_contributors')
		.select('id')
		.eq('id', user.id)
		.maybeSingle();

	if (contributorError) throw contributorError;

	if (contributor) {
		return redirect(302, '/islr-dataset/dashboard');
	}

	return {
		consent: await superValidate(zod(consentSchema), { id: 'consent' }),
	};
};

export const actions = {
	consent: async (event) =>
		handleFormAction(event, consentSchema, 'consent', async (event, userId, form) => {
			const { user } = await event.locals.safeGetSession();
			if (!user || (user.role !== 'admin' && user.role !== 'contributor')) {
				return fail(403, { message: 'Forbidden.', form });
			}

			if (!(await isIslrFeatureEnabled(event.locals.supabase))) {
				return fail(403, { message: 'ISLR feature is disabled.', form });
			}

			const { error: supabaseError } = await event.locals.supabase
				.from('islr_contributors')
				.insert({ id: userId });

			if (supabaseError && supabaseError.code !== '23505') {
				return fail(500, { message: supabaseError.message, form });
			}

			return redirect(303, '/islr-dataset/dashboard');
		}),
};
