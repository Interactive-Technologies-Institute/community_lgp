import type { Sign } from '@/types/types';
import { handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}
	async function getSigns(): Promise<Sign[]> {
		const { data: signs, error: signsError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.in('is_anotated', [0, 1, 2]);
		if (signsError) {
			console.error('Error fetching signs:', signsError);
			return [];
		}
		return signs as Sign[];
	}

	async function getThemes(): Promise<Map<string, number>> {
		const { data: themes, error: themesError } = await event.locals.supabase
			.from('signs_themes')
			.select('*');

		if (themesError) {
			const errorMessage = 'Error fetching themes, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		const themeMap = new Map<string, number>();
		if (themes) {
			themes.forEach((theme) => {
				const { count, theme: themeName } = theme;
				if (count !== null && themeName !== null) {
					themeMap.set(themeName, count);
				}
			});
		}

		return themeMap;
	}

	async function getAnnotationCount(status: Sign['is_anotated']): Promise<number> {
		const { count, error: countError } = await event.locals.supabase
			.from('signs')
			.select('id', { count: 'exact', head: true })
			.eq('is_anotated', status);

		if (countError) {
			console.error(`Error counting signs with annotation status ${status}:`, countError);
			return 0;
		}

		return count ?? 0;
	}

	async function getAnnotationCounts() {
		const [incomplete, semiComplete, complete] = await Promise.all([
			getAnnotationCount(0),
			getAnnotationCount(1),
			getAnnotationCount(2),
		]);

		return { incomplete, semiComplete, complete };
	}

	const [signs, annotationCounts, themes] = await Promise.all([
		getSigns(),
		getAnnotationCounts(),
		getThemes(),
	]);

	return {
		signs,
		annotationCounts,
		themes,
	};
};
