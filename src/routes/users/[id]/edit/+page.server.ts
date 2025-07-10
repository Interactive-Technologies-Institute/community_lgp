import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { updatePasswordSchema } from '@/schemas/password';
import { updateUserProfileSchema } from '@/schemas/user-profile';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import type { StorageError } from '@supabase/storage-js';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { v4 as uuidv4 } from 'uuid';

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	let id = event.params.id;
	if (id === 'me') {
		if (!session || !user) {
			return redirect(302, handleSignInRedirect(event));
		}
		id = user.id;
	}

	async function getUserProfile(id: string) {
		const { data: userProfile, error: userProfileError } = await event.locals.supabase
			.from('profiles_view')
			.select('*')
			.eq('id', id)
			.single();

		if (userProfileError) {
			const errorMessage = 'Error fetching user profile, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		let avatarUrl: string | undefined;
		if (userProfile.avatar) {
			avatarUrl = event.locals.supabase.storage.from('users').getPublicUrl(userProfile.avatar)
				.data.publicUrl;
		}

		return { ...userProfile, avatar: undefined, avatarUrl };
	}

	const userProfileData = await getUserProfile(id);

	return {
		updateProfile: await superValidate(userProfileData, zod(updateUserProfileSchema), {
			id: 'update-profile',
		}),
		updatePassword: await superValidate(zod(updatePasswordSchema), {
			id: 'update-password',
		}),
	};
};

export const actions = {
	updateProfile: async (event) =>
		handleFormAction(
			event,
			updateUserProfileSchema,
			'update-profile',
			async (event, userId, form) => {
				async function uploadAvatar(
					avatar: File
				): Promise<{ path: string; error: StorageError | null }> {
					const fileExt = avatar.name.split('.').pop();
					const filePath = `${userId}/avatar.${fileExt}?updated=${Date.now()}`;

					const { data: avatarFileData, error: avatarFileError } =
						await event.locals.supabase.storage.from('users').upload(filePath, avatar, {
							upsert: true,
						});

					if (avatarFileError) {
						setFlash({ type: 'error', message: avatarFileError.message }, event.cookies);
						return { path: '', error: avatarFileError };
					}

					return { path: avatarFileData.path, error: null };
				}

				let avatarPath = '';
				if (form.data.avatar) {
					const { path, error } = await uploadAvatar(form.data.avatar);
					if (error) {
						return fail(500, withFiles({ message: error.message, form }));
					}
					avatarPath = path;
				} else if (form.data.avatarUrl) {
					avatarPath = form.data.avatarUrl.split('/').pop() ?? '';
				}

				async function uploadVideo(
								video: File,
								folder: string = ''
							): Promise<{ path: string; error: StorageError | null }> {
								const fileExt = video.name.split('.').pop();
								const fileName = `${userId}_${uuidv4()}.${fileExt}`;
								const filePath = folder ? `${folder}/${fileName}` : fileName;
				
								const { data: videoFileData, error: videoFileError } = await event.locals.supabase.storage
									.from('sign-name')
									.upload(filePath, video);
				
								if (videoFileError) {
									setFlash({ type: 'error', message: videoFileError.message }, event.cookies);
									return { path: '', error: videoFileError };
								}
				
								return { path: videoFileData.path, error: null };
							}
				
							let videoPath = '';
				if (form.data.sign_name instanceof File) {
					console.log('Uploading video file:', form.data.sign_name.name, 'Size:', form.data.sign_name.size);
					const { path, error } = await uploadVideo(form.data.sign_name);
					if (error) {
						console.error('Video upload error:', error);
						return fail(500, withFiles({ message: error.message, form }));
					}
					videoPath = path;
					console.log('Video uploaded successfully to:', path);
				} else if (typeof form.data.sign_name === 'string' && form.data.sign_name) {
					// Extract path from existing URL
					const url = form.data.sign_name;
					const pathMatch = url.match(/\/sign-name\/(.+)$/);
					videoPath = pathMatch ? pathMatch[1] : '';
				}

				
				

				const { signNameUrl, ...data } = form.data;
				const { error: supabaseError } = await event.locals.supabase
				.from('profiles')
				.update({
					display_name : data.display_name,
					description: data.description,
					age: data.age,
					profession: data.profession,
					language: data.language, 
					gender: data.gender,
					cnum: data.cnum, 
					sign_name: `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/sign-name/` + videoPath,
				})
				.eq('id', userId);

				if (supabaseError) {
								setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
								return fail(500, withFiles({ message: supabaseError.message, form }));
							}

				setFlash({ type: 'success', message: 'Perfil atualizado com sucesso!' }, event.cookies);
				return withFiles({ form });
			}
		),
	updatePassword: async (event) =>
		handleFormAction(
			event,
			updatePasswordSchema,
			'update-password',
			async (event, userId, form) => {
				const { data: verifyData } = await event.locals.supabase.rpc('verify_user_password', {
					password: form.data.currentPassword,
				});

				if (!verifyData) {
					setFlash({ type: 'error', message: 'Palavra passe atual incorreta.' }, event.cookies);
					return fail(500, { message: 'Palavra passe atual incorreta.', form });
				}

				const { error: updateError } = await event.locals.supabase.auth.updateUser({
					password: form.data.newPassword,
				});

				if (updateError) {
					setFlash({ type: 'error', message: updateError.message }, event.cookies);
					return fail(500, { message: updateError.message, form });
				}

				setFlash({ type: 'success', message: 'Password atualizada com sucesso.' }, event.cookies);
				return { form };
			}
		),
};
