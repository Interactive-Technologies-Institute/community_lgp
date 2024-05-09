import type { HowTo } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	async function getHowTos(): Promise<HowTo[]> {
		const { data: howTos, error: howTosError } = await event.locals.supabase
			.from('howtos')
			.select('*');

		if (howTosError) {
			const errorMessage = 'Error fetching how tos, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return howTos;
	}

	return {
		howTos: await getHowTos(),
	};
};
