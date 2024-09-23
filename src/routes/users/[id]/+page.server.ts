import { handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();

	let id = event.params.id;
	if (id === 'me') {
		if (!session || !user) {
			return redirect(302, handleSignInRedirect(event));
		}
		id = user.id;
	}

	const { data: userProfile } = await event.locals.supabase
		.from('profiles_view')
		.select('*')
		.eq('id', id)
		.single();

	if (!userProfile) {
		return error(404, 'User not found');
	}

	const { data: howTos } = await event.locals.supabase
		.from('howtos_view')
		.select('id, label:title')
		.order('moderation_status', { ascending: true })
		.order('inserted_at', { ascending: false })
		.eq('user_id', id);
	const { data: events } = await event.locals.supabase
		.from('events_view')
		.select('id, label:title')
		.order('moderation_status', { ascending: true })
		.order('inserted_at', { ascending: false })
		.eq('user_id', id);
	const { data: mapPin } = await event.locals.supabase
		.from('map_pins_view')
		.select('lng, lat')
		.eq('user_id', id)
		.single();

	return {
		userProfile,
		howTos: howTos,
		events: events,
		mapPin: mapPin,
	};
};
