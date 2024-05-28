import { z } from 'zod';

export const updateUserTypesSchema = z.object({
	types: z.array(z.string().min(4)).min(1),
	default: z.string(),
});

export type UpdateUserTypesSchema = typeof updateUserTypesSchema;
