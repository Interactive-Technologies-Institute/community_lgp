import type { Actions } from '@sveltejs/kit';
import type { AnnotationArray, Parameter, Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { arrayQueryParam, stringQueryParam } from '@/utils';
import { selectDailySigns } from '$lib/server/daily-signs';

export const load = async (event) => {
	const page = Number(event.url.searchParams.get('page')) || 1;
	const perPage = 9;
	const search = stringQueryParam().decode(event.url.searchParams.get('s')) ?? '';
	const theme = arrayQueryParam().decode(event.url.searchParams.get('theme')) ?? null;
	const district = arrayQueryParam().decode(event.url.searchParams.get('district')) ?? null;
	const annotation = arrayQueryParam().decode(event.url.searchParams.get('annotation')) ?? null;
	const showSuggestions = !search && !theme?.length && !district?.length && !annotation?.length;
	let totalPages = 0;
	let countSign = 0;
	let searchArray = Array(300).fill(0);

	async function getSigns(): Promise<Sign[]> {
		if (!search && !theme?.length && !district?.length && !annotation?.length) return [];

		async function runQuery() {
			if (search) {
				let query = event.locals.supabase
					.from('signs')
					.select('*', { count: 'exact' })
					.eq('is_anotated', 2)
					.contains('dictionary', ['Geral'])
					.range((page - 1) * perPage, page * perPage - 1)
					.ilike('name_unaccented', `${search.normalize('NFD').replace(/\p{Diacritic}/gu, '')}%`);

				if (theme && theme.length) {
					query = query.overlaps('theme', theme);
				}
				if (district && district.length) {
					query = query.in('district', district);
				}

				return query.order('name_unaccented', { ascending: true });
			}

			if (annotation && annotation.length) {
				annotation.forEach((id) => {
					const numericId = Number(id);
					if (numericId > 0 && numericId <= 300) {
						searchArray[numericId - 1] = 1;
					}
				});

				let query = event.locals.supabase
					.rpc(
						'get_closest_signs',
						{ query_array: searchArray, limit_count: 9, offset_count: 1 },
						{ count: 'exact' }
					)
					.range((page - 1) * perPage, page * perPage - 1);

				if (theme && theme.length) {
					query = query.overlaps('theme', theme);
				}

				if (district && district.length) {
					query = query.in('district', district);
				}

				return query;
			}

			let query = event.locals.supabase
				.from('signs')
				.select('*', { count: 'exact' })
				.eq('is_anotated', 2)
				.contains('dictionary', ['Geral'])
				.range((page - 1) * perPage, page * perPage - 1)
				.order('name_unaccented', { ascending: true });

			if (theme && theme.length) query = query.overlaps('theme', theme);
			if (district && district.length) query = query.in('district', district);

			return query;
		}

		const { data: signs, count, error: signsError } = await runQuery();
		totalPages = count ? Math.ceil(count / perPage) : 0;
		countSign = count || 0;

		if (signsError) {
			console.error('Signs failed', signsError);
			const errorMessage = 'Error fetching signs, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return signs as Sign[];
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
		return parameters as Parameter[];
	}

	async function getFeaturedSigns(): Promise<Sign[]> {
		const { data: featuredSigns, error: featuredSignsError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('is_anotated', 2)
			.contains('dictionary', ['Geral'])
			.order('last_changed', { ascending: false })
			.limit(6);

		if (featuredSignsError) {
			console.error('Featured signs failed', featuredSignsError);
			return [];
		}

		return featuredSigns as Sign[];
	}

	async function getDailySigns(): Promise<Sign[]> {
		const { data: dailySignCandidates, error: dailySignsError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('is_anotated', 2)
			.contains('dictionary', ['Geral'])
			.order('id', { ascending: true })
			.limit(500);

		if (dailySignsError) {
			console.error('Daily signs failed', dailySignsError);
			return [];
		}

		return selectDailySigns(dailySignCandidates as Sign[], 'general');
	}

	async function getThemes(): Promise<Map<string, number>> {
		const { data: themes, error: themesError } = await event.locals.supabase
			.from('signs_themes')
			.select('*')
			.not('theme', 'ilike', '%CEB%')
			.not('theme', 'ilike', '%Filmar%');

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

	async function getDistricts(): Promise<Map<string, number>> {
		const { data: districts, error: districtsError } = await event.locals.supabase
			.from('signs_districts')
			.select('*');

		if (districtsError) {
			const errorMessage = 'Error fetching districts, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		const districtMap = new Map<string, number>();
		if (districts) {
			districts.forEach((district) => {
				const { count, district: districtName } = district;
				if (count !== null && districtName !== null) {
					districtMap.set(districtName, count);
				}
			});
		}

		return districtMap;
	}

	const [signs, dailySigns, featuredSigns, parameters, themes, districts] = await Promise.all([
		getSigns(),
		showSuggestions ? getDailySigns() : Promise.resolve([]),
		showSuggestions ? getFeaturedSigns() : Promise.resolve([]),
		getParameters(),
		getThemes(),
		getDistricts()
	]);

	return {
		signs,
		dailySigns,
		featuredSigns,
		parameters,
		themes,
		districts,
		page,
		totalPages,
		perPage,
		countSign,
	};
};
