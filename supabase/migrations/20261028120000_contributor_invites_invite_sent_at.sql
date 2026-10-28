-- When this email was last sent an invite, so the invites table can show it
-- and bulk resends - like consent reminders - skip anyone emailed in the last
-- day. Until now this only lived on the auth user (invited_at), which every
-- resend replaces.
alter table public.contributor_invites
	add column invite_sent_at timestamp with time zone;

update public.contributor_invites i
set invite_sent_at = coalesce(
		(
			select u.invited_at
			from auth.users u
			where lower(u.email) = i.email
		),
		i.created_at
	);
