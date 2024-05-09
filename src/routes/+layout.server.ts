import type { UserProfile } from '@/types/types';
import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(
	async ({ locals: { supabase, safeGetSession } }) => {
		const { session, user } = await safeGetSession();

		let profile: UserProfile | null = null;
		if (user) {
			const { data } = await supabase.from('profiles').select().eq('id', user.id).single();
			profile = data;
		}

		return {
			session,
			user,
			profile,
		};
	}
);
