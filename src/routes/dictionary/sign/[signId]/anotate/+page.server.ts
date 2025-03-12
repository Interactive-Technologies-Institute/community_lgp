import type { Parameter, Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const signId = event.params.signId;

	async function getSignById(id: string): Promise<Sign> {
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

	const specificSign = await getSignById(signId);
	
	async function getThemeSignById(id: string): Promise<string[] | null> {
		const { data: themesSign, error: themeSignsError } = await event.locals.supabase
			.from('signs')
			.select('theme')
			.eq('id', id)
			.single();

		if (themeSignsError) {
			const errorMessage = `Error fetching themes for the sign with ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}
		return themesSign.theme;
	}
	
	let specificSignTheme = null;

	if (signId) {
		specificSignTheme = await getThemeSignById(signId);
	}
	
	async function getParameters(): Promise<Parameter[]> {
		const { data: parameters, error: parametersError } = await event.locals.supabase
			.from('parameters')
			.select('*');

		if (parametersError) {
			const errorMessage = 'Error fetching parameters, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return parameters;
	}

	return {
		sign: specificSign,
		themesSign: specificSignTheme,
		parameters: await getParameters(),
	};
};
