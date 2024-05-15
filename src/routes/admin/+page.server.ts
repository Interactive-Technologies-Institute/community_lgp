import { updateFeaturesSchema } from '@/schemas/features';
import type { Feature } from '@/types/types';
import { handleSignInRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	let features: Feature[] = [];
	const { data } = await event.locals.supabase
		.from('feature_flags')
		.select('id')
		.eq('enabled', true);
	if (data) features = data.map((f: { id: Feature }) => f.id);

	return {
		updateFeatures: await superValidate(
			{
				howtos: features.includes('howtos'),
				events: features.includes('events'),
				map: features.includes('map'),
				academy: features.includes('academy'),
			},
			zod(updateFeaturesSchema),
			{
				id: 'update',
			}
		),
	};
};

export const actions = {
	default: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(updateFeaturesSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase.from('feature_flags').upsert([
			{ id: 'howtos', enabled: form.data.howtos },
			{ id: 'events', enabled: form.data.events },
			{ id: 'map', enabled: form.data.map },
			{ id: 'academy', enabled: form.data.academy },
		]);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return { form };
	},
};
