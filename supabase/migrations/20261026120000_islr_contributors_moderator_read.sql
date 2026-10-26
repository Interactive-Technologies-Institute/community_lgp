-- The moderation page's contributor funnel needs to know who has given
-- consent, but islr_contributors only let each user read their own row.
-- Reuses the contributor_invites permission: whoever manages invites already
-- sees who was invited, and this only adds whether they went on to consent.
create policy "Allow admins and moderators to read contributors" on public.islr_contributors for
select using (
		(
			select authorize('contributor_invites.manage')
		)
	);
