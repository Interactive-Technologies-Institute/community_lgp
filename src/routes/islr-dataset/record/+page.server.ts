import {
	COUNTABLE_SUBMISSION_STATUSES,
	getSignSubmissionCounts,
	getTargetSigns,
	isIslrFeatureEnabled,
} from '@/server/islr';
import {
	getCrossedMilestone,
	getMilestoneProgress,
	getMyVideoCount,
} from '@/server/islr-milestones';
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

	const submissionCounts = await getSignSubmissionCounts(event.locals.supabase);

	// Deterministic per-contributor "shuffle" used as a tiebreaker: same
	// contributor + sign always hashes to the same value, so the queue order
	// is stable across page loads (the "next sign" shown now still matches
	// the "current sign" once they navigate there). Different contributors
	// get a different tiebreak order, so they aren't all steered towards the
	// exact same "least covered" sign at the same time.
	const userId = user.id;
	function tiebreakHash(signId: number): number {
		let hash = 0;
		const str = `${userId}:${signId}`;
		for (let i = 0; i < str.length; i++) {
			hash = (hash * 31 + str.charCodeAt(i)) | 0;
		}
		// Finalizer mix (à la MurmurHash3) so ids that differ by only their
		// last character - e.g. neighbouring sign ids - don't produce nearly
		// identical hashes, which would defeat the point of the tiebreak.
		hash ^= hash >>> 16;
		hash = Math.imul(hash, 0x85ebca6b);
		hash ^= hash >>> 13;
		hash = Math.imul(hash, 0xc2b2ae35);
		hash ^= hash >>> 16;
		return hash;
	}

	// Sort by coverage ascending, then by the per-contributor tiebreak, so
	// under-covered signs come first without everyone getting the same order.
	const queue = targetSigns
		.filter((sign) => !excludedIds.has(sign.id))
		.sort((a, b) => {
			const countDiff = (submissionCounts.get(a.id) ?? 0) - (submissionCounts.get(b.id) ?? 0);
			if (countDiff !== 0) return countDiff;
			return tiebreakHash(a.id) - tiebreakHash(b.id);
		});

	if (queue.length === 0) {
		return redirect(302, '/islr-dataset/dashboard');
	}

	const requestedId = Number(event.url.searchParams.get('sign'));
	const currentIndex = Math.max(
		0,
		queue.findIndex((sign) => sign.id === requestedId)
	);
	const currentSign = queue[currentIndex];
	const nextSign = queue.length > 1 ? queue[(currentIndex + 1) % queue.length] : null;

	const myVideoCount = await getMyVideoCount(event.locals.supabase, user.id);
	const milestoneProgress = getMilestoneProgress(myVideoCount);

	return {
		currentSign,
		nextSignId: nextSign?.id ?? null,
		nextSignName: nextSign?.name ?? null,
		queueLength: queue.length,
		myVideoCount,
		nextMilestoneIndex: milestoneProgress.nextIndex,
		milestoneFloor: milestoneProgress.floor,
		milestoneCeiling: milestoneProgress.ceiling,
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

				const previousVideoCount = await getMyVideoCount(event.locals.supabase, userId);

				const { error: supabaseError } = await event.locals.supabase
					.from('islr_submissions')
					.insert({
						sign_id: form.data.signId,
						contributor_id: userId,
						video: videoUrl,
					});

				if (supabaseError?.code === '23505') {
					setFlash(
						{ type: 'error', message: 'Já existe uma submissão ativa para este gesto.' },
						event.cookies
					);
					return fail(409, withFiles({ message: 'An active submission already exists.', form }));
				}

				if (supabaseError) {
					setFlash({ type: 'error', message: supabaseError.message }, event.cookies);
					return fail(500, withFiles({ message: supabaseError.message, form }));
				}

				// The insert above always adds exactly one row for this contributor, so
				// the new count is just previousVideoCount + 1 - no need to re-query it.
				const crossedMilestone = getCrossedMilestone(previousVideoCount, previousVideoCount + 1);

				setFlash(
					{
						type: 'success',
						message: 'Vídeo submetido com sucesso! Obrigado.',
						...(crossedMilestone && {
							milestone: { label: crossedMilestone.label, value: crossedMilestone.milestone },
						}),
					},
					event.cookies
				);
				return redirect(303, '/islr-dataset/record');
			}
		),
};
