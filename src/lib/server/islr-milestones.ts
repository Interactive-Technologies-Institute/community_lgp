import { PERSONAL_MILESTONES } from '@/islr-milestones';
import type { Database } from '@/types/supabase-types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Total videos submitted by this contributor, regardless of status - personal
// milestones celebrate effort, unlike the dataset coverage numbers which only
// count statuses in COUNTABLE_SUBMISSION_STATUSES.
export async function getMyVideoCount(supabase: SupabaseClient<Database>, contributorId: string) {
	const { count, error } = await supabase
		.from('islr_submissions')
		.select('id', { count: 'exact', head: true })
		.eq('contributor_id', contributorId);

	if (error) throw error;
	return count ?? 0;
}

export function getMilestoneProgress(videoCount: number) {
	const nextIndex = PERSONAL_MILESTONES.findIndex((milestone) => videoCount < milestone);

	// -1 means every milestone has been reached; treat the last one as both ends
	// of the segment so callers can render a maxed-out (100%) bar.
	if (nextIndex === -1) {
		const last = PERSONAL_MILESTONES[PERSONAL_MILESTONES.length - 1];
		return { nextIndex: PERSONAL_MILESTONES.length, floor: last, ceiling: last };
	}

	const floor = nextIndex === 0 ? 0 : PERSONAL_MILESTONES[nextIndex - 1];
	const ceiling = PERSONAL_MILESTONES[nextIndex];
	return { nextIndex, floor, ceiling };
}
