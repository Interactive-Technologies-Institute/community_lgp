import { z } from 'zod';

export const updateModerationInfoSchema = z.object({
	refId: z.number(),
	status: z.enum(['approved', 'changes_requested', 'rejected']),
	comment: z.string().min(5, { message: 'Comment is required' }).max(500),
});

export type UpdateModerationInfoSchema = typeof updateModerationInfoSchema;
