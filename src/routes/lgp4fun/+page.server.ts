import type { Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	async function getSigns(): Promise<Sign[]> {
		let query = event.locals.supabase
			.from('signs')
			.select('*', { count: 'exact' })
			.eq('is_anotated', 2)
			.eq('theme_flattened', '(1ºCEB) PORTUGUÊS/ FAMÍLIA');

		const { data: signs, error: signsError } = await query;

		if (signsError) {
			const errorMessage = 'Error fetching signs, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return signs as Sign[];
	}

	return {
		signs: await getSigns(),
	};
};
