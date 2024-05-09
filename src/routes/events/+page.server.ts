import type { Event } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	async function getEvents(): Promise<Event[]> {
		const { data: events, error: eventsError } = await event.locals.supabase
			.from('events')
			.select('*');

		if (eventsError) {
			const errorMessage = 'Error fetching events, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return events;
	}

	return {
		events: await getEvents(),
	};
};
