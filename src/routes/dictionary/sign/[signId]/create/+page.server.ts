import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSignSchema } from '@/schemas/sign';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect, error } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { v4 as uuidv4 } from 'uuid';
import type { StorageError } from '@supabase/storage-js';
import type { Parameter, Sign } from '@/types/types';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';

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

            let contextVideoPath = '';
            if (form.data.context_video instanceof File) {
                const { path, error } = await uploadVideo(form.data.context_video, 'context');
                if (error) {
                    return fail(500, withFiles({ message: error.message, form }));
                }
                contextVideoPath = path;
            } else if (typeof form.data.context_video === 'string') {
                contextVideoPath = form.data.context_video.split('/').pop() ?? '';
            }

            const { videoUrl, context_video_url, ...data } = form.data;
            const { data: insertedSign, error: supabaseError } = await event.locals.supabase
                .from('signs')
                .insert({
                    ...data,
                    created_by_user_id: userId,
                    video: PUBLIC_SUPABASE_URL + '/storage/v1/object/public/signs//' + videoPath,
                    annotation_array: data.annotation_array ?? Array(300).fill(0), // Match field name
                    created_at: new Date().toISOString(), // Set current timestamp
                    last_changed: new Date().toISOString(), // Set current timestamp
                    is_anotated: 0, // Default value if not provided
                    context_video:null,
                    main_sign_id: event.params.signId
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
