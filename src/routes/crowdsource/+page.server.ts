import type { Sign, UserProfile } from '@/types/types';
import { stringQueryParam } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const page = Number(event.url.searchParams.get('page')) || 1;
	const perPage = 9;
	const search = stringQueryParam().decode(event.url.searchParams.get('s')) ?? '';
	let totalPages = 0;

	async function getProposals(): Promise<Sign[]> {
		const { data: proposals, count, error: proposalsError } = await event.locals.supabase
			.from('signs_moderation')
			.select('sign_id', { count: 'exact' })
			.eq('status','pending')
			.order('inserted_at', {ascending: false})
			.range(0,8);

		totalPages = count ? Math.ceil(count / perPage) : 0;

		if (proposalsError) {
			const errorMessage = 'Error fetching crowdsource proposals, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return proposals as Sign[];
	}

	async function getSigns(id: number): Promise<Sign[]>{
		const { data: signs, count, error: signsError } = await event.locals.supabase
			.from('signs')
			.select('id, name, video, created_by_user_id', { count: 'exact' })
			.eq('id',id)
			.order('created_at', {ascending: false})
			.range(0,8);

		totalPages = count ? Math.ceil(count / perPage) : 0;

		if (signsError) {
			const errorMessage = 'Error fetching signs, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return signs as Sign[];
	}

	const proposals = await getProposals();

	// Step 1: Get all signs from each proposal
	const allSignsNested = await Promise.all(proposals.map(p => getSigns(p.sign_id)));
	const allSigns = allSignsNested.flat();

	// Step 2: Get unique user IDs from signs
	const userIds = [...new Set(allSigns.map(sign => sign.created_by_user_id))];

	// Step 3: Fetch all user profiles in one go
	const { data: users, error: usersError } = await event.locals.supabase
		.from('profiles_view')
		.select('id, display_name, avatar')
		.in('id', userIds);

	if (usersError) {
		const errorMessage = 'Error fetching user profiles.';
		setFlash({ type: 'error', message: errorMessage }, event.cookies);
		return error(500, errorMessage);
	}

	// Step 4: Map users by ID for fast lookup
	const userMap = Object.fromEntries(users.map(user => [user.id, user]));

	// Step 5: Attach user profile to each sign
	const signsWithUsers = allSigns.map(sign => ({
		...sign,
		user: userMap[sign.created_by_user_id] || null
	}));

	return{
		page, perPage, search, totalPages,
		signsWithUsers
	}
};
