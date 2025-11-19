import { PUBLIC_R2_PUBLIC_URL } from '$env/static/public';
import { 
    CLOUDFLARE_R2_ACCOUNT_ID, 
    CLOUDFLARE_R2_ACCESS_KEY_ID, 
    CLOUDFLARE_R2_SECRET_ACCESS_KEY,
} from '$env/static/private';
import { createSignSchema, deleteSignSchema } from '@/schemas/sign';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import type { Parameter, Sign } from '@/types/types';
import { fail, error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { v4 as uuidv4 } from 'uuid';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    // Disable checksum validation for R2 compatibility
    requestChecksumCalculation: 'WHEN_REQUIRED',
});

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
			async function uploadVideoToR2(
				video: File,
				folder: string = ''
			): Promise<{ path: string; error: Error | null }> {
				try {
					const fileExt = video.name.split('.').pop();
					const fileName = `${userId}_${uuidv4()}.${fileExt}`;
					
					// Build the full path within R2: signs/[folder]/filename
					const filePath = folder 
						? `signs/${folder}/${fileName}` 
						: `signs/${fileName}`;

					// Convert File to Buffer
					const arrayBuffer = await video.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);

					// Upload to R2
					const command = new PutObjectCommand({
						Bucket: 'dclgp',
						Key: filePath,
						Body: buffer,
						ContentType: video.type || 'video/mp4',
					});

					await r2Client.send(command);

					return { path: filePath, error: null };
				} catch (err) {
					const error = err as Error;
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return { path: '', error };
				}
			}

			let videoPath = '';
			if (form.data.video instanceof File) {
				const { path, error } = await uploadVideoToR2(form.data.video);
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				videoPath = path;
			} else if (typeof form.data.video === 'string') {
				// Extract the path from existing R2 URL
				videoPath = form.data.video.replace(PUBLIC_R2_PUBLIC_URL + '/', '');
			}

			let contextVideo = '';
			let contextVideoUrl = '';
			if (form.data.context_video instanceof File) {
				const { path, error } = await uploadVideoToR2(form.data.context_video, 'context');
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				contextVideo = path;
				contextVideoUrl = `${PUBLIC_R2_PUBLIC_URL}/${contextVideo}`;
			} else if (form.data.context_video_url) {
				contextVideoUrl = form.data.context_video_url;
				// Extract path from existing URL for storage reference
				contextVideo = form.data.context_video_url.replace(PUBLIC_R2_PUBLIC_URL + '/', '');
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
					video: `${PUBLIC_R2_PUBLIC_URL}/${videoPath}`,
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

			// Helper function to delete file from R2
			async function deleteFromR2(fileUrl: string): Promise<void> {
				if (!fileUrl || fileUrl.trim() === '') return;
				
				try {
					// Extract the key from the R2 URL
					let key = fileUrl.replace(PUBLIC_R2_PUBLIC_URL + '/', '');
					
					// Remove any leading slashes
					key = key.replace(/^\/+/, '');
					
					if (!key) {
						console.log('No valid key extracted from URL:', fileUrl);
						return;
					}

					console.log('Attempting to delete from R2:', key);

					const command = new DeleteObjectCommand({
						Bucket: 'dclgp',
						Key: key,
						// Explicitly disable checksum for delete
						ChecksumAlgorithm: undefined,
					});

					const response = await r2Client.send(command);
					console.log('Delete response:', response);
					console.log('Successfully deleted from R2:', key);
				} catch (err) {
					console.error(`Failed to delete file from R2: ${fileUrl}`, err);
					// Don't fail the entire operation if file deletion fails
				}
			}

			// Delete videos from R2
			if (sign.video) {
				await deleteFromR2(sign.video);
			}
			if (sign.context_video) {
				await deleteFromR2(sign.context_video);
			}

			// Delete from database
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