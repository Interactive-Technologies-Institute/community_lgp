import { mapPinSchema } from '@/schemas/map-pin';
import type { UserProfileWithPin } from '@/types/types';
import { handleFormAction } from '@/utils';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session, user, profile } = await event.parent();

	let profileWithPin: UserProfileWithPin | undefined;
	if (session && user && profile) {
		const { data: pinData } = await event.locals.supabase
			.from('map_pins')
			.select('lng, lat')
			.eq('id', user.id)
			.single();
		profileWithPin = {
			...profile,
			pin: pinData,
		};
	}

	const { data: usersData } = await event.locals.supabase
		.from('profiles')
		.select('*, pin:map_pins( lng, lat )');

	const form = await superValidate(
		{
			lng: profileWithPin?.pin?.lng ?? 0,
			lat: profileWithPin?.pin?.lat ?? 0,
		},
		zod(mapPinSchema),
		{
			id: 'map-pin',
		}
	);

	return {
		profile: profileWithPin,
		users: usersData ?? [],
		form,
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(event, mapPinSchema, 'map-pin', async (event, userId, form) => {
			const { error } = await event.locals.supabase.from('map_pins').upsert({
				id: userId,
				...form.data,
			});

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			setFlash({ type: 'success', message: 'Your pin has been updated.' }, event.cookies);
			return { form };
		}),
};
