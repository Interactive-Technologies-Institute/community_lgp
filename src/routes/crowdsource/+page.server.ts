import type { Sign, UserProfile } from '@/types/types';
import { arrayQueryParam, stringQueryParam } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const page = Number(event.url.searchParams.get('page')) || 1;
	const perPage = 9;
	const search = stringQueryParam().decode(event.url.searchParams.get('s')) ?? '';
	const theme = arrayQueryParam().decode(event.url.searchParams.get('theme')) ?? null;
	const sortBy = stringQueryParam().decode(event.url.searchParams.get('sortBy'));
	const sortOrder = stringQueryParam().decode(event.url.searchParams.get('sortOrder'));
	let totalPages = 0;
	let countSign = 0;

	async function getSignsWithStats(): Promise<Sign[]> {
		let query = event.locals.supabase
			.from('signs_summary')
			.select('*', { count: 'exact' })
			.range((page - 1) * perPage, page * perPage - 1);

		if (sortBy === 'total_comments') {
			query = query.order('total_comments', { ascending: sortOrder === 'asc' });
		} else if (sortBy === 'created_at') {
			query = query.order('created_at', { ascending: sortOrder === 'asc' });
		} else if (sortBy === 'positive_votes') {
			query = query.order('positive_votes', { ascending: sortOrder === 'asc' });
		} else {
			query = query.order('theme', { ascending: true }).order('created_at', { ascending: false });
		}

		if (search) {
			query = query.ilike('name', `%${search}`);
		}

		if (theme && theme.length) {
			const specificThemes = [
				'Proposta - Em Discussão',
				'Proposta - Aceite',
				'Proposta - Adicionada',
			];

			const specificSelected = theme.filter((t) => specificThemes.includes(t));
			const hasOutros = theme.includes('Outros');

			if (specificSelected.length > 0 && !hasOutros) {
				query = query.overlaps('theme', specificSelected);
			} else if (!specificSelected.length && hasOutros) {
			} else if (specificSelected.length > 0 && hasOutros) {
			}
		}

		const { data: signs, count, error: signsError } = await query;

		if (signsError) {
			const errorMessage = 'Error fetching signs with statistics, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		let filteredSigns = signs;
		if (theme && theme.length) {
			const specificThemes = [
				'Proposta - Em Discussão',
				'Proposta - Aceite',
				'Proposta - Adicionada',
			];

			const specificSelected = theme.filter((t) => specificThemes.includes(t));
			const hasOutros = theme.includes('Outros');

			if (hasOutros && specificSelected.length === 0) {
				filteredSigns = signs.filter((sign) => {
					if (!sign.theme || !Array.isArray(sign.theme)) return true;
					return !sign.theme.some((t) => specificThemes.includes(t));
				});
			} else if (hasOutros && specificSelected.length > 0) {
				filteredSigns = signs.filter((sign) => {
					if (!sign.theme || !Array.isArray(sign.theme)) return hasOutros;

					const hasSpecificTheme = sign.theme.some((t) => specificSelected.includes(t));

					const hasOnlyOtherThemes = !sign.theme.some((t) => specificThemes.includes(t));

					return hasSpecificTheme || (hasOutros && hasOnlyOtherThemes);
				});
			}
		}

		totalPages = count ? Math.ceil(count / perPage) : 0;
		countSign = count || 0;

		const userIds = [...new Set(filteredSigns.map((sign) => sign.created_by_user_id))];

		const { data: users, error: usersError } = await event.locals.supabase
			.from('profiles_view')
			.select('id, display_name, avatar')
			.in('id', userIds);

		if (usersError) {
			const errorMessage = 'Error fetching user profiles.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		const userMap = Object.fromEntries(users.map((user) => [user.id, user]));

		const signsWithUsers = filteredSigns.map((sign) => ({
			...sign,
			user: userMap[sign.created_by_user_id] || null,
		}));

		return signsWithUsers as Sign[];
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

		const specificThemes = [
			'Proposta - Em Discussão',
			'Proposta - Aceite',
			'Proposta - Adicionada',
		];

		const themeMap = new Map<string, number>();
		let outrosCount = 0;

		if (themes) {
			themes.forEach((theme) => {
				const { count, theme: themeName } = theme;
				if (count !== null && themeName !== null) {
					if (specificThemes.includes(themeName)) {
						themeMap.set(themeName, count);
					} else {
						outrosCount += count;
					}
				}
			});
		}

		if (outrosCount > 0) {
			themeMap.set('Outros', outrosCount);
		}

		return themeMap;
	}

	return {
		signs: await getSignsWithStats(),
		themes: await getThemes(),
		page,
		totalPages,
		perPage,
		countSign,
	};
};
