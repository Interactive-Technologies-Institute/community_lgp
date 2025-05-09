import { z } from 'zod';

export const updateSignSchema = z.object({
	annotation: z.string(),
	annotationArray: z.array(z.number()).length(179),
	created_at: z.string().datetime(),
	id: z.number(),
	is_anotated: z.number(),
	last_changed: z.string().datetime(),
	name: z.string(),
	theme: z.array(z.string()),
	video: z.string(),
	written_annotation: z.array(z.string()),
});

const AnnotationArrayObjectSchema = z.object({
	configuration: z.array(z.number()),
	movement: z.array(z.number()),
	location: z.array(z.number()),
	orientation: z.array(z.number()),
	expression: z.array(z.number()),
})

export const createSignSchema = z.object({
	annotation: AnnotationArrayObjectSchema.default({ configuration: [], movement: [], location: [], orientation: [], expression: [] }).optional(),
	annotation_array: z.array(z.number()).length(300).optional(),
	is_anotated: z.number().optional(),
	name: z.string().min(1, { message: 'Name is required' }).max(100),
	theme: z.array(z.string()).min(1, { message: 'At least one theme is required' }),
	videoUrl: z.string().optional(),
	video: z.instanceof(File, { message: 'Video is required.' }).optional(),
	description: z.string().optional(),
	context_video: z.instanceof(File, { message: 'Video is required.' }).optional(),
	context_video_url: z.string().optional(),
	sentence: z.string().optional(),
	written_annotation: z.array(z.string()).optional(),
	frequency: z.number().optional(),
	district: z.string().optional(),
});

export const deleteSignSchema = z.object({
	id: z.number(),
});

export type CreateSignSchema = typeof createSignSchema;
export type DeleteEventSchema = typeof deleteSignSchema;
export type UpdateSignSchema = typeof updateSignSchema;

