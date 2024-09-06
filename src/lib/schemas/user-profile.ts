import { z } from 'zod';

export const updateUserProfileSchema = z.object({
	display_name: z.string().min(1, { message: 'Display name is required' }),
	description: z.string().nullish(),
	avatar: z.instanceof(File).optional(),
	avatarUrl: z.string().optional(),
});

export type UpdateUserProfileSchema = typeof updateUserProfileSchema;
