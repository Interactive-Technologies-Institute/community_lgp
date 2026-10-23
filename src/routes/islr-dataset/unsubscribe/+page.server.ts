import { createSupabaseAdminClient } from '@/server/supabase-admin';
import { isValidUnsubscribeToken } from '@/server/islr-weekly-digest';
import { fail } from '@sveltejs/kit';

// Reached from the link in the weekly digest email, so it works without a
// session: the signed token is what proves the request is for this contributor.
// The GET only shows a confirmation button - mail scanners prefetch links, and
// a GET that unsubscribed would opt people out without them clicking anything.

export const load = async ({ url }) => {
	const contributorId = url.searchParams.get('u') ?? '';
	const token = url.searchParams.get('t') ?? '';

	return { valid: await isValidUnsubscribeToken(contributorId, token) };
};

export const actions = {
	default: async ({ url }) => {
		const contributorId = url.searchParams.get('u') ?? '';
		const token = url.searchParams.get('t') ?? '';

		if (!(await isValidUnsubscribeToken(contributorId, token))) {
			return fail(400, { message: 'Este link não é válido.' });
		}

		const { error } = await createSupabaseAdminClient()
			.from('islr_contributors')
			.update({ weekly_digest_enabled: false })
			.eq('id', contributorId);

		if (error) {
			console.error('Failed to unsubscribe from the weekly digest:', error);
			return fail(500, { message: 'Não foi possível concluir o pedido. Tente novamente.' });
		}

		return { unsubscribed: true };
	},
};
