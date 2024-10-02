import { z } from 'zod';

export const readNotificationSchema = z.object({
	id: z.string(),
});

export type ReadNotificationSchema = typeof readNotificationSchema;

export const readAllNotificationsSchema = z.object({});

export type ReadAllNotificationsSchema = typeof readAllNotificationsSchema;
