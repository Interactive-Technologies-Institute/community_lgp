import { z } from 'zod';

export const submitIslrVideoSchema = z.object({
	signId: z.coerce.number(),
	video: z.instanceof(File),
});

export type SubmitIslrVideoSchema = typeof submitIslrVideoSchema;
