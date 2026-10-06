import type { Database } from '@/types/supabase-types';
import type { SupabaseClient } from '@supabase/supabase-js';

type AdminClient = SupabaseClient<Database>;

const LIST_USERS_PER_PAGE = 1000;

/**
 * Finds a user's auth id by email via the admin API rather than the
 * `profiles` table. A profiles row can be deleted manually without touching
 * auth.users (this has happened in practice), which would otherwise hide a
 * stale invited user from this lookup entirely.
 */
async function findAuthUserIdByEmail(
	adminClient: AdminClient,
	email: string
): Promise<{ ok: true; id: string | null } | { ok: false; reason: string }> {
	for (let page = 1; ; page++) {
		const { data, error } = await adminClient.auth.admin.listUsers({
			page,
			perPage: LIST_USERS_PER_PAGE,
		});

		if (error) {
			return {
				ok: false,
				reason: `Não foi possível consultar os utilizadores existentes (${error.message}). Por segurança, nada foi apagado - tente novamente ou verifique manualmente no Supabase Studio.`,
			};
		}

		const match = data.users.find((user) => user.email?.toLowerCase() === email);
		if (match) {
			return { ok: true, id: match.id };
		}

		if (data.users.length < LIST_USERS_PER_PAGE) {
			return { ok: true, id: null };
		}
	}
}

/**
 * Clears the leftover auth user from a contributor invite that was sent but
 * never completed via /accept-invite, so the email can be invited again.
 *
 * `contributor_invites.used_at` being null only means our own bookkeeping
 * never saw /accept-invite run for this email - it doesn't prove the account
 * is unused, since someone could have activated it another way (e.g. a
 * password reset) without ever hitting that page. So before deleting, this
 * also checks Supabase's own record of the account (email confirmation,
 * sign-ins) and refuses to touch anything that looks like it's actually
 * been used. Any lookup/delete failure also refuses rather than deletes -
 * an error here must never be treated as "safe to delete".
 */
export async function clearStaleInviteUser(
	adminClient: AdminClient,
	email: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
	const lookup = await findAuthUserIdByEmail(adminClient, email);
	if (!lookup.ok) {
		return lookup;
	}

	if (!lookup.id) {
		return { ok: true };
	}

	const { data: staleUser, error: getUserError } = await adminClient.auth.admin.getUserById(
		lookup.id
	);

	if (getUserError) {
		return {
			ok: false,
			reason: `Não foi possível verificar a conta com o email ${email} (${getUserError.message}). Por segurança, não foi apagada automaticamente - verifique manualmente em Authentication → Users no Supabase Studio.`,
		};
	}

	const neverActivated = !staleUser.user.email_confirmed_at && !staleUser.user.last_sign_in_at;

	if (!neverActivated) {
		return {
			ok: false,
			reason: `Existe uma conta com o email ${email} que parece já ter sido ativada (email confirmado ou com login feito), apesar de não constar como convite aceite. Por segurança, não foi apagada automaticamente - verifique manualmente em Authentication → Users no Supabase Studio antes de reenviar o convite.`,
		};
	}

	const { error: deleteError } = await adminClient.auth.admin.deleteUser(lookup.id);
	if (deleteError) {
		return {
			ok: false,
			reason: `Não foi possível remover a conta pendente com o email ${email} (${deleteError.message}). Tente novamente ou verifique manualmente no Supabase Studio.`,
		};
	}

	return { ok: true };
}
