import { COUNTABLE_SUBMISSION_STATUSES, getTargetSigns, isIslrFeatureEnabled } from '@/server/islr';
import { getMilestoneProgress, getMyVideoCount } from '@/server/islr-milestones';
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
		.select('sign_id, contributor_id, status, inserted_at')
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

	const myVideoCount = await getMyVideoCount(event.locals.supabase, user.id);
	const milestoneProgress = getMilestoneProgress(myVideoCount);
	const firstName = user.user_metadata?.display_name?.trim().split(' ')[0] || null;

	const WEEKS_TO_SHOW = 8;

	// Weeks start on Monday, in UTC, so the bucketing doesn't depend on the server's local timezone.
	function startOfWeek(date: Date): Date {
		const start = new Date(date);
		const day = start.getUTCDay();
		const diffToMonday = (day === 0 ? -6 : 1) - day;
		start.setUTCDate(start.getUTCDate() + diffToMonday);
		start.setUTCHours(0, 0, 0, 0);
		return start;
	}

	const currentWeekStart = startOfWeek(new Date());
	const oldestWeekStart = new Date(currentWeekStart);
	oldestWeekStart.setUTCDate(oldestWeekStart.getUTCDate() - (WEEKS_TO_SHOW - 1) * 7);

	const weeklyVideoCounts = new Array(WEEKS_TO_SHOW).fill(0);
	for (const submission of submissions) {
		const weekStart = startOfWeek(new Date(submission.inserted_at));
		if (weekStart < oldestWeekStart) continue;
		const weeksAgo = Math.round(
			(currentWeekStart.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
		);
		const index = WEEKS_TO_SHOW - 1 - weeksAgo;
		if (index >= 0 && index < WEEKS_TO_SHOW) {
			weeklyVideoCounts[index] += 1;
		}
	}
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
