import { z } from 'zod';

export const updateFeaturesSchema = z.object({
	guides: z.boolean(),
	events: z.boolean(),
	map: z.boolean(),
	docs: z.boolean(),
	dictionary: z.boolean(),
	annotate: z.boolean(),
});

export type UpdateFeaturesSchema = typeof updateFeaturesSchema;
