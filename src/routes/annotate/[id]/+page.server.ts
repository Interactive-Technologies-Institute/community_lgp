import type { Parameter, Sign } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
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

        return sign as Sign;
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

    async function getParametersByIds(ids: number[]): Promise<Parameter[]> {
        const { data: parametersById, error: parametersError } = await event.locals.supabase
            .from('parameters')
            .select('*')
            .in('id', ids);

        if (parametersError) {
            const errorMessage = `Error fetching parameters, please try again later.`;
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            throw error(500, errorMessage);
        }

        return parametersById as Parameter[];
    }

    const signId = event.params.id;
    let specificSign = null;
    let parametersById: Parameter[] = [];

    if (signId) {
        specificSign = await getSignById(signId);

        if (specificSign.annotation_array && specificSign.annotation_array.length > 0) {
			if (specificSign.annotation) {
				const annotationIds: number[] = Object.values(specificSign.annotation)
					.flat() 
					.map((id) => parseInt(id, 10)) 
					.filter((id) => !isNaN(id)); 
		
				parametersById = await getParametersByIds(annotationIds);
			}
		}
    
        }
    
    let parameters: Parameter[] = await getParameters();

    return {
        sign: specificSign,
        parameters: parameters,
        parametersById: parametersById,
    };
};
