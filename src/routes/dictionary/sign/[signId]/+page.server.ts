import { createCommentSchema } from '@/schemas/cs-comment';
import { toggleSignRatingSchema } from '@/schemas/sign';
import type { CSComment, Parameter, Sign, UserProfile } from '@/types/types';
import { handleFormAction } from '@/utils.js';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { user } = await event.locals.safeGetSession();

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

	async function getSignVariants(id: number): Promise<Sign[]> {
		const { data: signs, error: signsError } = await event.locals.supabase
			.from('signs')
			.select('*')
			.eq('main_sign_id', id);

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
			.eq('sign_id', id);

		if (getPostsByIdError) {
			const errorMessage = `Error fetching posts for sign id ${id}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return posts as CSComment[];
	}

	async function getRatingBySignId(signId: number, userId: string): Promise<number | null> {
		const { data: rating, error: ratingError } = await event.locals.supabase
			.from('signs_rating')
			.select('value')
			.eq('sign_id', signId)
			.eq('user_id', userId)
			.maybeSingle();

		if (ratingError) {
			const errorMessage = `Error fetching rating for sign id ${signId}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return rating?.value ?? null;
	}

	async function getNumberOfPositives(signId: number): Promise<number | null > {
		const { count, error: positivesError } = await event.locals.supabase
			.from('signs_rating')
			.select('*', { count: 'exact', head: true })
			.eq('sign_id', signId)
			.eq('value', 1);

		if (positivesError) {
			const errorMessage = `Error fetching number of positives for sign id ${signId}, please try again later.`;
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			throw error(500, errorMessage);
		}

		return count ?? 0 ;
	}
	
	function ratingToString(rating: number | null): '1' | '0' | '-1' | null {
		if (rating === null) return null;
		if (rating === 1) return '1';
		if (rating === 0) return '0';
		if (rating === -1) return '-1';
		throw new Error(`Invalid rating value: ${rating}`);
	}

	const signId = event.params.signId;
	let specificSign = null;
	let mainSign = null;
	let signVariants = null;
	let created_by_user = null;
	let annotated_by_user = null;
	let parameters: Parameter[] = [];
	let posts = null;
	let currentRating = null;
	let numberOfPositives = null;

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
		posts = await getPostsBySignId(specificSign.id);

		if (specificSign.main_sign_id) {
			mainSign = await getSignById(specificSign.main_sign_id);
		}

		signVariants = await getSignVariants(specificSign.id);
		if (user) {
			currentRating = await getRatingBySignId(specificSign.id, user.id);
		}
		numberOfPositives = await getNumberOfPositives(specificSign.id)
	}

	

	return {
		sign: specificSign,
		parameters: parameters,
		created_by_user,
		annotated_by_user,
		posts,
		mainSign,
		signVariants,
		toggleRatingForm: await superValidate(
			{ value: ratingToString(currentRating) ?? '' },
			zod(toggleSignRatingSchema),
			{ id: 'toggle-sign-rating' }
		),
		currentRating,
		numberOfPositives,
		createCommentForm: await superValidate(
			zod(createCommentSchema),
			{ id: 'create-comment' }
		),
	};
};

export const actions = {
	toggleRating: async (event) =>
		handleFormAction(
			event,
			toggleSignRatingSchema,
			'toggle-sign-rating',
			async (event, userId, form) => {
				const signId = parseInt(event.params.signId);
				const value = form.data.value;

				if (value === null) {
					const { error } = await event.locals.supabase
						.from('signs_rating')
						.delete()
						.eq('sign_id', signId)
						.eq('user_id', userId);

					if (error) {
						console.error('Delete error:', error.message);
						setFlash({ type: 'error', message: error.message }, event.cookies);
						return fail(500, { message: error.message, form });
					}
				} else {
					const { error } = await event.locals.supabase.from('signs_rating').upsert({
						sign_id: signId,
						user_id: userId,
						value,
					}, {
						onConflict: 'sign_id, user_id'
					});

					if (error) {
						console.error('Upsert error:', error.message);
						setFlash({ type: 'error', message: error.message }, event.cookies);
						return fail(500, { message: error.message, form });
					}
				}
				return { form };
			}
		),
			createComment: async (event) => {
		const { user } = await event.locals.safeGetSession();
		
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const formData = await event.request.formData();
		const signId = parseInt(event.params.signId);

		// Parse form data manually
		const content_text = formData.get('content_text') as string;
		const content_video = formData.get('content_video') as File;

		// Validate the data
		const validation = createCommentSchema.safeParse({
			content_text: content_text || undefined,
			content_video: content_video?.size > 0 ? content_video : undefined,
		});

		if (!validation.success) {
			const fieldErrors = validation.error.flatten().fieldErrors;
			const formErrors = validation.error.flatten().formErrors;
			
			setFlash({ 
				type: 'error', 
				message: formErrors[0] || 'Dados do formulário inválidos' 
			}, event.cookies);
			
			return fail(400, { 
				errors: fieldErrors,
				message: 'Form validation failed',
			});
		}

		const { content_text: validText, content_video: validVideo } = validation.data;

		let videoUrl = null;

		// Handle video upload if present
		if (validVideo && validVideo.size > 0) {
			const fileName = `comments/${user.id}/${Date.now()}-${validVideo.name}`;
			
			const { data: uploadData, error: uploadError } = await event.locals.supabase.storage
				.from('comments') // Make sure this bucket exists in your Supabase storage
				.upload(fileName, validVideo, {
					contentType: validVideo.type,
				});

			if (uploadError) {
				console.error('Upload error:', uploadError.message);
				setFlash({ type: 'error', message: 'Erro ao fazer upload do vídeo' }, event.cookies);
				return fail(500, { message: 'Erro ao fazer upload do vídeo' });
			}

			// Get public URL
			const { data: { publicUrl } } = event.locals.supabase.storage
				.from('comments')
				.getPublicUrl(fileName);
			
			videoUrl = publicUrl;
		}

		// Insert comment into database
		const { error: insertError } = await event.locals.supabase
			.from('crowdsource_comments')
			.insert({
				parent_id: null,
				user_id: user.id,
				sign_id: signId,
				content_text: validText || null,
				content_video: videoUrl || null,
				created_at: new Date().toISOString(),
				last_edited_at: new Date().toISOString(),
			});

		if (insertError) {
			console.error('Insert error:', insertError.message);
			setFlash({ type: 'error', message: 'Erro ao criar comentário' }, event.cookies);
			return fail(500, { message: 'Erro ao criar comentário' });
		}

		setFlash({ type: 'success', message: 'Comentário criado com sucesso!' }, event.cookies);
		return { success: true };
	},
};
