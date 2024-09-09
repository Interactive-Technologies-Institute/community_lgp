import { z } from 'zod';

export const updateBrandingSchema = z.object({
	name: z.string(),
	slogan: z.string(),
	color_theme: z.string(),
	radius: z.number(),
	logoUrl: z.string().nullish(),
	logo: z.instanceof(File).nullish(),
});

export type UpdateBrandingSchema = typeof updateBrandingSchema;
