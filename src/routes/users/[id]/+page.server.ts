import type { CSComment, Sign, UserProfile } from '@/types/types';
import { handleSignInRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();

	const page: number = 1;
	const pageSize: number = 20;
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	let id = event.params.id;
	if (id === 'me') {
		if (!session || !user) {
			return redirect(302, handleSignInRedirect(event));
		}
		id = user.id;
	}

	async function getUserProfile(): Promise<UserProfile> {
		const { data: userProfile, error: userProfileError } = await event.locals.supabase
			.from('profiles_view')
			.select('*')
			.eq('id', id)
			.single();

		if (userProfileError) {
			const errorMessage = 'Error fetching  profile, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		if (userProfile.avatar) {
			userProfile.avatar = event.locals.supabase.storage
				.from('users')
				.getPublicUrl(userProfile.avatar).data.publicUrl;
		}

		return userProfile;
	}

	async function getGuides(): Promise<{ id: number; label: string }[]> {
		const { data: guides, error: guidesError } = await event.locals.supabase
			.from('guides_view')
			.select('id, label:title')
			.order('moderation_status', { ascending: true })
			.order('inserted_at', { ascending: false })
			.eq('user_id', id);

		if (guidesError) {
			const errorMessage = 'Error fetching guides, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return guides;
	}

	async function getEvents(): Promise<{ id: number; label: string }[]> {
		const { data: events, error: eventsError } = await event.locals.supabase
			.from('events_view')
			.select('id, label:title')
			.order('moderation_status', { ascending: true })
			.order('inserted_at', { ascending: false })
			.eq('user_id', id);

		if (eventsError) {
			const errorMessage = 'Error fetching events, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return events;
	}

	async function getMapPin(): Promise<{ id: number } | null> {
		const { data: mapPin, error: mapPinError } = await event.locals.supabase
			.from('map_pins_view')
			.select('id')
			.eq('user_id', id)
			.maybeSingle();

		if (mapPinError) {
			const errorMessage = 'Error fetching map pin, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return mapPin;
	}

	async function getSignsByUser(
		page: number = 1,
		pageSize: number = 20
	): Promise<{ signs: Sign[]; count: number }> {
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		const {
			data: signs,
			count,
			error: signsError,
		} = await event.locals.supabase
			.from('signs')
			.select('id, name, created_at, video, theme_flattened, district', { count: 'exact' })
			.eq('created_by_user_id', id)
			.range(from, to);

		if (signsError) {
			const errorMessage = `Error fetching signs by user ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return {
			signs: signs as Sign[],
			count: count ?? 0,
		};
	}

	async function getAnnotatedSignsByUser(
		
	): Promise<{ annotatedSigns: Sign[]; count: number }> {
		

		const {
			data: annotatedSigns,
			count,
			error: signsError,
		} = await event.locals.supabase
			.from('signs')
			.select('id, name, created_at, video, theme_flattened, district', { count: 'exact' })
			.eq('annotated_by_user_id', id)
			.range(from, to);

		if (signsError) {
			const errorMessage = `Error fetching annotated signs by user ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return {
			annotatedSigns: annotatedSigns as Sign[],
			count: count ?? 0,
		};
	}

	async function getCommentsByUser() : Promise <CSComment[]>{
		const { data: comments, count, error: commentsError} = await event.locals.supabase
		.from('crowdsource_comments')
		.select('*', { count: 'exact' })
		.eq('user_id', id)
		.range(from, to)

		if(commentsError){
			const errorMessage = `Error fetching comments by user ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: commentsError }, event.cookies);
			return error(500, errorMessage);
		}

		return {
			comments: comments as CSComment[],
			count: count ?? 0,
		}
	}

	return {
		userProfile: await getUserProfile(),
		guides: await getGuides(),
		events: await getEvents(),
		mapPin: await getMapPin(),
		signs: await getSignsByUser(),
		annotatedSigns: await getAnnotatedSignsByUser(),
		comments: await getCommentsByUser(),
	};
};
