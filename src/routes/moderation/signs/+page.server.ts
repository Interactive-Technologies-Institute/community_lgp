import { updateModerationInfoSchema } from '@/schemas/moderation-info.js';
import type { SignWithModeration } from '@/types/types';
import { arrayQueryParam, handleFormAction, handleSignInRedirect, stringQueryParam } from '@/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const search = stringQueryParam().decode(event.url.searchParams.get('s'));
	const theme = arrayQueryParam().decode(event.url.searchParams.get('theme'));

	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleSignInRedirect(event));
	}

	async function getSigns(): Promise<SignWithModeration[]> {
		let query = event.locals.supabase
			.from('signs_view')
			.select('*, moderation:latest_signs_moderation!inner(status, inserted_at, comment)')
			.order('last_changed', { ascending: false });

		if (search) {
			query = query.textSearch('fts', search, { config: 'simple', type: 'websearch' });
		}

		if (theme && theme.length) {
			query = query.overlaps('theme', theme);
		}

		const { data: signs, error: signsError } = await query;

		if (signsError) {
			const errorMessage = 'Error fetching signs, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return signs as SignWithModeration[];
	}

	async function getThemes(): Promise<Map<string, number>> {
		const { data: themes, error: themesError } = await event.locals.supabase
			.from('signs_themes')
			.select();

		if (themesError) {
			const errorMessage = 'Error fetching theme, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		const themeMap = new Map<string, number>();
		if (themes) {
			themes.forEach((theme) => {
				const { count, theme: themeName } = theme;
				if (count !== null && themeName !== null) {
					themeMap.set(themeName, count);
				}
			});
		}

		return themeMap;
	}

	return {
		signs: await getSigns(),
		themes: await getThemes(),
		updateModerationForm: await superValidate(zod(updateModerationInfoSchema), {
			id: 'update-moderation',
		}),
	};
};

export const actions = {
	default: async (event) =>
		handleFormAction(
			event,
			updateModerationInfoSchema,
			'update-moderation',
			async (event, userId, form) => {
				const { error: supabaseError } = await event.locals.supabase
					.from('signs_moderation')
					.insert({
						sign_id: form.data.ref_id,
						created_by_user_id: form.data.user_id,
						status: form.data.status,
						comment: form.data.comment,
					});

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, { message: supabaseError.message, form });
				}

				return { form };
			}
		),
};
