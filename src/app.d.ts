// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '@/types/supabase-types';
import type { Branding, Notification, UserWithRole } from '@/types/types';
import { Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ session: Session | null; user: UserWithRole | null }>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			user: UserWithRole | null;
			profile: UserProfile | null;
			notifications: Notification[];
			features: Feature[];
			branding: Branding;
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
