import { z } from 'zod';

export const updateModerationInfoSchema = z.object({
	ref_id: z.number(),
	user_id: z.string(),
	status: z.enum(['approved', 'changes_requested', 'rejected']),
	comment: z
		.string()
		.min(1, { message: 'Comment is required' })
		.max(500, { message: 'Comment must be less than 500 characters' }),
});

export type UpdateModerationInfoSchema = typeof updateModerationInfoSchema;
