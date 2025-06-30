import { z } from 'zod';

export const updateModerationInfoSchema = z.object({
	ref_id: z.number(),
	user_id: z.string(),
	status: z.enum(['approved', 'changes_requested', 'rejected']),
	comment: z
		.string()
		.min(1, { message: 'Comentário é necessário.' })
		.max(500, { message: 'O comentário tem de ter menos de 500 caracteres.' }),
});

export type UpdateModerationInfoSchema = typeof updateModerationInfoSchema;
