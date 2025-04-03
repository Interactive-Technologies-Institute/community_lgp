create table "public"."parameters" (
    "id" bigint not null,
    "tipo" character varying,
    "code" character varying,
    "name" text,
    "is_parent" boolean,
    "children" character varying[],
    "parent" character varying,
    "image" text
);


alter table "public"."parameters" enable row level security;

create table "public"."signs" (
    "id" bigint not null,
    "created_at" timestamp with time zone,
    "name" text,
    "anotated" text,
    "selected" text,
    "video" text,
    "annotation" jsonb,
    "theme" jsonb,
    "is_anotated" bigint,
    "last_changed" timestamp with time zone,
    "written_anotation" jsonb,
    "annotation_array" bigint[]
);


alter table "public"."signs" enable row level security;

CREATE UNIQUE INDEX parameters_pkey ON public.parameters USING btree (id);

CREATE UNIQUE INDEX signs_pkey ON public.signs USING btree (id);

alter table "public"."parameters" add constraint "parameters_pkey" PRIMARY KEY using index "parameters_pkey";

alter table "public"."signs" add constraint "signs_pkey" PRIMARY KEY using index "signs_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_closest_signs(query_array bigint[])
 RETURNS TABLE(id bigint, name text, is_anotated integer, distance integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- First, return the exact match (if any)
  RETURN QUERY
  SELECT 
    signs.id,  
    signs.name,  
    CAST(signs.is_anotated AS INTEGER) AS is_anotated,
    0 AS distance  -- Exact match should have a distance of 0
  FROM signs
  WHERE signs.annotation_array = query_array  -- Direct array comparison
    AND CAST(signs.is_anotated AS INTEGER) >= 2
  LIMIT 10;  -- Return only 1 exact match if found

  -- Return the closest matches based on Hamming distance (if no exact match found)
  RETURN QUERY
  SELECT 
    signs.id,  
    signs.name,  
    CAST(signs.is_anotated AS INTEGER) AS is_anotated,  
    hamming_distance(
      signs.annotation_array, 
      query_array
    ) AS distance
  FROM signs
  WHERE CAST(signs.is_anotated AS INTEGER) = 2  
    AND signs.annotation_array != query_array  -- Exclude exact matches
  ORDER BY distance  
  LIMIT 10;  
END;
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

grant delete on table "public"."parameters" to "anon";

grant insert on table "public"."parameters" to "anon";

grant references on table "public"."parameters" to "anon";

grant select on table "public"."parameters" to "anon";

grant trigger on table "public"."parameters" to "anon";

grant truncate on table "public"."parameters" to "anon";

grant update on table "public"."parameters" to "anon";

grant delete on table "public"."parameters" to "authenticated";

grant insert on table "public"."parameters" to "authenticated";

grant references on table "public"."parameters" to "authenticated";

grant select on table "public"."parameters" to "authenticated";

grant trigger on table "public"."parameters" to "authenticated";

grant truncate on table "public"."parameters" to "authenticated";

grant update on table "public"."parameters" to "authenticated";

grant delete on table "public"."parameters" to "service_role";

grant insert on table "public"."parameters" to "service_role";

grant references on table "public"."parameters" to "service_role";

grant select on table "public"."parameters" to "service_role";

grant trigger on table "public"."parameters" to "service_role";

grant truncate on table "public"."parameters" to "service_role";

grant update on table "public"."parameters" to "service_role";

grant delete on table "public"."signs" to "anon";

grant insert on table "public"."signs" to "anon";

grant references on table "public"."signs" to "anon";

grant select on table "public"."signs" to "anon";

grant trigger on table "public"."signs" to "anon";

grant truncate on table "public"."signs" to "anon";

grant update on table "public"."signs" to "anon";

grant delete on table "public"."signs" to "authenticated";

grant insert on table "public"."signs" to "authenticated";

grant references on table "public"."signs" to "authenticated";

grant select on table "public"."signs" to "authenticated";

grant trigger on table "public"."signs" to "authenticated";

grant truncate on table "public"."signs" to "authenticated";

grant update on table "public"."signs" to "authenticated";

grant delete on table "public"."signs" to "service_role";

grant insert on table "public"."signs" to "service_role";

grant references on table "public"."signs" to "service_role";

grant select on table "public"."signs" to "service_role";

grant trigger on table "public"."signs" to "service_role";

grant truncate on table "public"."signs" to "service_role";

grant update on table "public"."signs" to "service_role";

create policy "Enable read access for all users"
on "public"."parameters"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."signs"
as permissive
for select
to public
using (true);



