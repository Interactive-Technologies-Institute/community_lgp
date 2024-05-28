import type { Branding, Feature, UserProfile } from '@/types/types';
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

		let features: Feature[] = [];
		const { data: featuresData } = await supabase
			.from('feature_flags')
			.select('id')
			.eq('enabled', true);
		if (featuresData) features = featuresData.map((f: { id: Feature }) => f.id);

		let branding: Branding = {
			name: 'Community',
			slogan: 'A community for everyone',
			color_theme: 'neutral',
			radius: 0.5,
		};

		const { data: brandingData } = await supabase.from('branding').select().single();
		if (brandingData) branding = brandingData;

		return {
			features,
			branding,
			session,
			user,
			profile,
		};
	}
);
