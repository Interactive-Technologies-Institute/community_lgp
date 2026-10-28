import { getAllSubmissions, getTargetSigns } from '@/server/islr';
import { handleSignInRedirect } from '@/utils';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	const [targetSigns, submissions] = await Promise.all([
		getTargetSigns(event.locals.supabase),
		getAllSubmissions(event.locals.supabase),
	]);

	const contributorsBySign = new Map<number, Set<string>>();
	const videoCountBySign = new Map<number, number>();
	for (const { sign_id, contributor_id } of submissions) {
		videoCountBySign.set(sign_id, (videoCountBySign.get(sign_id) ?? 0) + 1);
		const contributors = contributorsBySign.get(sign_id) ?? new Set<string>();
		contributors.add(contributor_id);
		contributorsBySign.set(sign_id, contributors);
	}

	return {
		signs: targetSigns.map((sign) => ({
			id: sign.id,
			name: sign.name ?? '',
			videoCount: videoCountBySign.get(sign.id) ?? 0,
			contributorCount: contributorsBySign.get(sign.id)?.size ?? 0,
		})),
	};
};
