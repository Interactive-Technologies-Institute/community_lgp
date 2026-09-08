create or replace view public.signs_dictionaries
with (security_invoker = true)
as
select
  trim(both from dictionaries_split.dictionary) as dictionary,
  count(distinct signs.id) as count
from public.signs
cross join lateral unnest(signs.dictionary) as dictionaries_split(dictionary)
where nullif(trim(both from dictionaries_split.dictionary), '') is not null
group by trim(both from dictionaries_split.dictionary)
order by count desc, dictionary asc;
