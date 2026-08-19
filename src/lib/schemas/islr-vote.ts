import { z } from 'zod';

export const submitIslrVoteSchema = z.object({
	submissionId: z.coerce.number(),
	decision: z.enum(['accept', 'reject']),
});

export type SubmitIslrVoteSchema = typeof submitIslrVoteSchema;
