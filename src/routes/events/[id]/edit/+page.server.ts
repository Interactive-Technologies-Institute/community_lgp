import { createEventSchema } from '@/schemas/event';
import { handleSignInRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getEvent(id: string) {
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
		const imageUrl = event.locals.supabase.storage.from('events').getPublicUrl(eventData.image);
		return { ...eventData, image: undefined, imageUrl: imageUrl.data.publicUrl };
	}

	const eventData = await getEvent(event.params.id);

	return {
		updateForm: await superValidate(eventData, zod(createEventSchema), {
			id: 'update',
		}),
	};
};

export const actions = {
	default: async (event) => {
		const { session, user } = await event.locals.safeGetSession();
		if (!session || !user) {
			const errorMessage = 'Unauthorized.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(401, errorMessage);
		}

		const form = await superValidate(event.request, zod(createEventSchema), { id: 'update' });

		if (!form.valid) {
			const errorMessage = 'Invalid form.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return fail(400, { message: errorMessage, form });
		}

		let imagePath = '';
		if (form.data.image) {
			const imageFile = form.data.image;
			const fileExt = imageFile.name.split('.').pop();
			const filePath = `${Math.random()}.${fileExt}`;

			const { data: imageFileData, error: imageFileError } = await event.locals.supabase.storage
				.from('events')
				.upload(filePath, imageFile);

			if (imageFileError) {
				setFlash({ type: 'error', message: imageFileError.message }, event.cookies);
				return fail(500, { message: imageFileError.message, form });
			}

			imagePath = imageFileData.path;
		} else if (form.data.imageUrl) {
			imagePath = form.data.imageUrl.split('/').pop() ?? '';
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { imageUrl, ...data } = form.data;
		const { error: supabaseError } = await event.locals.supabase
			.from('events')
			.update({ ...data, user_id: user.id, image: imagePath })
			.eq('id', event.params.id);

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return redirect(303, `/events/${event.params.id}`);
	},
};
