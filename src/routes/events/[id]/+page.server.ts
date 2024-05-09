import { deleteEventSchema } from '@/schemas/event';
import type { Event } from '@/types/types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { user } = await event.locals.safeGetSession();

	async function getEvent(id: string): Promise<Event> {
		const { data: eventData, error: eventError } = await event.locals.supabase
			.from('events')
			.select('*')
			.eq('id', id)
			.single();

		if (eventError) {
			const errorMessage = 'Error fetching event, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		const image = event.locals.supabase.storage.from('events').getPublicUrl(eventData.image);
		return { ...eventData, image: image.data.publicUrl };
	}

	async function getInterestCount(id: string): Promise<{ count: number; userInterested: boolean }> {
		const { data: interested, error: interestedError } = await event.locals.supabase
			.rpc('get_event_interest_count', {
				event_id: parseInt(id),
				user_id: user?.id ?? 'visitor',
			})
			.single();

		if (interestedError) {
			const errorMessage = 'Error fetching interest count, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return { count: interested.count, userInterested: interested.has_interest };
	}

	return {
		event: await getEvent(event.params.id),
		interestCount: await getInterestCount(event.params.id),
		deleteForm: await superValidate(zod(deleteEventSchema), {
			id: 'delete',
		}),
	};
};

export const actions = {
	delete: async (event) => {
		const { session } = await event.locals.safeGetSession();
		if (!session) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(deleteEventSchema), { id: 'delete' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('events')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return redirect(303, '/events');
	},
};
