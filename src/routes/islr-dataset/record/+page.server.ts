import { COUNTABLE_SUBMISSION_STATUSES, getTargetSigns, isIslrFeatureEnabled } from '@/server/islr';
import { uploadIslrVideo } from '@/server/islr-video-storage';
import { submitIslrVideoSchema } from '@/schemas/islr-submission';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

	if (user.role !== 'admin' && user.role !== 'contributor') {
		return redirect(302, '/');
	}

	if (!(await isIslrFeatureEnabled(event.locals.supabase))) {
		return redirect(302, '/');
	}

	const { data: contributor, error: contributorError } = await event.locals.supabase
		.from('islr_contributors')
		.select('id')
		.eq('id', user.id)
		.maybeSingle();

	if (contributorError) throw contributorError;

	if (!contributor) {
		return redirect(302, '/islr-dataset');
	}

	const targetSigns = await getTargetSigns(event.locals.supabase);

	const { data: mySubmissions, error: submissionsError } = await event.locals.supabase
		.from('islr_submissions')
		.select('sign_id, status')
		.eq('contributor_id', user.id);

	if (submissionsError) throw submissionsError;

	const excludedIds = new Set(
		mySubmissions
			.filter((s) => COUNTABLE_SUBMISSION_STATUSES.includes(s.status))
			.map((s) => s.sign_id)
	);

	const queue = targetSigns.filter((sign) => !excludedIds.has(sign.id));

	if (queue.length === 0) {
		return redirect(302, '/islr-dataset/dashboard');
	}

	const requestedId = Number(event.url.searchParams.get('sign'));
	const currentIndex = Math.max(
		0,
		queue.findIndex((sign) => sign.id === requestedId)
	);
	const currentSign = queue[currentIndex];
	const nextSignId = queue.length > 1 ? queue[(currentIndex + 1) % queue.length].id : null;

	return {
		currentSign,
		nextSignId,
		queueLength: queue.length,
		submitForm: await superValidate({ signId: currentSign.id }, zod(submitIslrVideoSchema), {
			id: 'submit-islr-video',
		}),
	};
};

export const actions = {
	submit: async (event) =>
		handleFormAction(
			event,
			submitIslrVideoSchema,
			'submit-islr-video',
			async (event, userId, form) => {
				let videoUrl: string;
				try {
					videoUrl = await uploadIslrVideo(form.data.video, userId);
				} catch (err) {
					const message = err instanceof Error ? err.message : 'Falha ao enviar o vídeo.';
					setFlash({ type: 'error', message }, event.cookies);
					return fail(500, withFiles({ message, form }));
				}

				const { error: supabaseError } = await event.locals.supabase
					.from('islr_submissions')
					.insert({
						sign_id: form.data.signId,
						contributor_id: userId,
						video: videoUrl,
					});

				if (supabaseError?.code === '23505') {
					setFlash(
						{ type: 'error', message: 'Já existe uma submissão ativa para este sinal.' },
						event.cookies
					);
					return fail(409, withFiles({ message: 'An active submission already exists.', form }));
				}

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, withFiles({ message: supabaseError.message, form }));
				}

				setFlash(
					{ type: 'success', message: 'Vídeo submetido com sucesso! Obrigado.' },
					event.cookies
				);
				return redirect(303, '/islr-dataset/record');
			}
		),
};
