import { z } from 'zod';

export const acceptInviteSchema = z
	.object({
		displayName: z.string().min(1, { message: 'O nome é necessário' }),
		newPassword: z.string().min(8, { message: 'A nova palavra-passe deve ter pelo menos 8 caracteres' }),
		confirmNewPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: 'As palavras-passe não são iguais.',
		path: ['confirmNewPassword'],
	});

export type AcceptInviteSchema = typeof acceptInviteSchema;
