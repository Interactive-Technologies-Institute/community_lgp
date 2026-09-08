import { z } from 'zod';

export const inviteContributorSchema = z.object({
	email: z.string().email({ message: 'Introduza um endereço de e-mail válido' }),
});

export type InviteContributorSchema = typeof inviteContributorSchema;
