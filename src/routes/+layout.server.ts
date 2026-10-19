import type { Branding, Feature, Notification, UserProfile } from '@/types/types';
import { redirect } from '@sveltejs/kit';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals: { supabase, safeGetSession }, cookies, route }) => {
	// Rerouted maintenance requests should not depend on authentication or the
	// database: those may be the very services currently being worked on.
	if (route.id === '/maintenance') {
		return {
			maintenance: true,
			features: [],
			branding: {
				name: 'Dicionário LGP',
				slogan: 'O Dicionário Online de Língua Gestual Portuguesa',
				color_theme: 'neutral',
				radius: 0.5,
			},
			cookies: [],
			session: null,
			user: null,
			profile: null,
			notifications: [],
		};
	}

	const { session, user } = await safeGetSession();

	let profile: UserProfile | null = null;
	if (user) {
		const { data } = await supabase.from('profiles_view').select().eq('id', user.id).single();
		if (data) {
			profile = data;
			if (profile.avatar) {
				profile.avatar = supabase.storage.from('users').getPublicUrl(profile.avatar).data.publicUrl;
			}
		}
	}

	// An invited contributor who opened the invite link but never submitted
	// /accept-invite is signed in with no name and no password - they'd be
	// locked out as soon as this session ends. Keep them on that form until
	// it's done - including when they reopen the (now spent) invite link and
	// land on /auth/error. Regular sign-ups always set a name, so only those
	// get caught.
	if (profile && !profile.display_name?.trim() && route.id !== '/(auth)/accept-invite') {
		redirect(303, '/accept-invite');
	}

	let notifications: Notification[] = [];
	if (user) {
		const { data } = await supabase
			.from('notifications')
			.select()
			.eq('user_id', user.id)
			.order('inserted_at', { ascending: false });
		if (data) notifications = data;
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
	if (branding.logo) {
		branding.logo = supabase.storage.from('branding').getPublicUrl(branding.logo).data.publicUrl;
	}

	return {
		maintenance: false,
		features,
		branding,
		cookies: cookies.getAll(),
		session,
		user,
		profile,
		notifications,
	};
});
