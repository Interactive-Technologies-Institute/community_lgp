-- Weekly ISLR digest email: every Monday morning each contributor gets a
-- summary of what they recorded the previous week (or a nudge to come back), sent by
-- the send-islr-weekly-digest Edge Function.

-- Contributors can opt out through the unsubscribe link in the email.
alter table public.islr_contributors
	add column weekly_digest_enabled boolean not null default true;

-- Monday (UTC) of the last week a digest was sent for. The function skips
-- contributors already marked for the week being reported, so a retried or
-- duplicated cron run doesn't email anyone twice.
alter table public.islr_contributors
	add column weekly_digest_last_sent_week date;

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- The project URL and the digest secret are read from Vault so they don't
-- live in the migration. Create them once per environment:
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('<same value as ISLR_DIGEST_SECRET>', 'islr_digest_secret');
-- Monday 08:00 UTC (08:00/09:00 in Lisbon, depending on DST).
select cron.schedule(
	'islr-weekly-digest',
	'0 8 * * 1',
	$$
	select net.http_post(
		url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
			|| '/functions/v1/send-islr-weekly-digest',
		headers := jsonb_build_object(
			'Content-Type', 'application/json',
			'x-digest-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'islr_digest_secret')
		),
		body := '{}'::jsonb,
		timeout_milliseconds := 300000
	);
	$$
);
