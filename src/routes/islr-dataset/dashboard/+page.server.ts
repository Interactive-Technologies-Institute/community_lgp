import { countByWeek, getTargetSigns, isIslrFeatureEnabled } from '@/server/islr';
import { getMilestoneProgress, getMyVideoCount } from '@/server/islr-milestones';
import { handleSignInRedirect } from '@/utils';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const { session, user } = await event.locals.safeGetSession();
	if (!session || !user) {
		return redirect(302, handleSignInRedirect(event));
	}

	if (user.role !== 'admin' && user.role !== 'moderator' && user.role !== 'contributor') {
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
		.select('sign_id, contributor_id, inserted_at')
		.in('sign_id', targetIds);

	if (error) throw error;

	// Status is deliberately ignored: there is no peer review, so every
	// submitted video counts towards coverage and progress.
	const coveredSignIds = new Set(submissions.map((s) => s.sign_id));
	const totalContributors = new Set(submissions.map((s) => s.contributor_id)).size;

	const mySubmittedSignIds = new Set(
		submissions.filter((s) => s.contributor_id === user.id).map((s) => s.sign_id)
	);

	const myVideoCount = await getMyVideoCount(event.locals.supabase, user.id);
	const milestoneProgress = getMilestoneProgress(myVideoCount);
	const firstName = user.user_metadata?.display_name?.trim().split(' ')[0] || null;

	const WEEKS_TO_SHOW = 8;
	const weeklyVideoCounts = countByWeek(
		submissions.map((s) => s.inserted_at),
		WEEKS_TO_SHOW
	);
	const videosThisWeek = weeklyVideoCounts[WEEKS_TO_SHOW - 1];

	return {
		targetSignCount: targetIds.length,
		signsCovered: coveredSignIds.size,
		videosCollected: submissions.length,
		totalContributors,
		myContributedCount: mySubmittedSignIds.size,
		queueLength: targetIds.length - mySubmittedSignIds.size,
		myVideoCount,
		firstName,
		nextMilestoneIndex: milestoneProgress.nextIndex,
		milestoneFloor: milestoneProgress.floor,
		milestoneCeiling: milestoneProgress.ceiling,
		weeklyVideoCounts,
		videosThisWeek,
	};
};
