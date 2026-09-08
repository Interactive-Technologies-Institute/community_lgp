import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '@/types/supabase-types';
import { createClient } from '@supabase/supabase-js';

// Server-only client authenticated with the service role key. Never import
// this from code that can run in the browser - it bypasses RLS entirely.
export function createSupabaseAdminClient() {
	return createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
