import { mapPinSchema } from '@/schemas/map-pin';
import type { ModerationInfo, UserProfileWithPin, UserType } from '@/types/types';
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
			.from('map_pins_view')
			.select('*')
			.eq('user_id', user.id)
			.single();
		profileWithPin = {
			...profile,
			pin: pinData,
		};
	}

	async function getUserTypes(): Promise<UserType[]> {
		const { data: userTypes, error: userTypesError } = await event.locals.supabase
			.from('user_types')
			.select('*');

		if (userTypesError) {
			const errorMessage = 'Error fetching user types, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return userTypes;
	}

	async function getMapPinModeration(id: number): Promise<ModerationInfo[]> {
		const { data: moderation, error: moderationError } = await event.locals.supabase
			.from('map_pins_moderation')
			.select('*')
			.eq('map_pin_id', id)
			.order('inserted_at', { ascending: false });

		if (moderationError) {
			const errorMessage = 'Error fetching moderation, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return moderation;
	}

	async function getUsersWithMapPins(): Promise<UserProfileWithPin[]> {
		const { data: mapPins, error: mapPinsError } = await event.locals.supabase
			.from('profiles_view')
			.select('*, pin:map_pins_view(*)');

		if (mapPinsError) {
			const errorMessage = 'Error fetching map pins, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return mapPins;
	}

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
		moderation: profileWithPin?.pin ? await getMapPinModeration(profileWithPin.pin.id) : undefined,
		userTypes: await getUserTypes(),
		users: await getUsersWithMapPins(),
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
