import { updateModerationInfoSchema } from '@/schemas/moderation-info';
import type { EventWithModeration } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getEvents(): Promise<EventWithModeration[]> {
		const query = event.locals.supabase
			.from('events')
			.select('*, moderation:latest_events_moderation(status, inserted_at, comment)')
			.order('updated_at', { ascending: false });

		const { data: events, error: eventsError } = await query;

		if (eventsError) {
			const errorMessage = 'Error fetching events, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return events;
	}

	return {
		events: await getEvents(),
		updateModerationForm: await superValidate(zod(updateModerationInfoSchema), {
			id: 'update-moderation',
		}),
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(
			event,
			updateModerationInfoSchema,
			'update-moderation',
			async (event, userId, form) => {
				const { error: supabaseError } = await event.locals.supabase
					.from('events_moderation')
					.insert({
						event_id: form.data.ref_id,
						user_id: form.data.user_id,
						status: form.data.status,
						comment: form.data.comment,
					});

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				return { form };
			}
		),
};
