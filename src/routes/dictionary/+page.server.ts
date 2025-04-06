
import type { Actions } from '@sveltejs/kit';
import type { AnnotationArray, Parameter, Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
    async function getSigns(): Promise<Sign[]> {
        const { data: signs, error: signsError } = await event.locals.supabase
            .from('signs')
            .select('*')
            .eq('is_anotated', "2");

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

    return {
        signs: await getSigns(),
        parameters: await getParameters(),
    };
};