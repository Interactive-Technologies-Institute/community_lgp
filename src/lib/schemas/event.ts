import { z } from 'zod';

export const createEventSchema = z
	.object({
		title: z.string().min(5, { message: 'Title is required' }).max(100),
		description: z.string().min(5, { message: 'Description is required' }).max(500),
		imageUrl: z.string().optional(),
		image: z.instanceof(File, { message: 'Image is required.' }).optional(),
		tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
		date: z.string().refine((date) => date, { message: 'Please select a valid date.' }),
		location: z.string().min(1, { message: 'Location is required' }),
	})
	.refine((data) => data.image || data.imageUrl, {
		message: 'Image is required.',
		path: ['image'],
	});

export type CreateEventSchema = typeof createEventSchema;

export const deleteEventSchema = z.object({
	id: z.number(),
});

export type DeleteEventSchema = typeof deleteEventSchema;

export const toggleEventInterestSchema = z.object({
	value: z.boolean(),
});

export type ToggleEventInterestSchema = typeof toggleEventInterestSchema;
