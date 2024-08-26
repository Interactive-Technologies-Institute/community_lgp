import type { UserProfile } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	async function getUsers(): Promise<UserProfile[]> {
		const query = event.locals.supabase.from('profiles_view').select('*');

		const { data: users, error: usersError } = await query;

		if (usersError) {
			const errorMessage = 'Error fetching users, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return users as UserProfile[];
	}

	return {
		users: await getUsers(),
	};
};
