import { z } from 'zod';

export const submitIslrVideoSchema = z.object({
	signId: z.coerce.number(),
});

export type SubmitIslrVideoSchema = typeof submitIslrVideoSchema;
