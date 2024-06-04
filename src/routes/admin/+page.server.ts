import { updateBrandingSchema } from '@/schemas/branding';
import { updateFeaturesSchema } from '@/schemas/features';
import { updateUserTypesSchema } from '@/schemas/user-types';
import type { Branding, Feature, UserType } from '@/types/types';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect } from '@sveltejs/kit';
import slugify from 'slugify';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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

	let branding: Branding | null = null;
	const { data: brandingData } = await event.locals.supabase.from('branding').select().single();
	if (brandingData) branding = brandingData;

	let userTypes: UserType[] = [];
	const { data: userTypesData } = await event.locals.supabase.from('user_types').select();
	if (userTypesData) userTypes = userTypesData;

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
				id: 'update-features',
			}
		),
		updateBranding: await superValidate(branding, zod(updateBrandingSchema), {
			id: 'update-branding',
		}),
		updateUserTypes: await superValidate(
			{
				types: userTypes.map((t) => t.label),
				default: userTypes.find((t) => t.is_default)?.label,
			},
			zod(updateUserTypesSchema),
			{
				id: 'update-user-types',
			}
		),
	};
};

export const actions = {
	updateFeatures: async (event) =>
		handleFormAction(
			event,
			updateFeaturesSchema,
			'update-features',
			async (event, userId, form) => {
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
			}
		),
	updateBranding: async (event) =>
		handleFormAction(
			event,
			updateBrandingSchema,
			'update-branding',
			async (event, userId, form) => {
				const { error: supabaseError } = await event.locals.supabase
					.from('branding')
					.upsert({ id: 1, ...form.data });

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				return { form };
			}
		),
	updateUserTypes: async (event) =>
		handleFormAction(
			event,
			updateUserTypesSchema,
			'update-user-types',
			async (event, userId, form) => {
				const { error: supabaseError } = await event.locals.supabase.rpc('update_user_types', {
					types: form.data.types.map((t) => ({
						slug: slugify(t, { lower: true, trim: true }),
						label: t,
						is_default: t === form.data.default,
					})),
				});

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				return { form };
			}
		),
};
