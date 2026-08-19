import { z } from 'zod';

export const consentSchema = z.object({
	consent: z.literal('true'),
});

export type ConsentSchema = typeof consentSchema;
