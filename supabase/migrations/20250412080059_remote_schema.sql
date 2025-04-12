alter table "public"."signs" add column "context_video" text;

alter table "public"."signs" add column "description" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_closest_signs(query_array bigint[])
 RETURNS TABLE(id bigint, name text, video text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- First, return the exact match (if any)
  RETURN QUERY
  SELECT 
    signs.id,  
    signs.name,  
    signs.video  -- Return video instead of is_anotated and distance
  FROM signs
  WHERE signs.annotation_array = query_array  -- Direct array comparison
    AND CAST(signs.is_anotated AS INTEGER) >= 2
  LIMIT 20;  -- Return only 1 exact match if found

  -- Return the closest matches based on Hamming distance (if no exact match found)
  RETURN QUERY
  SELECT 
    signs.id,  
    signs.name,  
    signs.video  -- Return video instead of is_anotated and distance
  FROM signs
  WHERE CAST(signs.is_anotated AS INTEGER) = 2  
    AND signs.annotation_array != query_array  -- Exclude exact matches
  ORDER BY hamming_distance(signs.annotation_array, query_array)  
  LIMIT 20;  
END;
$function$
;


