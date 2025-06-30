import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSignSchema, deleteSignSchema } from '@/schemas/sign';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import type { StorageError } from '@supabase/storage-js';
import type { Parameter, Sign } from '@/types/types';
import { fail, error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { v4 as uuidv4 } from 'uuid';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getSign(id: string): Promise<Sign> {
		const { data: sign, error: signError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('id', id)
			.single();

		if (signError) {
			const errorMessage = `Error fetching sign with ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return { ...sign };
	}

	async function getParameters(): Promise<Parameter[]> {
		const { data: parameters, error: parametersError } = await event.locals.supabase
			.from('parameters')
			.select('*');

		if (parametersError) {
			const errorMessage = 'Error fetching parameters, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return parameters as Parameter[];
	}

	async function getParametersByIds(ids: number[]): Promise<Parameter[]> {
		const { data: parametersById, error: parametersError } = await event.locals.supabase
			.from('parameters')
			.select('*')
			.in('id', ids);

		if (parametersError) {
			const errorMessage = `Error fetching parameters, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return parametersById as Parameter[];
	}

	const sign = await getSign(event.params.id);
	let parametersById: Parameter[] = [];

	if (sign) {
		if (sign.annotation_array && sign.annotation_array.length > 0) {
			if (sign.annotation) {
				const annotationIds: number[] = Object.values(sign.annotation)
					.flat()
					.map((id) => parseInt(id, 10))
					.filter((id) => !isNaN(id));

				parametersById = await getParametersByIds(annotationIds);
			}
		}
	}
	const safeSign = {
		...sign,
		context_video: sign.context_video ?? '',
		video: sign.video ?? '',
		videoUrl: sign.video ?? '',
		context_video_url: sign.context_video ?? '',
	};
	let parameters: Parameter[] = await getParameters();
	return {
		sign: safeSign,
		updateForm: await superValidate(safeSign, zod(createSignSchema), {
			id: 'update-sign',
		}),
		deleteForm: await superValidate(zod(deleteSignSchema), {
			id: 'delete-sign',
		}),
		parameters: parameters,
		parametersById: parametersById,
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(event, createSignSchema, 'update-sign', async (event, userId, form) => {
			async function uploadVideo(
				video: File,
				folder: string = ''
			): Promise<{ path: string; error: StorageError | null }> {
				const fileExt = video.name.split('.').pop();
				const fileName = `${userId}_${uuidv4()}.${fileExt}`;
				const filePath = folder ? `${folder}/${fileName}` : fileName;

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
			if (form.data.video instanceof File) {
				const { path, error } = await uploadVideo(form.data.video);
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				videoPath = path;
			} else if (typeof form.data.video === 'string') {
				videoPath = form.data.video.split('/').pop() ?? '';
			}

			let contextVideo = '';
			let contextVideoUrl = '';
			if (form.data.context_video instanceof File) {
				const { path, error } = await uploadVideo(form.data.context_video, 'context');
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				contextVideo = path;
				contextVideoUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/signs/${contextVideo}`;
			} else if (form.data.context_video_url) {
				contextVideoUrl = form.data.context_video_url;
				// Extract path from existing URL for storage reference
				const urlParts = form.data.context_video_url.split('/');
				contextVideo = urlParts[urlParts.length - 1];
			} else {
				contextVideoUrl = '';
				contextVideo = '';
			}

			const { videoUrl, context_video_url, ...data } = form.data;
			const { error: supabaseError } = await event.locals.supabase
				.from('signs')
				.update({
					annotation: data.annotation,
					annotation_array: data.annotation_array,
					is_anotated: data.is_anotated,
					annotated_by_user_id: userId,
					name: data.name,
					theme: data.theme,
					theme_flattened: data.theme_flattened,
					video: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/signs/` + videoPath,
					description: data.description,
					context_video: contextVideoUrl,
					sentence: data.sentence,
					frequency: data.frequency,
					district: data.district,
				})
				.eq('id', parseInt(event.params.id));
			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, withFiles({ message: supabaseError.message, form }));
			}

			return redirect(303, '/dictionary/sign/' + event.params.id);
		}),
	delete: async (event) =>
		handleFormAction(event, deleteSignSchema, 'delete-sign', async (event, form) => {
			
			const { data: sign, error: fetchError } = await event.locals.supabase
			.from('signs')
			.select('video, context_video')
			.eq('id', parseInt(event.params.id))
			.single();

			if (fetchError) {
			setFlash({ type: 'error', message: fetchError.message }, event.cookies);
			return fail(500, { message: fetchError.message, form });
		}

		let mainVideo = `signs/${sign.video}`
		let contextVideo = `signs/context/${sign.context_video}`

		if (mainVideo) {
			await event.locals.supabase.storage.from('signs').remove([mainVideo]);
		}
		if (contextVideo) {
			await event.locals.supabase.storage.from('signs').remove([contextVideo]);
		}
			
			const { error: supabaseError } = await event.locals.supabase
				.from('signs')
				.delete()
				.eq('id', parseInt(event.params.id));

			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, { message: supabaseError.message, form });
			}

			return redirect(303, '/annotate');
		}),
};
