import { readAllNotificationsSchema, readNotificationSchema } from '@/schemas/notification';
import { handleFormAction } from '@/utils';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const actions = {
	signout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500, { message: 'Error signing out, please again later.' });
		}

		return;
	},
	readNotification: (event) =>
		handleFormAction(
			event,
			readNotificationSchema,
			'read-notification',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('notifications')
					.update({ read: true })
					.eq('id', form.data.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message });
				}

				return { form };
			}
		),
	readAllNotifications: (event) =>
		handleFormAction(
			event,
			readAllNotificationsSchema,
			'read-all-notifications',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('notifications')
					.update({ read: true })
					.eq('user_id', userId);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message });
				}

				return { form };
			}
		),
};
