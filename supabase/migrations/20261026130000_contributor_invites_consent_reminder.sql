-- When a contributor who accepted their invite but never gave consent was
-- last emailed a reminder from the moderation page. Bulk reminders skip
-- anyone reminded recently, so repeated clicks don't email the same people
-- twice.
alter table public.contributor_invites
	add column consent_reminded_at timestamp with time zone;
