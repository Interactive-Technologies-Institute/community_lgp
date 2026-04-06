import { z } from 'zod';

export const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: 'A palavra-passe atual é necessária' }),
		newPassword: z.string().min(8, { message: 'A nova palavra-passe deve ter pelo menos 8 caracteres' }),
		confirmNewPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "As palavras-passe não são iguais.",
		path: ['confirmNewPassword'],
	});

export type UpdatePasswordSchema = typeof updatePasswordSchema;

export const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(8, { message: 'A nova palavra-passe deve ter pelo menos 8 caracteres' }),
		confirmNewPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "As palavras-passe não são iguais.",
		path: ['confirmNewPassword'],
	});

export type ResetPasswordSchema = typeof resetPasswordSchema;

