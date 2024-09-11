import { updateModerationInfoSchema } from '@/schemas/moderation-info.js';
import type { HowToWithModeration } from '@/types/types';
import { handleFormAction } from '@/utils';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	async function getHowTos(): Promise<HowToWithModeration[]> {
		const query = event.locals.supabase
			.from('howtos')
			.select('*, moderation:latest_howtos_moderation!inner(status, inserted_at, comment)')
			.order('updated_at', { ascending: false });

		const { data: howTos, error: howTosError } = await query;

		if (howTosError) {
			const errorMessage = 'Error fetching how tos, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return howTos;
	}

	return {
		howTos: await getHowTos(),
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
					.from('howtos_moderation')
					.insert({
						howto_id: form.data.ref_id,
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
