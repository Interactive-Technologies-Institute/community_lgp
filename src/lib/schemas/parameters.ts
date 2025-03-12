import { z } from 'zod';

export const updateParameterSchema = z.object({
	id: z.number(),
	type: z.string(),
	code: z.string(),
	name: z.string().nullable(),
	is_parent: z.boolean(),
	children: z.array(z.string()).nullable(),
	parent: z.string().nullable(),
	image: z.string().nullable(),
});

export type UpdateFeaturesSchema = typeof updateParameterSchema;
