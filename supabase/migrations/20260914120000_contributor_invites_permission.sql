-- A new enum value can't be used in the same transaction it's added in, so
-- this is split from the policy/seed changes in the next migration.
alter type public.user_permission add value if not exists 'contributor_invites.manage';
