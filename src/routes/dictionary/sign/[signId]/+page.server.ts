import type { Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	async function getSignById(id: string): Promise<Sign | null> {
		const { data: sign, error: signError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('id', id)
			.single();

		if (signError) {
			const errorMessage = `Error fetching sign with ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}
		return sign;
	}

	const signId = event.params.signId;
	let specificSign = null;

	if (signId) {
		specificSign = await getSignById(signId);
	}

	return {
		sign: specificSign,
	};
};
