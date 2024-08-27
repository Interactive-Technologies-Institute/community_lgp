import { z } from 'zod';

export const updateUserRoleSchema = z.object({
	userId: z.string(),
	role: z.enum(['user', 'moderator', 'admin']),
});

export type UpdateUserRoleSchema = typeof updateUserRoleSchema;
