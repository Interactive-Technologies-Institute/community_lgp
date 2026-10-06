import { z } from 'zod';

export const requestNewInviteSchema = z.object({
	email: z.string().email({ message: 'Introduza um endereço de e-mail válido' }),
});

export type RequestNewInviteSchema = typeof requestNewInviteSchema;
