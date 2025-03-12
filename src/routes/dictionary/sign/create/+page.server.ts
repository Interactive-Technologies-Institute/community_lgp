import { createSignSchema } from '@/schemas/signs';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { v4 as uuidv4 } from 'uuid';
import type { StorageError } from '@supabase/storage-js';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	return {
		createForm: await superValidate(zod(createSignSchema), {
			id: 'create-sign',
		}),
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(event, createSignSchema, 'create-sign', async (event, userId, form) => {
			async function uploadVideo(
				video: File
			): Promise<{ path: string; error: StorageError | null }> {
				const fileExt = video.name.split('.').pop();
				const filePath = `${userId}_${uuidv4()}.${fileExt}`;

				const { data: videoFileData, error: videoFileError } = await event.locals.supabase.storage
					.from('signs')
					.upload(filePath, video);

				if (videoFileError) {
					setFlash({ type: 'error', message: videoFileError.message }, event.cookies);
					return { path: '', error: videoFileError };
				}

				return { path: videoFileData.path, error: null };
			}

			let videoPath = '';
			if (form.data.video) {
				const { path, error } = await uploadVideo(form.data.video);
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				videoPath = path;
			} else if (form.data.videoUrl) {
				videoPath = form.data.videoUrl.split('/').pop() ?? '';
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { videoUrl, ...data } = form.data;
			const { error: supabaseError } = await event.locals.supabase.from('signs').insert({
				...data,
				user_id: userId,
				video: 'http://127.0.0.1:54321/storage/v1/object/public/signs/' + videoPath,
				annotation_array: data.annotationArray ?? [], // Match field name
				created_at: new Date().toISOString(), // Set current timestamp
				last_changed: new Date().toISOString(), // Set current timestamp
				selected: false, // Default value
				annotated: data.annotated ?? false, // Default value if not provided
				is_annotated: data.is_annotated ?? 0, // Default value if not provided
				written_annotation: data.written_annotation ?? null, // Handle optional fields
			});

			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, withFiles({ message: supabaseError.message, form }));
			}

			return redirect(303, '/dictionary');
		}),
};
