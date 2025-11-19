import { z } from 'zod';

export const updateFeaturesSchema = z.object({
	map: z.boolean(),
	dictionary: z.boolean(),
	fcdictionary: z.boolean(),
	annotate: z.boolean(),
	crowdsource: z.boolean(),
	lgp4fun: z.boolean(),
	tutorial: z.boolean(),
});

export type UpdateFeaturesSchema = typeof updateFeaturesSchema;
