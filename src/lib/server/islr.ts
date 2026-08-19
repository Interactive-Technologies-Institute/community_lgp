import type { Database } from '@/types/supabase-types';
import type { SupabaseClient } from '@supabase/supabase-js';

const TARGET_SIGN_COUNT = 500;

// Statuses that count as "this sign already has a video" for both the collective
// progress numbers and a contributor's own recording queue.
export const COUNTABLE_SUBMISSION_STATUSES = ['pending', 'approved'];

// Arbitrary/temporary selection (first signs by id) - swap the .order('id') below
// for .order('frequency', { ascending: false }) once a curated list is ready. No migration needed.
export async function getTargetSigns(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('signs')
		.select('id, name, video')
		.order('id', { ascending: true })
		.limit(TARGET_SIGN_COUNT);

	if (error) throw error;
	return data;
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
