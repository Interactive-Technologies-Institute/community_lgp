import { mapPinSchema } from '@/schemas/map-pin';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions = {
	default: async ({ request, cookies, locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		if (!session || !user) {
			setFlash({ type: 'error', message: 'Unauthorized' }, cookies);
			return fail(401, { message: 'Unauthorized' });
		}

		const form = await superValidate(request, zod(mapPinSchema), { id: 'map-pin' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error } = await supabase.from('map_pins').upsert({
			id: user.id,
			...form.data,
		});

		if (error) {
			setFlash({ type: 'error', message: error.message }, cookies);
			return fail(500, { message: error.message, form });
		}

		setFlash({ type: 'success', message: 'Your pin has been updated.' }, cookies);
		return { form };
	},
};
