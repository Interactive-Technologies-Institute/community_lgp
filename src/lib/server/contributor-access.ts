import { env } from '$env/dynamic/private';
import type { createSupabaseAdminClient } from '@/server/supabase-admin';

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

// Follow-up for an existing account that has just become a contributor (a
// plain 'user' promoted from "Convidar Contribuidor" or the users page):
// records it as an accepted invite, so it shows up in the invites table and
// the dashboard counts, and emails them a pointer to /islr-dataset.
//
// The role change has already happened by the time this runs, so failures
// here are returned as messages for the moderator instead of failing the
// action.
export async function announceContributorAccess(
	adminClient: AdminClient,
	email: string,
	invitedBy: string
): Promise<string[]> {
	const problems: string[] = [];

	const { error: inviteError } = await adminClient.from('contributor_invites').upsert(
		{
			email: email.toLowerCase(),
			role: 'contributor',
			invited_by: invitedBy,
			used_at: new Date().toISOString(),
		},
		{ onConflict: 'email' }
	);

	if (inviteError) {
		console.error('Failed to record contributor invite:', inviteError);
		problems.push(`Não foi possível registar o convite: ${inviteError.message}`);
	}

	const { error: mailError } = await adminClient.functions.invoke('send-contributor-access-email', {
		headers: { 'x-islr-secret': env.ISLR_DIGEST_SECRET ?? '' },
		body: { email },
	});

	if (mailError) {
		console.error('Failed to send contributor access email:', mailError);
		problems.push(`Não foi possível enviar o email de aviso: ${mailError.message}`);
	}

	return problems;
}
