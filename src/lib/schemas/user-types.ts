import { z } from 'zod';

export const updateUserTypesSchema = z.object({
	types: z
		.array(z.string().min(4, { message: 'Type must be at least 4 characters' }))
		.min(1, { message: 'At least one type is required' }),
	default: z.string(),
});

export type UpdateUserTypesSchema = typeof updateUserTypesSchema;
