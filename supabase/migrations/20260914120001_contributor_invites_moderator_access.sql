-- Moderators can now manage contributor invites too, but this intentionally
-- uses a new, narrow permission instead of reusing 'user_roles.update' -
-- moderators should be able to invite/see contributor invites without also
-- gaining the ability to change any user's role (e.g. promote to admin),
-- which 'user_roles.update' would grant.
drop policy "Allow admins to read contributor invites" on public.contributor_invites;
drop policy "Allow admins to create contributor invites" on public.contributor_invites;
drop policy "Allow admins to update contributor invites" on public.contributor_invites;

create policy "Allow admins and moderators to read contributor invites" on public.contributor_invites for
select using (
		(
			select authorize('contributor_invites.manage')
		)
	);
create policy "Allow admins and moderators to create contributor invites" on public.contributor_invites for
insert with check (
		(
			select authorize('contributor_invites.manage')
		)
	);
create policy "Allow admins and moderators to update contributor invites" on public.contributor_invites for
update using (
		(
			select authorize('contributor_invites.manage')
		)
	);

insert into public.role_permissions (role, permission)
values ('admin', 'contributor_invites.manage'),
	('moderator', 'contributor_invites.manage');
