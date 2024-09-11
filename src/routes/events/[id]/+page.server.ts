import { deleteEventSchema, toggleEventInterestSchema } from '@/schemas/event';
import type { EventWithAuthor, ModerationInfo } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { user } = await event.locals.safeGetSession();

	async function getEvent(id: string): Promise<EventWithAuthor> {
		const { data: eventData, error: eventError } = await event.locals.supabase
			.from('events_view')
			.select('*, author:profiles_view!inner(*)')
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

	async function getEventModeration(id: string): Promise<ModerationInfo[]> {
		const { data: moderation, error: moderationError } = await event.locals.supabase
			.from('events_moderation')
			.select('*')
			.eq('event_id', id)
			.order('inserted_at', { ascending: false });

		if (moderationError) {
			const errorMessage = 'Error fetching moderation, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return moderation;
	}

	async function getInterestCount(id: string): Promise<{ count: number; userInterested: boolean }> {
		const { data: interested, error: interestedError } = await event.locals.supabase
			.rpc('get_event_interest_count', {
				event_id: parseInt(id),
				user_id: user?.id,
			})
			.single();

		if (interestedError) {
			const errorMessage = 'Error fetching interest count, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return { count: interested.count, userInterested: interested.has_interest };
	}

	const interestCount = await getInterestCount(event.params.id);

	return {
		event: await getEvent(event.params.id),
		moderation: await getEventModeration(event.params.id),
		interestCount: interestCount.count,
		deleteForm: await superValidate(zod(deleteEventSchema), {
			id: 'delete-event',
		}),
		toggleInterestForm: await superValidate(
			{ value: interestCount.userInterested },
			zod(toggleEventInterestSchema),
			{
				id: 'toggle-event-interest',
			}
		),
	};
};

export const actions = {
	delete: async (event) =>
		handleFormAction(event, deleteEventSchema, 'delete-event', async (event, userId, form) => {
			const { error: supabaseError } = await event.locals.supabase
				.from('events')
				.delete()
				.eq('id', form.data.id);

			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, { message: supabaseError.message, form });
			}

			return redirect(303, '/events');
		}),
	toggleInterest: async (event) =>
		handleFormAction(
			event,
			toggleEventInterestSchema,
			'toggle-event-interest',
			async (event, userId, form) => {
				if (form.data.value) {
					const { error: supabaseError } = await event.locals.supabase
						.from('events_interested')
						.insert([
							{
								event_id: parseInt(event.params.id),
								user_id: userId,
							},
						]);

					if (supabaseError) {
						setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
						return fail(500, { message: supabaseError.message, form });
					}
				} else {
					const { error: supabaseError } = await event.locals.supabase
						.from('events_interested')
						.delete()
						.eq('event_id', parseInt(event.params.id))
						.eq('user_id', userId);

					if (supabaseError) {
						setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
						return fail(500, { message: supabaseError.message, form });
					}
				}

				return { form };
			}
		),
};
