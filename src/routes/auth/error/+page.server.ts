import { requestNewInviteSchema } from '@/schemas/request-new-invite';
import { clearStaleInviteUser } from '@/server/pending-invite';
import { createSupabaseAdminClient } from '@/server/supabase-admin';
import { handleFormAction } from '@/utils';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	return {
		type: event.url.searchParams.get('type'),
		requestNewInviteForm: await superValidate(zod(requestNewInviteSchema), {
			id: 'request-new-invite',
		}),
	};
};

export const actions = {
	// For an expired/used invite link (type=invite). Creates a brand new
	// invite, clearing out the unconfirmed auth user the original invite left
	// behind (see clearStaleInviteUser for why that's needed).
	requestInvite: async (event) =>
		handleFormAction(
			event,
			requestNewInviteSchema,
			'request-new-invite',
			async (event, _userId, form) => {
				const email = form.data.email.toLowerCase();
				const adminClient = createSupabaseAdminClient();

				// Only emails with a still-open invite (sent but never accepted) get a
				// new one - this also doubles as our anti-enumeration guard, since the
				// flash message below is identical either way.
				const { data: invite } = await adminClient
					.from('contributor_invites')
					.select('used_at')
					.eq('email', email)
					.maybeSingle();

				if (invite && invite.used_at === null) {
					// If the account actually looks used, this leaves it alone - the
					// flash message below stays the same either way, so nothing here
					// leaks whether an account exists.
					const result = await clearStaleInviteUser(adminClient, email);
					if (result.ok) {
						await adminClient.auth.admin.inviteUserByEmail(email, {
							redirectTo: `${event.url.origin}/accept-invite`,
						});
					}
				}

				setFlash(
					{
						type: 'success',
						message:
							'Se existir um convite pendente para este email, foi enviado um novo. Verifique a caixa de entrada (e o spam).',
					},
					event.cookies
				);

				return { form };
			},
			{ requireAuth: false }
		),
};
