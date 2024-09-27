import { z } from 'zod';

export const createMapPinSchema = z.object({
	lng: z.number(),
	lat: z.number(),
});

export type CreateMapPinSchema = typeof createMapPinSchema;

export const deleteMapPinSchema = z.object({
	id: z.number(),
});

export type DeleteMapPinSchema = typeof deleteMapPinSchema;
