import { COUNTABLE_SUBMISSION_STATUSES, getTargetSigns, isIslrFeatureEnabled } from '@/server/islr';
import { handleSignInRedirect } from '@/utils';
import { redirect } from '@sveltejs/kit';

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
	const targetIds = targetSigns.map((sign) => sign.id);

	const { data: submissions, error } = await event.locals.supabase
		.from('islr_submissions')
		.select('sign_id, contributor_id, status')
		.in('sign_id', targetIds);

	if (error) throw error;

	const coveredSignIds = new Set(
		submissions
			.filter((s) => COUNTABLE_SUBMISSION_STATUSES.includes(s.status))
			.map((s) => s.sign_id)
	);
	// These dashboard metrics intentionally count every submitted video and contributor,
	// including submissions with non-countable statuses. Coverage and personal progress
	// below only use statuses that count toward the dataset.
	const totalContributors = new Set(submissions.map((s) => s.contributor_id)).size;

	const mySubmittedSignIds = new Set(
		submissions
			.filter(
				(s) => s.contributor_id === user.id && COUNTABLE_SUBMISSION_STATUSES.includes(s.status)
			)
			.map((s) => s.sign_id)
	);

	return {
		targetSignCount: targetIds.length,
		signsCovered: coveredSignIds.size,
		videosCollected: submissions.length,
		totalContributors,
		myContributedCount: mySubmittedSignIds.size,
		queueLength: targetIds.length - mySubmittedSignIds.size,
	};
};
