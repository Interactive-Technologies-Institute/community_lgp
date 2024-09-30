import { z } from 'zod';

export const updateBrandingSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(25, { message: 'Name must be less than 25 characters' }),
	slogan: z
		.string()
		.min(1, { message: 'Slogan is required' })
		.max(50, { message: 'Slogan must be less than 50 characters' }),
	color_theme: z.string(),
	radius: z.number(),
	logoUrl: z.string().nullish(),
	logo: z.instanceof(File).nullish(),
});

export type UpdateBrandingSchema = typeof updateBrandingSchema;
