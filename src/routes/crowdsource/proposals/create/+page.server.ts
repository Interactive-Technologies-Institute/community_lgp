import { createProposalSchema } from "@/schemas/cs-proposal";
import { handleFormAction, handleSignInRedirect } from "@/utils";
import { fail, redirect } from "@sveltejs/kit";
import type { StorageError } from '@supabase/storage-js';
import { v4 as uuidv4 } from 'uuid';
import { superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { setFlash } from "sveltekit-flash-message/server";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";

export const load = async (event) => {
    const { session } = await event.locals.safeGetSession();
    if (!session) {
        return redirect(302, handleSignInRedirect(event));
    }

    return {
        createForm: await superValidate(zod(createProposalSchema), {
            id: 'create-proposal',
        }),
    };
};

export const actions = {
    create: async(event) => {
        return handleFormAction(event, createProposalSchema, 'create-proposal', async(event, userId, form) => {
            async function uploadVideo(
				video: File,
				folder: string = ''
			): Promise<{ path: string; error: StorageError | null }> {
				const fileExt = video.name.split('.').pop();
				const fileName = `${userId}_${uuidv4()}.${fileExt}`;
				const filePath = folder ? `${folder}/${fileName}` : fileName;
                const arrayBuffer = await video.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
				const { data: videoFileData, error: videoFileError } = await event.locals.supabase.storage
					.from('proposals')
					.upload(filePath, buffer, {contentType : 'video/mp4',});

                    
				if (videoFileError) {
					return { path: '', error: videoFileError };
				}
                
				return { path: videoFileData.path, error: null };
                
			}

			let videoPath = '';
            
			if (form.data.content_video instanceof File) {
                console.log('file info', form.data.content_video);
				const { path, error } = await uploadVideo(form.data.content_video);
				if (error) {
					return fail(500, withFiles({ message: error.message, form }));
				}
				videoPath = path;
                console.log('videoPath : ', videoPath)
			} else if (typeof form.data.content_video === 'string') {
				videoPath = form.data.content_video.split('/').pop() ?? '';
			}

            const { content_video_url, ...data } = form.data;
            const { data: proposal, error: supabaseError } = await event.locals.supabase
                .from('crowdsource_proposals')
                .insert({
                    ...data,
                    user_id: userId,
                    content_text: data.content_text ?? "",
                    content_video: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/proposals/` + videoPath,
                    created_at: new Date().toISOString(),
                    last_edited_at: new Date().toISOString(),
                })
                .select()
                .single()
            if(supabaseError){
                
				return fail(500, withFiles({ message: supabaseError.message, form }));
            }

            return redirect(303, `/crowdsource/proposals/${proposal.id}`)
        })
    }
}