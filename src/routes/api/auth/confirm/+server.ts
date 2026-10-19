import { createSupabaseAdminClient } from '@/server/supabase-admin';
import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event
  const token_hash = url.searchParams.get('token_hash') as string
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/'

	/**
	 * Clean up the redirect URL by deleting the Auth flow parameters.
	 *
	 * `next` is preserved for now, because it's needed in the error case.
	 */
	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (token_hash && type) {
		const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
		if (!error) {
			// Opening the invite link is what accepts it. Waiting for the
			// /accept-invite form left people who closed that page stuck as
			// "Pendente" forever, even though they were already signed in and
			// had the contributor role.
			if (type === 'invite' && data.user?.email) {
				const { error: inviteError } = await createSupabaseAdminClient()
					.from('contributor_invites')
					.update({ used_at: new Date().toISOString() })
					.eq('email', data.user.email.toLowerCase())
					.is('used_at', null);

				if (inviteError) {
					console.error('Failed to mark contributor invite as used:', inviteError);
				}
			}

			redirectTo.searchParams.delete('next');
			return redirect(303, redirectTo);
		}
	}

	redirectTo.pathname = '/auth/error';
	if (type) {
		redirectTo.searchParams.set('type', type);
	}
	return redirect(303, redirectTo);
};
