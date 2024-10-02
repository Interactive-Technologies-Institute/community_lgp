import { z } from 'zod';

export const createEventSchema = z
	.object({
		title: z
			.string()
			.min(5, { message: 'Title must be at least 5 characters' })
			.max(100, { message: 'Title must be less than 100 characters' }),
		description: z
			.string()
			.min(5, { message: 'Description must be at least 5 characters' })
			.max(500, { message: 'Description must be less than 500 characters' }),
		imageUrl: z.string().nullish(),
		image: z.instanceof(File).nullish(),
		tags: z
			.array(z.string())
			.refine((tags) => tags.length <= 5, {
				message: 'Must be less than 5 tags',
			})
			.refine((tags) => {
				return new Set(tags).size === tags.length;
			}, 'Tags must be unique')
			.refine((tags) => {
				return tags.every((tag) => tag.length >= 3 && tag.length <= 20);
			}, 'Tags must be between 3 and 20 characters'),
		date: z.string().refine((date) => date, { message: 'Date is required' }),
		location: z.string().min(1, { message: 'Location is required' }),
	})
	.refine((data) => data.image || data.imageUrl, {
		message: 'Image is required',
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
