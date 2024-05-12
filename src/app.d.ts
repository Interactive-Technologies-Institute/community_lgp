// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '@/types/database-types';
import type { UserWithRole } from '@/types/types';
import { Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ session: Session | null; user: UserWithRole | null }>;
		}
		interface PageData {
			session: Session | null;
			user: UserWithRole | null;
			profile: UserProfile | null;
			features: Feature[];
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
