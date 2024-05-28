insert into public.role_permissions (role, permission)
values ('user', 'howtos.create'),
	('user', 'howtos.update'),
	('user', 'howtos.delete'),
	('user', 'events.create'),
	('user', 'events.update'),
	('user', 'events.delete'),
	('user', 'map.create'),
	('user', 'map.update'),
	('user', 'map.delete'),
	('moderator', 'howtos.create'),
	('moderator', 'howtos.update'),
	('moderator', 'howtos.delete'),
	('moderator', 'howtos.moderate'),
	('moderator', 'events.create'),
	('moderator', 'events.update'),
	('moderator', 'events.delete'),
	('moderator', 'events.moderate'),
	('moderator', 'map.create'),
	('moderator', 'map.update'),
	('moderator', 'map.delete'),
	('moderator', 'map.moderate'),
	('admin', 'howtos.create'),
	('admin', 'howtos.update'),
	('admin', 'howtos.delete'),
	('admin', 'howtos.moderate'),
	('admin', 'events.create'),
	('admin', 'events.update'),
	('admin', 'events.delete'),
	('admin', 'events.moderate'),
	('admin', 'map.create'),
	('admin', 'map.update'),
	('admin', 'map.delete'),
	('admin', 'map.moderate'),
	('admin', 'features.update'),
	('admin', 'branding.update');
insert into public.feature_flags (id, enabled)
values ('howtos'::public.feature, true),
	('events'::public.feature, true),
	('map'::public.feature, true),
	('academy'::public.feature, true);
insert into public.user_types (slug, label, is_default)
values ('morador', 'Morador', true),
	('tecnico', 'Técnico', false),
	('multiplicador', 'Multiplicador', false),
	('parceiro', 'Parceiro', false);
insert into public.branding (name, slogan, color_theme, radius)
values (
		'Community',
		'A community for everyone',
		'neutral',
		0.5
	);