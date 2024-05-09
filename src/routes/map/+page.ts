import { mapPinSchema } from '@/schemas/map-pin';
import type { UserProfileWithPin } from '@/types/types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ parent }) => {
	const { supabase, session, user, profile } = await parent();

	let profileWithPin: UserProfileWithPin | undefined;
	if (session && user && profile) {
		const { data: pinData } = await supabase
			.from('map_pins')
			.select('lng, lat')
			.eq('id', user.id)
			.single();
		profileWithPin = {
			...profile,
			pin: pinData,
		};
	}

	const { data: usersData } = await supabase.from('profiles').select('*, pin:map_pins( lng, lat )');

	const form = await superValidate(
		{
			lng: profileWithPin?.pin?.lng ?? 0,
			lat: profileWithPin?.pin?.lat ?? 0,
		},
		zod(mapPinSchema)
	);

	return {
		profile: profileWithPin,
		users: usersData ?? [],
		form,
	};
};
