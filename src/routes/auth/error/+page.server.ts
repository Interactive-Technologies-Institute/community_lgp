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
	// behind (see clearStaleInviteUser for why that's needed) - or, if the
	// invite was opened but signup never finished, emails a link back to it.
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
				} else if (invite) {
					// The invite link was opened (that's what marks it used) but the
					// person never finished /accept-invite, so the account has no name
					// or password and its link is spent. Deleting and re-inviting
					// would also delete any videos already recorded, so send a
					// one-off sign-in link instead - its email template
					// (supabase/templates/magic_link.html) reads as "finish your
					// signup" and lands on /accept-invite.
					const { data: profile } = await adminClient
						.from('profiles')
						.select('display_name')
						.eq('email', email)
						.maybeSingle();

					if (profile && !profile.display_name.trim()) {
						const { error: otpError } = await adminClient.auth.signInWithOtp({
							email,
							options: { shouldCreateUser: false },
						});
						if (otpError) {
							console.error('Failed to send finish-signup link:', otpError);
						}
					}
				}

				setFlash(
					{
						type: 'success',
						message:
							'Se existir um convite por concluir para este email, foi enviado um novo link. Verifique a caixa de entrada (e o spam).',
					},
					event.cookies
				);

				return { form };
			},
			{ requireAuth: false }
		),
};
