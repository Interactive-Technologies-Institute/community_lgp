do $$
declare r record;
begin for r in (
	select tablename
	from pg_tables
	where schemaname = 'public'
) loop execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
end loop;
end $$;
do $$
declare r record;
begin for r in (
	select *
	from pg_type
	where typnamespace = 'public'::regnamespace
		and typbyval
) loop execute 'drop type if exists ' || quote_ident(r.typname) || ' cascade';
end loop;
end $$;
do $$
declare r record;
begin for r in (
	select proname
	from pg_proc
	where pronamespace = 'public'::regnamespace
) loop execute 'drop function if exists ' || quote_ident(r.proname) || ' cascade';
end loop;
end $$;
