import { z } from 'zod';

export const consentSchema = z.object({
	consent: z.boolean().refine((value) => value === true, { message: 'Consent is required.' }),
});

export type ConsentSchema = typeof consentSchema;
