
import type { Actions } from '@sveltejs/kit';
import type { AnnotationArray, Parameter, Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { arrayQueryParam, stringQueryParam } from '@/utils';

export const load = async (event) => {

    const search = stringQueryParam().decode(event.url.searchParams.get('s')) ?? '';
    const theme = arrayQueryParam().decode(event.url.searchParams.get('theme')) ?? null;

    async function getSigns(): Promise<Sign[]> {
		let query = event.locals.supabase
			.from('signs')
			.select('*')
            .eq('is_anotated', 2)
            .ilike('theme_flattened', '%1ºCEB%');

			if (search) {
				query = query.ilike('name', `%${search}%`);
			}

            if (theme && theme.length) {
                query = query.overlaps('theme', theme);
            }
			
			const { data: signs, error: signsError } = await query;
			
			if (signsError) {
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

    async function getThemes(): Promise<Map<string, number>> {
        const { data: themes, error: themesError } = await event.locals.supabase
        .from('signs_themes')
        .select('*')
        .ilike('theme','%1ºCEB%')

        if(themesError){
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

    return {
        signs: await getSigns(),
        parameters: await getParameters(),
        themes: await getThemes(),
    };
};
