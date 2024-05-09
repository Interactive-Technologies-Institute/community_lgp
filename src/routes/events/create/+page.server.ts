import { createEventSchema } from '@/schemas/event';
import { handleSignInRedirect } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	return {
		createForm: await superValidate(zod(createEventSchema), {
			id: 'how-to',
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

		const form = await superValidate(event.request, zod(createEventSchema), { id: 'create' });

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
			.insert({ ...data, user_id: user.id, image: imagePath });

		if (supabaseError) {
			setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
			return fail(500, { message: supabaseError.message, form });
		}

		return redirect(303, '/events');
	},
};
