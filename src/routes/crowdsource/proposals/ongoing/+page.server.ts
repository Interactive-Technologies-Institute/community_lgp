import type { Sign, UserProfile } from '@/types/types';
import { stringQueryParam } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
    const page = Number(event.url.searchParams.get('page')) || 1;
    const perPage = 9;
    const search = stringQueryParam().decode(event.url.searchParams.get('s')) ?? '';

    try {
        // Step 1: Get all proposal sign_ids (no pagination here - we need all proposals)
        const { data: proposals, error: proposalsError } = await event.locals.supabase
            .from('signs_moderation')
            .select('sign_id')
            .eq('status', 'pending')
            .order('inserted_at', { ascending: false });

        if (proposalsError) {
            const errorMessage = 'Error fetching crowdsource proposals, please try again later.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(500, errorMessage);
        }

        if (!proposals || proposals.length === 0) {
            return {
                page,
                perPage,
                search,
                totalPages: 0,
                countSign: 0,
                signsWithUsers: []
            };
        }

        // Step 2: Get all sign IDs from proposals
        const signIds = proposals.map(p => p.sign_id);

        // Step 3: Build the main query for signs with proper pagination
        let query = event.locals.supabase
            .from('signs')
            .select('id, name, video, created_by_user_id, created_at', { count: 'exact' })
            .in('id', signIds)
            .order('created_at', { ascending: false });

        // Apply search filter if provided
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        // Apply pagination to the final query
        query = query.range((page - 1) * perPage, page * perPage - 1);

        const { data: signs, count, error: signsError } = await query;

        if (signsError) {
            const errorMessage = 'Error fetching signs, please try again later.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(500, errorMessage);
        }

        const totalPages = count ? Math.ceil(count / perPage) : 0;
        const countSign = count || 0;

        if (!signs || signs.length === 0) {
            return {
                page,
                perPage,
                search,
                totalPages,
                countSign,
                signsWithUsers: []
            };
        }

        // Step 4: Get unique user IDs from the paginated signs
        const userIds = [...new Set(signs.map(sign => sign.created_by_user_id))];

        // Step 5: Fetch user profiles for the users in the current page
        const { data: users, error: usersError } = await event.locals.supabase
            .from('profiles_view')
            .select('id, display_name, avatar')
            .in('id', userIds);

        if (usersError) {
            const errorMessage = 'Error fetching user profiles.';
            setFlash({ type: 'error', message: errorMessage }, event.cookies);
            return error(500, errorMessage);
        }

        // Step 6: Map users by ID for fast lookup
        const userMap = Object.fromEntries((users || []).map(user => [user.id, user]));

        // Step 7: Attach user profile to each sign
        const signsWithUsers = signs.map(sign => ({
            ...sign,
            user: userMap[sign.created_by_user_id] || null
        }));

        return {
            page,
            perPage,
            search,
            totalPages,
            countSign,
            signsWithUsers
        };

    } catch (err) {
        console.error('Error in load function:', err);
        const errorMessage = 'An unexpected error occurred. Please try again later.';
        setFlash({ type: 'error', message: errorMessage }, event.cookies);
        return error(500, errorMessage);
    }
};