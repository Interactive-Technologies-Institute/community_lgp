import { z } from 'zod';

export const updateUserProfileSchema = z.object({
	display_name: z.string().min(1, { message: 'Display name is required' }),
	description: z
		.string()
		.max(250, { message: 'Description must be less than 250 characters' })
		.nullish(),
	avatar: z.instanceof(File).nullish(),
	avatarUrl: z.string().nullish(),
	age: z.preprocess((val) => {
		if (typeof val === 'string' && val.trim() !== '') {
			const parsed = Number(val);
			return isNaN(parsed) ? undefined : parsed;
		}
		return val;
	}, z.number().nullable()),
	gender: z.string().nullish(),
	language: z.string().nullish(),
	profession: z.string().nullish(),
	cnum: z.string().nullish()
});

export type UpdateUserProfileSchema = typeof updateUserProfileSchema;
