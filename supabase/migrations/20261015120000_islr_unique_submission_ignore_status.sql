-- Peer review voting was dropped (20260908120000), so submission status no
-- longer changes and every submitted video counts. The partial unique index
-- only covered pending/approved rows, which let a contributor record a sign
-- again if an earlier video had been rejected by the old voting - replace it
-- with one that ignores status.
--
-- This fails if a contributor already has more than one submission for the
-- same sign (e.g. a re-recording after a rejection). Those duplicates must be
-- resolved before applying this migration.
drop index if exists public.islr_one_active_submission_per_contributor_sign;

create unique index islr_one_submission_per_contributor_sign on public.islr_submissions using btree (contributor_id, sign_id);
