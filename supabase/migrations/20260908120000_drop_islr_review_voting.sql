drop table if exists "public"."islr_submission_votes";

drop function if exists public.check_islr_submission_vote_limit();
drop function if exists public.handle_islr_submission_vote();
