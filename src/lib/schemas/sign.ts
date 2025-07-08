import { z } from 'zod';

const AnnotationArrayObjectSchema = z.object({
	configuration: z.array(z.number()),
	movement: z.array(z.number()),
	location: z.array(z.number()),
	orientation: z.array(z.number()),
	expression: z.array(z.number()),
});

export const updateSignSchema = z.object({
	annotation: AnnotationArrayObjectSchema.default({
		configuration: [],
		movement: [],
		location: [],
		orientation: [],
		expression: [],
	}).optional(),
	annotation_array: z.array(z.number()).length(300).optional(),
	is_anotated: z.number().optional(),
	name: z.string().min(1, { message: 'Name is required' }).max(100),
	theme: z.array(z.string()).min(1, { message: 'At least one theme is required' }),
	videoUrl: z.string().optional(),
	video: z.union([z.string(), z.instanceof(File).optional()]),
	description: z.string().nullable().optional(),
	context_video: z.union([z.string(), z.instanceof(File).optional()]),
	context_video_url: z.string().optional(),
	sentence: z.string().nullable().optional(),
	written_anotation: z.array(z.string()).nullable().optional(),
	frequency: z.number().nullable().optional(),
	district: z.string().nullable().optional(),
});

export const createSignSchema = z.object({
	annotation: AnnotationArrayObjectSchema.default({
		configuration: [],
		movement: [],
		location: [],
		orientation: [],
		expression: [],
	}).optional(),
	annotation_array: z.array(z.number()).length(300).optional(),
	is_anotated: z.number().optional(),
	name: z.string().min(1, { message: 'Name is required' }).max(100),
	theme: z.array(z.string()).min(1, { message: 'At least one theme is required' }),
	theme_flattened: z.string().optional(),
	videoUrl: z.string().optional(),
	video: z.union([z.string(), z.instanceof(File).optional()]),
	description: z.string().nullable().optional(),
	context_video: z.union([z.string(), z.instanceof(File).optional()]),
	context_video_url: z.string().optional(),
	sentence: z.string().nullable().optional(),
	frequency: z.number().nullable().optional(),
	district: z.string().nullable().optional(),
});

export const deleteSignSchema = z.object({
	id: z.number(),
});

export const toggleSignRatingSchema = z.object({
	value: z
		.string()
		.optional()
		.default('')
		.transform((val) => {
			if (!val || val === '') return null;
			const parsed = parseInt(val, 10);
			return parsed;
		})
		.refine(
			(val) => {
				return val === null || [-1, 0, 1].includes(val);
			},
			{
				message: 'Rating must be -1, 0, or 1, or empty to remove rating',
			}
		),
});

export const toggleSignFavoriteSchema = z.object({
	value: z.boolean(),
});

export type CreateSignSchema = typeof createSignSchema;
export type DeleteSignSchema = typeof deleteSignSchema;
export type UpdateSignSchema = typeof updateSignSchema;
export type ToggleSignRatingSchema = typeof toggleSignRatingSchema;
export type ToggleSignFavoriteSchema = typeof toggleSignFavoriteSchema;
