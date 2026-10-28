import type { Database } from '@/types/supabase-types';
import type { SupabaseClient } from '@supabase/supabase-js';

const TARGET_SIGN_COUNT = 500;
export const TARGET_VIDEO_COUNT = 6000;
// The Monday the ISLR collection opened.
export const COLLECTION_START = '2026-10-12';

// At or under PostgREST's default max_rows, so a short page really is the last one.
const SUBMISSIONS_PAGE_SIZE = 1000;

// Every submission's sign, contributor and date, read in pages because PostgREST
// caps each response at max_rows, well below the video target. Status is
// deliberately ignored: there is no peer review, so every submitted video
// counts.
export async function getAllSubmissions(supabase: SupabaseClient<Database>) {
	const submissions: { sign_id: number; contributor_id: string; inserted_at: string }[] = [];
	for (let from = 0; ; from += SUBMISSIONS_PAGE_SIZE) {
		const { data, error } = await supabase
			.from('islr_submissions')
			.select('sign_id, contributor_id, inserted_at')
			.order('id', { ascending: true })
			.range(from, from + SUBMISSIONS_PAGE_SIZE - 1);

		if (error) throw error;

		submissions.push(...data);
		if (data.length < SUBMISSIONS_PAGE_SIZE) return submissions;
	}
}

// Weeks start on Monday, in UTC, so the bucketing doesn't depend on the server's local timezone.
export function startOfWeek(date: Date): Date {
	const start = new Date(date);
	const day = start.getUTCDay();
	const diffToMonday = (day === 0 ? -6 : 1) - day;
	start.setUTCDate(start.getUTCDate() + diffToMonday);
	start.setUTCHours(0, 0, 0, 0);
	return start;
}

// How many weeks, counting the current one, have started since `date`.
export function weeksSince(date: string): number {
	const elapsed = startOfWeek(new Date()).getTime() - startOfWeek(new Date(date)).getTime();
	return Math.round(elapsed / (7 * 24 * 60 * 60 * 1000)) + 1;
}

// How many of the given timestamps fall in each of the last `weeks` weeks,
// oldest first; the last entry is the current, still running week.
export function countByWeek(timestamps: string[], weeks: number): number[] {
	const currentWeekStart = startOfWeek(new Date());
	const counts = new Array(weeks).fill(0);
	for (const timestamp of timestamps) {
		const weekStart = startOfWeek(new Date(timestamp));
		const weeksAgo = Math.round(
			(currentWeekStart.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
		);
		const index = weeks - 1 - weeksAgo;
		if (index >= 0 && index < weeks) {
			counts[index] += 1;
		}
	}
	return counts;
}

export async function getTargetSigns(supabase: SupabaseClient<Database>) {
	const { data: trainingVocabulary, error: trainingVocabularyError } = await supabase
		.from('training_vocabulary')
		.select('sign_id')
		.is('removed_at', null);

	if (trainingVocabularyError) throw trainingVocabularyError;

	const trainingSignIds = trainingVocabulary.map((row) => row.sign_id);

	const { data, error } = await supabase
		.from('signs')
		.select('id, name, video')
		.in('id', trainingSignIds)
		.order('id', { ascending: true })
		.limit(TARGET_SIGN_COUNT);

	if (error) throw error;
	return data;
}

// Counts submissions per sign, across all contributors, so the recording queue
// can be ordered towards whichever signs have the least coverage so far.
// Status is deliberately ignored: there is no peer review, so every submitted
// video counts.
export async function getSignSubmissionCounts(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('islr_submissions')
		.select('sign_id');

	if (error) throw error;

	const counts = new Map<number, number>();
	for (const { sign_id } of data) {
		counts.set(sign_id, (counts.get(sign_id) ?? 0) + 1);
	}
	return counts;
}

export async function isIslrFeatureEnabled(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('feature_flags')
		.select('enabled')
		.eq('id', 'islrdatasetcontribute')
		.maybeSingle();

	if (error) throw error;

	return data?.enabled ?? false;
}
