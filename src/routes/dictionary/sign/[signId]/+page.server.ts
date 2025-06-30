import type { CSComment, Parameter, Sign, UserProfile } from '@/types/types';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	async function getSignById(id: string): Promise<Sign> {
		const { data: sign, error: signError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('id', id)
			.single();

		if (signError) {
			const errorMessage = `Error fetching sign with ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return sign as Sign;
	}

	async function getParametersByIds(ids: number[]): Promise<Parameter[]> {
		const { data: parameters, error: parametersError } = await event.locals.supabase
			.from('parameters')
			.select('*')
			.in('id', ids);

		if (parametersError) {
			const errorMessage = `Error fetching parameters, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return parameters as Parameter[];
	}

	async function getSignVariants(id: number): Promise<Sign[]>{
		const { data: signs, error: signsError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('main_sign_id', id)
			

		if (signsError) {
			const errorMessage = `Error fetching sign variants with ID ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return signs as Sign[];
	}

	async function getUserById(id: string): Promise<UserProfile> {
		const { data: user, error: getUserByIdError } = await event.locals.supabase
			.from('profiles_view')
			.select(`id, display_name, avatar`)
			.eq('id', id)
			.single();

		if (user) {
			if (user.avatar) {
				user.avatar = event.locals.supabase.storage
					.from('users')
					.getPublicUrl(user.avatar).data.publicUrl;
			}
		}

		if (getUserByIdError) {
			const errorMessage = `Error fetching user, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return user as UserProfile;
	}

	async function getPostsBySignId(id: number): Promise<CSComment[]> {
		const { data: posts, error: getPostsByIdError } = await event.locals.supabase
			.from('crowdsource_comments')
			.select(`user_id, parent_id, content_text, content_video, created_at, last_edited_at`)
			.eq('parent_id', id);

		if (getPostsByIdError) {
			const errorMessage = `Error fetching posts for sign id ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return posts as CSComment[];
	}

	const signId = event.params.signId;
	let specificSign = null;
	let mainSign = null;
	let signVariants = null;
	let created_by_user = null;
	let annotated_by_user = null;
	let parameters: Parameter[] = [];
	let posts = null;

	if (signId) {
		// Fetch the sign
		specificSign = await getSignById(signId);

		if (specificSign.annotation_array && specificSign.annotation_array.length > 0) {
			if (specificSign.annotation) {
				const annotationIds: number[] = Object.values(specificSign.annotation)
					.flat()
					.map((id) => parseInt(id, 10))
					.filter((id) => !isNaN(id));

				parameters = await getParametersByIds(annotationIds);
			}
		}

		created_by_user = await getUserById(specificSign.created_by_user_id);
		if (specificSign.annotated_by_user_id != null) {
			annotated_by_user = await getUserById(specificSign.annotated_by_user_id);
		}
		posts = await getPostsBySignId(parseInt(signId));

		if(specificSign.main_sign_id){
			mainSign = await getSignById(specificSign.main_sign_id);
		}

		signVariants = await getSignVariants(specificSign.id);
	}

	return {
		sign: specificSign,
		parameters: parameters,
		created_by_user,
		annotated_by_user,
		posts,
		mainSign,
		signVariants
	};
};
