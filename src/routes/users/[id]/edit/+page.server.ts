import { updatePasswordSchema } from '@/schemas/password';
import { updateUserProfileSchema } from '@/schemas/user-profile';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import type { StorageError } from '@supabase/storage-js';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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

				const updateData: any = {};

				if (form.data.display_name?.trim()) {
					updateData.display_name = form.data.display_name;
				}
				if (form.data.description?.trim()) {
					updateData.description = form.data.description;
				}
				if (avatarPath) {
					updateData.avatar = avatarPath;
				}
				if (form.data.age) {
					updateData.age = form.data.age;
				}
				if (form.data.gender?.trim()) {
					updateData.gender = form.data.gender;
				}
				if (form.data.language?.trim()) {
					updateData.language = form.data.language;
				}
				if (form.data.profession?.trim()) {
					updateData.profession = form.data.profession;
				}

				// Only update if there are fields to update
				if (Object.keys(updateData).length > 0) {
					const { error: profileError } = await event.locals.supabase
						.from('profiles')
						.update(updateData)
						.eq('id', userId);

					if (profileError) {
						setFlash({ type: 'error', message: profileError.message }, event.cookies);
						return fail(500, withFiles({ message: profileError.message, form }));
					}
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
