import { deleteHowToSchema } from '@/schemas/how-to';
import type { HowTo } from '@/types/types';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { user } = await event.locals.safeGetSession();

	async function getHowTo(id: string): Promise<HowTo> {
		const { data: howTo, error: howToError } = await event.locals.supabase
			.from('howtos')
			.select('*')
			.eq('id', id)
			.single();

		if (howToError) {
			const errorMessage = 'Error fetching how to, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		const image = event.locals.supabase.storage.from('howtos').getPublicUrl(howTo.image);
		const stepsWithImageUrl = howTo.steps.map((step) => {
			const stepImage = event.locals.supabase.storage.from('howtos').getPublicUrl(step.image);
			return { ...step, image: stepImage.data.publicUrl };
		});
		return { ...howTo, image: image.data.publicUrl, steps: stepsWithImageUrl };
	}

	async function getUsefulCount(id: string): Promise<{ count: number; userUseful: boolean }> {
		const { data: usefuls, error: usefulsError } = await event.locals.supabase
			.rpc('get_howto_useful_count', {
				howto_id: parseInt(id),
				user_id: user?.id ?? 'visitor',
			})
			.single();

		if (usefulsError) {
			const errorMessage = 'Error fetching useful count, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return { count: usefuls.count, userUseful: usefuls.has_useful };
	}

	return {
		howTo: await getHowTo(event.params.id),
		usefulCount: await getUsefulCount(event.params.id),
		deleteForm: await superValidate(zod(deleteHowToSchema), {
			id: 'delete-howto',
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

		const form = await superValidate(event.request, zod(deleteHowToSchema), { id: 'delete-howto' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		const { error: supabaseError } = await event.locals.supabase
			.from('howtos')
			.delete()
			.eq('id', form.data.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return redirect(303, '/how-to');
	},
};
