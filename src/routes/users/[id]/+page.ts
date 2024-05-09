import { handleSignInRedirect } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { supabase, session, profile } = await event.parent();
	const id = event.params.id;
	if (id === 'me') {
		if (!session || !profile) {
			return redirect(302, handleSignInRedirect(event));
		}
		return { userProfile: profile };
	}

	const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', id).single();

	if (!userProfile) {
		return error(404, 'User not found');
	}

	return {
		userProfile,
	};
};
