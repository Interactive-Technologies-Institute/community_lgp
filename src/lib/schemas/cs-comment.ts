import { z } from 'zod';

export const createCommentSchema = z
    .object({
        content_text: z
            .string()
            .max(5000, { message: 'O texto do comentário tem que ter menos de 5000 caracteres.' })
            .optional()
            .transform(val => val === '' ? undefined : val),
        content_video: z
            .instanceof(File)
            .optional()
            .refine(
                (file) => {
                    if (!file) return true; // optional
                    if (file.size === 0) return true; // empty file is ok
                    // Check if it's a video file
                    return file.type.startsWith('video/');
                },
                { message: 'O ficheiro deve ser um vídeo válido.' }
            )
            .refine(
                (file) => {
                    if (!file || file.size === 0) return true;
                    // Max file size 50MB
                    return file.size <= 50 * 1024 * 1024;
                },
                { message: 'O vídeo deve ter menos de 50MB.' }
            ),
    })
    .refine(
        (data) => {
            const hasText = data.content_text && data.content_text.trim().length > 0;
            const hasVideo = data.content_video && data.content_video.size > 0;
            return hasText || hasVideo;
        },
        {
            message: 'O comentário precisa de ter ou um vídeo ou texto.',
            path: ['content_text'],
        }
    );

export type CreateCommentSchema = typeof createCommentSchema;