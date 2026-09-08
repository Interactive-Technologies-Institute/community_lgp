-- Convert each existing dictionary label into a one-element array without
-- changing or discarding any values. NULL remains NULL.
alter table public.signs
  alter column dictionary type text[]
  using case
    when dictionary is null then null
    else array[dictionary]
  end;

-- Supports containment filters such as dictionary @> ARRAY['Geral'].
create index signs_dictionary_idx
  on public.signs
  using gin (dictionary);

-- Update get closest signs function to support the new dictionary column type.
CREATE OR REPLACE FUNCTION public.get_closest_signs(query_array bigint[], limit_count integer, offset_count integer)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, name text, video text, annotation jsonb, theme text[], is_anotated bigint, last_changed timestamp with time zone, description text, annotation_array bigint[], context_video text, sentence text, frequency bigint, theme_flattened text, district text)
 LANGUAGE plpgsql
 SET statement_timeout TO '10s'
AS $function$
BEGIN

  RETURN QUERY
  WITH scored_signs AS (
    SELECT 
      s.id,
      s.created_at,
      s.name,
      s.video,
      s.annotation,
      s.theme,
      s.is_anotated,
      s.last_changed,
      s.description,
      s.annotation_array,
      s.context_video,
      s.sentence,
      s.frequency,
      s.theme_flattened,
      s.district,
      s.dictionary,
      score_calc.score
    FROM signs s
    CROSS JOIN LATERAL (
      SELECT COALESCE(SUM(
        CASE
          WHEN s.annotation_array[qi] = 1 THEN
            5 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          WHEN EXISTS (
            SELECT 1
            FROM generate_subscripts(s.annotation_array, 1) AS si
            JOIN parameters sp ON sp.id = si
            WHERE s.annotation_array[si] = 1
              AND qp.parent IS NOT NULL
              AND qp.parent <> ''
              AND sp.parent = qp.parent
              AND sp.code <> qp.code
          ) THEN
            3 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          WHEN EXISTS (
            SELECT 1
            FROM generate_subscripts(s.annotation_array, 1) AS si
            JOIN parameters sp ON sp.id = si
            WHERE s.annotation_array[si] = 1
              AND sp.code = qp.parent
          ) THEN
            3 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          WHEN EXISTS (
            SELECT 1
            FROM generate_subscripts(s.annotation_array, 1) AS si
            JOIN parameters sp ON sp.id = si
            WHERE s.annotation_array[si] = 1
              AND sp.code = ANY(qp.children)
          ) THEN
            3 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          ELSE 0
        END
      ), 0) AS score
      FROM generate_subscripts(query_array, 1) AS qi
      JOIN parameters qp ON qp.id = qi
      WHERE query_array[qi] = 1
    ) score_calc
    WHERE CAST(s.is_anotated AS INTEGER) = 2
      AND s.dictionary @> ARRAY['Geral']::text[]
  )

  SELECT
    ss.id,
    ss.created_at,
    ss.name,
    ss.video,
    ss.annotation,
    ss.theme,
    ss.is_anotated,
    ss.last_changed,
    ss.description,
    ss.annotation_array,
    ss.context_video,
    ss.sentence,
    ss.frequency,
    ss.theme_flattened,
    ss.district
  FROM scored_signs ss
  WHERE ss.score > 0
  ORDER BY ss.score DESC, ss.name ASC;

END;
$function$;

CREATE OR REPLACE FUNCTION public.get_closest_signs_fc(query_array bigint[], limit_count integer, offset_count integer)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, name text, video text, annotation jsonb, theme text[], is_anotated bigint, last_changed timestamp with time zone, description text, annotation_array bigint[], context_video text, sentence text, frequency bigint, theme_flattened text, district text)
 LANGUAGE plpgsql
 SET statement_timeout TO '10s'
AS $function$
BEGIN

  RETURN QUERY
  WITH scored_signs AS (
    SELECT 
      s.id,
      s.created_at,
      s.name,
      s.video,
      s.annotation,
      s.theme,
      s.is_anotated,
      s.last_changed,
      s.description,
      s.annotation_array,
      s.context_video,
      s.sentence,
      s.frequency,
      s.theme_flattened,
      s.district,
      s.dictionary,
      score_calc.score
    FROM signs s
    CROSS JOIN LATERAL (
      SELECT COALESCE(SUM(
        CASE
          WHEN s.annotation_array[qi] = 1 THEN
            5 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          WHEN EXISTS (
            SELECT 1
            FROM generate_subscripts(s.annotation_array, 1) AS si
            JOIN parameters sp ON sp.id = si
            WHERE s.annotation_array[si] = 1
              AND qp.parent IS NOT NULL
              AND qp.parent <> ''
              AND sp.parent = qp.parent
              AND sp.code <> qp.code
          ) THEN
            3 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          WHEN EXISTS (
            SELECT 1
            FROM generate_subscripts(s.annotation_array, 1) AS si
            JOIN parameters sp ON sp.id = si
            WHERE s.annotation_array[si] = 1
              AND sp.code = qp.parent
          ) THEN
            3 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          WHEN EXISTS (
            SELECT 1
            FROM generate_subscripts(s.annotation_array, 1) AS si
            JOIN parameters sp ON sp.id = si
            WHERE s.annotation_array[si] = 1
              AND sp.code = ANY(qp.children)
          ) THEN
            3 *
            CASE qp.tipo
              WHEN 'configuracao' THEN 100
              WHEN 'localizacao' THEN 90
              WHEN 'movimento' THEN 80
              WHEN 'orientacao' THEN 70
              WHEN 'expressao facial' THEN 60
              ELSE 0
            END

          ELSE 0
        END
      ), 0) AS score
      FROM generate_subscripts(query_array, 1) AS qi
      JOIN parameters qp ON qp.id = qi
      WHERE query_array[qi] = 1
    ) score_calc
    WHERE CAST(s.is_anotated AS INTEGER) = 2
      AND s.dictionary @> ARRAY['1º CEB']::text[]
  )

  SELECT
    ss.id,
    ss.created_at,
    ss.name,
    ss.video,
    ss.annotation,
    ss.theme,
    ss.is_anotated,
    ss.last_changed,
    ss.description,
    ss.annotation_array,
    ss.context_video,
    ss.sentence,
    ss.frequency,
    ss.theme_flattened,
    ss.district
  FROM scored_signs ss
  WHERE ss.score > 0
  ORDER BY ss.score DESC, ss.name ASC;

END;
$function$;