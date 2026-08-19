import { submitIslrVoteSchema } from '@/schemas/islr-vote';
import { isIslrFeatureEnabled } from '@/server/islr';
import { handleFormAction, handleSignInRedirect } from '@/utils';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const MAX_VOTES = 3;

const isEligibleIslrReviewer = async (
	event: RequestEvent,
	user: { id: string; role?: string }
) => {
	if (user.role !== 'admin' && user.role !== 'contributor') {
		return false;
	}

	if (!(await isIslrFeatureEnabled(event.locals.supabase))) {
		return false;
	}

	const { data: contributor, error } = await event.locals.supabase
		.from('islr_contributors')
		.select('id')
		.eq('id', user.id)
		.maybeSingle();

	if (error) throw error;

	return Boolean(contributor);
};

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

	if (!(await isEligibleIslrReviewer(event, user))) {
		return redirect(302, '/islr-dataset');
	}

	const { data: submissions, error: submissionsError } = await event.locals.supabase
		.from('islr_submissions')
		.select('id, video, contributor_id, signs(id, name, video)')
		.eq('status', 'pending')
		.neq('contributor_id', user.id)
		.order('id', { ascending: true });

	if (submissionsError) throw submissionsError;

	if (submissions.length === 0) {
		return {
			queueEmpty: true as const,
			voteForm: await superValidate(
				{ submissionId: 0, decision: 'accept' as const },
				zod(submitIslrVoteSchema),
				{ id: 'submit-islr-vote' }
			),
		};
	}

	const submissionIds = submissions.map((s) => s.id);

	const { data: allVotes, error: votesError } = await event.locals.supabase
		.from('islr_submission_votes')
		.select('submission_id, reviewer_id')
		.in('submission_id', submissionIds);

	if (votesError) throw votesError;

	const voteCounts = new Map<number, number>();
	const myVotedIds = new Set<number>();
	for (const vote of allVotes) {
		voteCounts.set(vote.submission_id, (voteCounts.get(vote.submission_id) ?? 0) + 1);
		if (vote.reviewer_id === user.id) {
			myVotedIds.add(vote.submission_id);
		}
	}

	// Explicit safety check: never show a reviewer their own submission, even if the
	// query above were ever wrong.
	const queue = submissions.filter(
		(s) =>
			s.contributor_id !== user.id &&
			!myVotedIds.has(s.id) &&
			(voteCounts.get(s.id) ?? 0) < MAX_VOTES
	);

	if (queue.length === 0) {
		return {
			queueEmpty: true as const,
			voteForm: await superValidate(
				{ submissionId: 0, decision: 'accept' as const },
				zod(submitIslrVoteSchema),
				{ id: 'submit-islr-vote' }
			),
		};
	}

	const current = queue[0];
	const sign = Array.isArray(current.signs) ? current.signs[0] : current.signs;

	return {
		queueEmpty: false as const,
		currentItem: {
			id: current.id,
			signName: sign?.name ?? '',
			referenceVideo: sign?.video ?? '',
			submissionVideo: current.video,
		},
		queueLength: queue.length,
		voteForm: await superValidate(
			{ submissionId: current.id, decision: 'accept' as const },
			zod(submitIslrVoteSchema),
			{ id: 'submit-islr-vote' }
		),
	};
};

export const actions = {
	vote: async (event) =>
		handleFormAction(
			event,
			submitIslrVoteSchema,
			'submit-islr-vote',
			async (event, userId, form) => {
				const { user } = await event.locals.safeGetSession();
				if (!user || !(await isEligibleIslrReviewer(event, user))) {
					return fail(403, { message: 'Forbidden.', form });
				}

				const { data: submission, error: submissionError } = await event.locals.supabase
					.from('islr_submissions')
					.select('id, contributor_id, status')
					.eq('id', form.data.submissionId)
					.maybeSingle();

				if (submissionError) {
					console.error('Error fetching ISLR submission for review:', submissionError);
					return fail(500, { message: 'Não foi possível carregar a submissão.', form });
				}

				if (
					!submission ||
					submission.status !== 'pending' ||
					submission.contributor_id === userId
				) {
					setFlash({ type: 'error', message: 'Esta submissão não pode ser avaliada.' }, event.cookies);
					return fail(400, { message: 'Invalid submission.', form });
				}

				// This check and insert are intentionally not transactional: concurrent votes are
				// rare, and the worst case is exceeding the display limit without breaking the app.
				const { data: existingVotes, error: votesError } = await event.locals.supabase
					.from('islr_submission_votes')
					.select('reviewer_id')
					.eq('submission_id', form.data.submissionId);

				if (votesError) {
					console.error('Error fetching ISLR submission votes:', votesError);
					return fail(500, { message: 'Não foi possível verificar os votos.', form });
				}

				if (existingVotes.some((vote) => vote.reviewer_id === userId)) {
					setFlash({ type: 'error', message: 'Já votaste nesta submissão.' }, event.cookies);
					return fail(400, { message: 'Already voted.', form });
				}

				if (existingVotes.length >= MAX_VOTES) {
					setFlash(
						{ type: 'error', message: 'Esta submissão já atingiu o limite de votos.' },
						event.cookies
					);
					return fail(400, { message: 'Vote limit reached.', form });
				}

				const { error: supabaseError } = await event.locals.supabase
					.from('islr_submission_votes')
					.insert({
						submission_id: form.data.submissionId,
						reviewer_id: userId,
						approved: form.data.decision === 'accept',
					});

				if (supabaseError) {
					console.error('Error inserting ISLR submission vote:', supabaseError);
					const errorMessage = 'Não foi possível registar o voto. Tenta novamente mais tarde.';
					setFlash({ type: 'error', message: errorMessage }, event.cookies);
					return fail(500, { message: errorMessage, form });
				}

				setFlash({ type: 'success', message: 'Voto registado. Obrigado!' }, event.cookies);
				return redirect(303, '/islr-dataset/review');
			}
		),
};
