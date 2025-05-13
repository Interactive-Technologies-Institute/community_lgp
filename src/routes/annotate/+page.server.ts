import type { AnnotationArray, Sign } from '@/types/types';
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

    return {
        signs: await getSigns(),
    };
};
