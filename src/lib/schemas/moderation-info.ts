import { z } from 'zod';

export const updateModerationInfoSchema = z.object({
	ref_id: z.number(),
	user_id: z.string(),
	status: z.enum(['approved', 'changes_requested', 'rejected']),
	comment: z.string().min(5, { message: 'Comment is required' }).max(500),
});

export type UpdateModerationInfoSchema = typeof updateModerationInfoSchema;
