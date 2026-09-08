-- 20260817235501_remote_schema.sql is a schema dump taken before the
-- contributor-invite feature existed, and it recreates handle_new_user()
-- with the old body (always 'user', no invite lookup, no display_name
-- coalesce). Since migration filenames sort after 00000000000008, that dump
-- silently undoes the invite-role-assignment logic. Re-asserting the correct
-- version here, after every currently-known migration, so it always wins.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$
declare
	invite public.contributor_invites%rowtype;
	assigned_role public.user_role := 'user';
begin
	select * into invite
	from public.contributor_invites
	where lower(email) = lower(new.email)
		and used_at is null
	limit 1;

	if found then
		assigned_role := invite.role;
	end if;

	insert into public.user_roles (id, role)
	values (new.id, assigned_role);
	insert into public.profiles (id, email, type, display_name)
	values (
			new.id,
			new.email,
			(
				select slug
				from public.user_types
				where is_default = true
			),
			-- Invited users have no display_name yet (they set it on the
			-- accept-invite page after account creation); the column is
			-- NOT NULL, so fall back to an empty string rather than null.
			coalesce(new.raw_user_meta_data->>'display_name', '')
		);
	return new;
end;
$$;
