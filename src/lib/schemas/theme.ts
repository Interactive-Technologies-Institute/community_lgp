import { z } from 'zod';

export const createThemeSchema = z.object({
	id: z.number(),
	dictionary: z.string(),
	name: z.string(),
	is_parent: z.boolean(),
	children: z.array(z.string()).nullable(),
	parent: z.string().nullable(),
});

export const updateThemeSchema = z.object({
	dictionary: z.string(),
	name: z.string(),
	is_parent: z.boolean(),
	children: z.array(z.string()).nullable(),
	parent: z.string().nullable(),
});

export type CreateThemeSchema = typeof createThemeSchema;
export type UpdateThemeSchema = typeof updateThemeSchema;
