import { PUBLIC_R2_PUBLIC_URL } from '$env/static/public';
import { 
	CLOUDFLARE_R2_ACCOUNT_ID, 
	CLOUDFLARE_R2_ACCESS_KEY_ID, 
	CLOUDFLARE_R2_SECRET_ACCESS_KEY,
} from '$env/static/private';
import { createSignSchema } from '@/schemas/sign';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect, error } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { v4 as uuidv4 } from 'uuid';
import type { StorageError } from '@supabase/storage-js';
import type { Parameter, Sign } from '@/types/types';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client
const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
		secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
	},
	requestChecksumCalculation: 'WHEN_REQUIRED',
});

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getSign(): Promise<Sign> {
		const { data: sign, error: signError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('id', event.params.signId)
			.single();

		if (signError) {
			const errorMessage = `Error sign with ID ${event.params.signId}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return sign;
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

	return {
		createForm: await superValidate(zod(createSignSchema), {
			id: 'create-sign',
		}),
		sign: await getSign(),
		parameters: await getParameters(),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(event, createSignSchema, 'create-sign', async (event, userId, form) => {
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
				videoPath = form.data.video.replace(PUBLIC_R2_PUBLIC_URL + '/', '');
			}

			let descriptionVideoPath = '';
			if (form.data.description instanceof File) {
				const { path, error } = await uploadVideoToR2(form.data.description, 'description');
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				descriptionVideoPath = path;
			} else if (typeof form.data.description === 'string') {
				descriptionVideoPath = form.data.description.replace(PUBLIC_R2_PUBLIC_URL + '/', '');
			}

			const { videoUrl, descriptionVideoUrl, ...data } = form.data;
			const { data: insertedSign, error: supabaseError } = await event.locals.supabase
				.from('signs')
				.insert({
					...data,
					created_by_user_id: userId,
					video: PUBLIC_R2_PUBLIC_URL + '/' + videoPath,
					annotation_array: data.annotation_array ?? Array(300).fill(0), // Match field name
					created_at: new Date().toISOString(), // Set current timestamp
					last_changed: new Date().toISOString(), // Set current timestamp
					is_anotated: 0, // Default value if not provided
					context_video: null,
					main_sign_id: event.params.signId,
				})
				.select()
				.single();
			if (supabaseError) {
				setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
				return fail(500, withFiles({ message: supabaseError.message, form }));
			}
			return redirect(303, `/dictionary/sign/${insertedSign.id}`);
		}),
};