import type { Database } from '@/types/supabase-types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const TARGET_SIGN_COUNT = 500;
export const TARGET_VIDEO_COUNT = 6000;
// A sign counts as complete once it holds its even share of the video target.
export const VIDEOS_PER_SIGN_TARGET = TARGET_VIDEO_COUNT / TARGET_SIGN_COUNT;

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
