import { z } from 'zod';

export const createHowToSchema = z
	.object({
		title: z.string().min(5, { message: 'Title is required' }).max(100),
		description: z.string().min(5, { message: 'Description is required' }).max(500),
		imageUrl: z.string().optional(),
		image: z.instanceof(File, { message: 'Image is required.' }).optional(),
		tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
		difficulty: z.enum(['easy', 'medium', 'hard']),
		duration: z.enum(['short', 'medium', 'long']),
		steps: z
			.array(
				z
					.object({
						title: z.string().min(5, { message: 'Title is required' }).max(100),
						description: z.string().min(5, { message: 'Description is required' }).max(500),
						imageUrl: z.string().optional(),
						image: z.instanceof(File, { message: 'Image is required.' }).optional(),
					})
					.refine((data) => data.image || data.imageUrl, {
						message: 'Image is required.',
						path: ['image'],
					})
			)
			.min(3, { message: 'At least 3 steps are required' })
			.default([
				{
					title: '',
					description: '',
				},
				{
					title: '',
					description: '',
				},
				{
					title: '',
					description: '',
				},
			]),
	})
	.refine((data) => data.image || data.imageUrl, {
		message: 'Image is required.',
		path: ['image'],
	});

export type CreateHowToSchema = typeof createHowToSchema;

export const deleteHowToSchema = z.object({
	id: z.number(),
});

export type DeleteHowToSchema = typeof deleteHowToSchema;
