-- ALTER TYPE ... ADD VALUE cannot be used in the same transaction as later
-- statements that reference the new value, so this is kept as its own migration.
alter type public.user_role add value if not exists 'contributor';
