import { updateModerationInfoSchema } from '@/schemas/moderation-info.js';
import type { MapPinWithModeration } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getMapPins(): Promise<MapPinWithModeration[]> {
		const query = event.locals.supabase
			.from('map_pins')
			.select('*, moderation:map_pins_moderation(status, updated_at, comment)')
			.order('updated_at', { ascending: false });

		const { data: mapPins, error: mapPinsError } = await query;

		if (mapPinsError) {
			const errorMessage = 'Error fetching how tos, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return mapPins as MapPinWithModeration[];
	}

	return {
		mapPins: await getMapPins(),
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
					.from('map_pins_moderation')
					.update({
						status: form.data.status,
						comment: form.data.comment,
					})
					.eq('map_pin_id', form.data.refId);

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				return { form };
			}
		),
};
