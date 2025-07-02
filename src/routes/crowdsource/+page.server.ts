import type { Sign, UserProfile } from '@/types/types';
import { stringQueryParam } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	

	async function getProposals(): Promise<Sign[]> {
		const { data: proposals, error: proposalsError } = await event.locals.supabase
			.from('signs_moderation')
			.select('sign_id', { count: 'exact' })
			.eq('status','pending')
			.order('inserted_at', {ascending: false})
			.range(0,8);


		if (proposalsError) {
			const errorMessage = 'Error fetching crowdsource proposals, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

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

		return signsWithUsers as Sign[];
	}

	async function getSigns(id: number): Promise<Sign[]>{
		const { data: signs, error: signsError } = await event.locals.supabase
			.from('signs')
			.select('id, name, video, created_by_user_id', { count: 'exact' })
			.eq('id',id)
			.order('created_at', {ascending: false})
			.range(0,8);

		if (signsError) {
			const errorMessage = 'Error fetching signs, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return signs as Sign[];
	}
async function getMostCommentedSigns(): Promise<Sign[]> {
    // Step 1: Get comment counts per sign
    const { data: commentCounts, error: commentCountsError } = await event.locals.supabase
        .from('crowdsource_comments')
        .select('sign_id', { count: 'exact' })
        .order('sign_id');

    if (commentCountsError) {
        const errorMessage = 'Error fetching comment counts, please try again later.';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    // Step 2: Group by sign_id and count comments
    const signCommentCounts = commentCounts.reduce((acc, comment) => {
        acc[comment.sign_id] = (acc[comment.sign_id] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // Step 3: Get the sign IDs sorted by comment count (most to least)
    const sortedSignIds = Object.entries(signCommentCounts)
        .sort(([, a], [, b]) => b - a) // Sort by count descending
        .slice(0, 8) // Take top 8
        .map(([signId]) => parseInt(signId));

    if (sortedSignIds.length === 0) {
        return []; // No signs with comments
    }

    // Step 4: Fetch the actual sign data for these IDs
    const { data: signs, error: signsError } = await event.locals.supabase
        .from('signs')
        .select('id, name, video, created_by_user_id', { count: 'exact' })
        .in('id', sortedSignIds);

    if (signsError) {
        const errorMessage = 'Error fetching most commented signs, please try again later.';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }
    // Step 5: Sort the signs according to our comment count order and add comment counts
    const signMap = Object.fromEntries(signs.map(sign => [sign.id, sign]));
    const sortedSigns = sortedSignIds
        .map(id => ({
            ...signMap[id],
            comment_count: signCommentCounts[id]
        }))
        .filter(sign => sign.id); // Remove any undefined signs

    // Step 6: Get unique user IDs from signs
    const userIds = [...new Set(sortedSigns.map(sign => sign.created_by_user_id))];

    // Step 7: Fetch all user profiles in one go
    const { data: users, error: usersError } = await event.locals.supabase
        .from('profiles_view')
        .select('id, display_name, avatar')
        .in('id', userIds);

    if (usersError) {
        const errorMessage = 'Error fetching user profiles for most commented signs.';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    // Step 8: Map users by ID for fast lookup
    const userMap = Object.fromEntries(users.map(user => [user.id, user]));

    // Step 9: Attach user profile to each sign
    const signsWithUsers = sortedSigns.map(sign => ({
        ...sign,
        user: userMap[sign.created_by_user_id] || null
    }));

    return signsWithUsers as Sign[];
}

async function getMostVotedSigns(): Promise<Sign[]> {
    // Step 1: Fetch signs with vote counts from your view
    const { data: signsWithVotes, error: signsError } = await event.locals.supabase
        .from('signs_statistics') // Replace with your actual view name
        .select('*')
        .order('id'); // Initial order, we'll sort by total votes next

    if (signsError) {
        const errorMessage = 'Error fetching signs with votes, please try again later.';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    // Step 2: Calculate total votes and sort by most voted
    const signsWithTotalVotes = signsWithVotes
        .map(sign => ({
            ...sign,
            total_votes: sign.pos_votes + sign.nt_votes + sign.neg_votes
        }))
        .sort((a, b) => b.total_votes - a.total_votes) // Sort by total votes descending
        .slice(0, 8); // Take top 8

    if (signsWithTotalVotes.length === 0) {
        return []; // No signs with votes
    }

    // Step 3: Get unique user IDs from signs
    const userIds = [...new Set(signsWithTotalVotes.map(sign => sign.created_by_user_id))];

    // Step 4: Fetch all user profiles in one go
    const { data: users, error: usersError } = await event.locals.supabase
        .from('profiles_view')
        .select('id, display_name, avatar')
        .in('id', userIds);

    if (usersError) {
        const errorMessage = 'Error fetching user profiles for most voted signs.';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }

    // Step 5: Map users by ID for fast lookup
    const userMap = Object.fromEntries(users.map(user => [user.id, user]));

    // Step 6: Attach user profile to each sign
    const signsWithUsers = signsWithTotalVotes.map(sign => ({
        ...sign,
        user: userMap[sign.created_by_user_id] || null
    }));

    return signsWithUsers as Sign[];
}


	

	return{
		mostCommentedSigns: await getMostCommentedSigns(),
		signsWithUsers: await getProposals(),
		mostVotedSigns : await getMostVotedSigns(),
	}
};
