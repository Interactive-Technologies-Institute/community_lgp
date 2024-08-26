import { mapPinSchema } from '@/schemas/map-pin';
import type { ModerationInfo, UserProfileWithPin } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session, user, profile } = await event.parent();

	let profileWithPin: UserProfileWithPin | undefined;
	if (session && user && profile) {
		const { data: pinData } = await event.locals.supabase
			.from('map_pins')
			.select('*')
			.eq('user_id', user.id)
			.single();
		profileWithPin = {
			...profile,
			pin: pinData,
		};
	}

	async function getMapPinModeration(id: string): Promise<ModerationInfo> {
		const { data: moderation, error: moderationError } = await event.locals.supabase
			.from('map_pins_moderation')
			.select('*')
			.eq('map_pin_id', id)
			.single();

		if (moderationError) {
			const errorMessage = 'Error fetching moderation, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return moderation;
	}

	const { data: usersData } = await event.locals.supabase
		.from('profiles_view')
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
		moderation: profileWithPin ? await getMapPinModeration(profileWithPin.id) : undefined,
		users: usersData ?? [],
		form,
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(event, mapPinSchema, 'map-pin', async (event, userId, form) => {
			const { error } = await event.locals.supabase
				.from('map_pins')
				.update(form.data)
				.eq('user_id', userId);

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			setFlash({ type: 'success', message: 'Your pin has been updated.' }, event.cookies);
			return { form };
		}),
};
