import { z } from 'zod';

export const signUpSchema = z
	.object({
		displayName: z
			.string()
			.min(1, { message: 'Display name is required' })
			.max(25, { message: 'Display name must be less than 25 characters' }),
		email: z.string().email({ message: 'Please enter a valid email address' }),
		password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

export type SignUpSchema = typeof signUpSchema;
