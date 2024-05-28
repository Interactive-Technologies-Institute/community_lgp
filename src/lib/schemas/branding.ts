import { z } from 'zod';

export const updateBrandingSchema = z.object({
	name: z.string(),
	slogan: z.string(),
	color_theme: z.string(),
	radius: z.number(),
	logo: z.string().optional(),
});

export type UpdateBrandingSchema = typeof updateBrandingSchema;
