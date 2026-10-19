-- Invites used to be marked used only once the /accept-invite form was
-- submitted, so anyone who opened the invite link (which signs them in and
-- confirms their email) but never submitted that form was stuck showing as
-- "Pendente". The link is now what marks the invite used - this backfills
-- the ones already stuck, using the moment their email was confirmed.
update public.contributor_invites i
set used_at = u.email_confirmed_at
from auth.users u
where lower(u.email) = i.email
	and i.used_at is null
	and u.email_confirmed_at is not null;
