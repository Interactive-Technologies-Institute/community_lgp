create or replace function public.sync_theme_children_names()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  if tg_op <> 'INSERT' and old.is_parent is not true and old.parent is not null then
    update public.themes as parent_theme
    set children = (
      select array_agg(child_theme.name order by child_theme.name)
      from public.themes as child_theme
      where child_theme.is_parent is not true
        and child_theme.name is not null
        and child_theme.parent = old.parent
        and child_theme.dictionary is not distinct from old.dictionary
    )
    where parent_theme.is_parent is true
      and parent_theme.name = old.parent
      and parent_theme.dictionary is not distinct from old.dictionary;
  end if;

  if tg_op <> 'DELETE' and new.is_parent is not true and new.parent is not null then
    update public.themes as parent_theme
    set children = (
      select array_agg(child_theme.name order by child_theme.name)
      from public.themes as child_theme
      where child_theme.is_parent is not true
        and child_theme.name is not null
        and child_theme.parent = new.parent
        and child_theme.dictionary is not distinct from new.dictionary
    )
    where parent_theme.is_parent is true
      and parent_theme.name = new.parent
      and parent_theme.dictionary is not distinct from new.dictionary;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$function$;

drop trigger if exists sync_theme_children_names on public.themes;

create trigger sync_theme_children_names
after insert or update or delete on public.themes
for each row
execute function public.sync_theme_children_names();