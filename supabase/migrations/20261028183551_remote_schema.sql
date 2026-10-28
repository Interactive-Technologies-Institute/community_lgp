drop view if exists "public"."profiles_view";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize(requested_permission public.user_permission)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare bind_permissions int;
user_role public.user_role;
begin -- Fetch user role once and store it to reduce number of calls
select (auth.jwt()->>'user_role')::public.user_role into user_role;
select count(*) into bind_permissions
from public.role_permissions
where role_permissions.permission = requested_permission
	and role_permissions.role = user_role;
return bind_permissions > 0;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.auto_lock_post()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.created_at < NOW() - INTERVAL '7 days' THEN
    NEW.is_locked := TRUE;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare claims jsonb;
user_role public.user_role;
begin -- Check if the user is marked as admin in the profiles table
select role into user_role
from public.user_roles
where id = (event->>'user_id')::uuid;
claims := event->'claims';
if user_role is not null then -- Set the claim
claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
else claims := jsonb_set(claims, '{user_role}', 'null');
end if;
-- Update the 'claims' object in the original event
event := jsonb_set(event, '{claims}', claims);
-- Return the modified or original event
return event;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_event_interest_count(event_id bigint, user_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(count bigint, has_interest boolean)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
select count(*) as interest_count,
	case
		when exists (
			select 1
			from public.events_interested
			where user_id = user_id
				and event_id = event_id
		) then true
		else false
	end as has_interest
from public.events_interested
where event_id = event_id;
$function$
;

CREATE OR REPLACE FUNCTION public.get_guide_useful_count(guide_id bigint, user_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(count bigint, has_useful boolean)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
select count(*) as count,
	case
		when exists (
			select 1
			from public.guides_useful
			where user_id = user_id
				and guide_id = guide_id
		) then true
		else false
	end as has_useful
from public.guides_useful
where guide_id = guide_id;
$function$
;

CREATE OR REPLACE FUNCTION public.hamming_distance(array1 bigint[], array2 bigint[])
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  distance INTEGER := 0;
BEGIN
  IF cardinality(array1) != cardinality(array2) THEN
    RAISE EXCEPTION 'Arrays must be of the same length';
  END IF;

  FOR i IN 1..cardinality(array1) LOOP
    IF array1[i] != array2[i] THEN
      distance := distance + 1;
    END IF;
  END LOOP;

  RETURN distance;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_event_moderation_updates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin
insert into public.events_moderation (event_id, user_id, status, comment)
values (
		new.id,
		new.user_id,
		'pending'::moderation_status,
		'Pending moderation'
	);
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_events_moderation_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare notification_type notification_type;
begin if new.status = 'pending' then notification_type := 'event_pending';
elsif new.status = 'changes_requested' then notification_type := 'event_changes_requested';
elsif new.status = 'approved' then notification_type := 'event_approved';
elsif new.status = 'rejected' then notification_type := 'event_rejected';
end if;
insert into public.notifications (user_id, type, data)
values (
		new.user_id,
		notification_type,
		jsonb_build_object('event_id', new.event_id)
	);
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_guide_moderation_updates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin
insert into public.guides_moderation (guide_id, user_id, status, comment)
values (
		new.id,
		new.user_id,
		'pending'::moderation_status,
		'Pending moderation'
	);
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_guides_moderation_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare notification_type notification_type;
begin if new.status = 'pending' then notification_type := 'guide_pending';
elsif new.status = 'changes_requested' then notification_type := 'guide_changes_requested';
elsif new.status = 'approved' then notification_type := 'guide_approved';
elsif new.status = 'rejected' then notification_type := 'guide_rejected';
end if;
insert into public.notifications (user_id, type, data)
values (
		new.user_id,
		notification_type,
		jsonb_build_object('guide_id', new.guide_id)
	);
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_map_pin_moderation_updates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin
insert into public.map_pins_moderation (map_pin_id, user_id, status, comment)
values (
		new.id,
		new.user_id,
		'pending'::moderation_status,
		'Pending moderation'
	);
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_map_pins_moderation_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare notification_type notification_type;
begin if new.status = 'pending' then notification_type := 'map_pin_pending';
elsif new.status = 'changes_requested' then notification_type := 'map_pin_changes_requested';
elsif new.status = 'approved' then notification_type := 'map_pin_approved';
elsif new.status = 'rejected' then notification_type := 'map_pin_rejected';
end if;
insert into public.notifications (user_id, type, data)
values (
		new.user_id,
		notification_type,
		jsonb_build_object('map_pin_id', new.map_pin_id)
	);
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_sign_moderation_updates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if new.theme = ARRAY['Proposta - Em Discussão'] and new.theme_flattened = 'Proposta - Em Discussão' then
    insert into public.signs_moderation (sign_id, created_by_user_id, status, comment)
    values (
      new.id,
      new.created_by_user_id,
      'pending',
      'Pending moderation'
    );
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_signs_moderation_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  notification_type notification_type;
  theme_check boolean;
begin
  -- Lookup the related sign and check theme conditions
  select 
    (s.theme = ARRAY['Proposta - Em Discussão'] and s.theme_flattened = 'Proposta - Em Discussão')
  into theme_check
  from public.signs s
  where s.id = new.sign_id;

  -- Only insert notification if theme matches
  if theme_check then
    if new.status = 'pending' then
      notification_type := 'sign_pending';
    elsif new.status = 'changes_requested' then
      notification_type := 'sign_changes_requested';
    elsif new.status = 'approved' then
      notification_type := 'sign_approved';
    elsif new.status = 'rejected' then
      notification_type := 'sign_rejected';
    end if;

    insert into public.notifications (user_id, type, data)
    values (
      new.created_by_user_id,
      notification_type,
      jsonb_build_object('sign_id', new.sign_id)
    );
  end if;

  return new;
end;
$function$
;

create or replace view "public"."profiles_view" as  SELECT p.id,
    p.inserted_at,
    p.updated_at,
    p.email,
    p.type,
    p.display_name,
    p.description,
    p.avatar,
    p.age,
    p.profession,
    p.language,
    p.gender,
    p.cnum,
    p.sign_name,
    COALESCE(roles.role, 'user'::public.user_role) AS role
   FROM (public.profiles p
     LEFT JOIN public.user_roles roles ON ((p.id = roles.id)));


CREATE OR REPLACE FUNCTION public.search_name(term text)
 RETURNS SETOF public.signs
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM signs
  WHERE unaccent(name) ILIKE unaccent('%' || term || '%');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_unaccent_name(search_term text)
 RETURNS SETOF public.signs
 LANGUAGE sql
 STABLE
AS $function$
  select * from signs
  where unaccent(name) ilike unaccent('%' || search_term || '%');
$function$
;

CREATE OR REPLACE FUNCTION public.set_unaccented_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.name_unaccented := unaccent_text(NEW.name);
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.unaccent_text(text_input text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  RETURN translate(
    text_input,
    'áàâãäåāăąǎǻÁÀÂÃÄÅĀĂĄǍǺéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭįıǐÍÌÎÏĨĪĬĮİǏóòôõöøōŏőǒǿÓÒÔÕÖØŌŎŐǑǾúùûüũūŭůűųǔǖǘǚǜÚÙÛÜŨŪŬŮŰŲǓǕǗǙǛýÿŷÝŸŶçćĉċčÇĆĈĊČñńņňÑŃŅŇ',
    'aaaaaaaaaaaAAAAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiiiIIIIIIIIIoooooooooooOOOOOOOOOOOuuuuuuuuuuuuuuuUUUUUUUUUUUUUUUyyyYYYcccccCCCCCnnnnnNNNN'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_types(types public.user_type[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare type user_type;
begin
delete from public.user_types
where true;
foreach type in array types loop
insert into public.user_types (slug, label, is_default)
values (type.slug, type.label, type.is_default);
end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_user_password(password text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ begin return exists (
		select id
		from auth.users
		where id = auth.uid()
			and encrypted_password = crypt(password::text, auth.users.encrypted_password)
	);
end;
$function$
;

CREATE TRIGGER protect_bucket_control_insert BEFORE INSERT ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.protect_bucket_control_columns('service_role');

CREATE TRIGGER protect_bucket_control_update BEFORE UPDATE OF lifecycle_configuration, lifecycle_configuration_generation ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.protect_bucket_control_columns();

CREATE TRIGGER protect_bucket_control_update_role AFTER UPDATE OF lifecycle_configuration, lifecycle_configuration_generation ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_lifecycle_service_role('service_role');


