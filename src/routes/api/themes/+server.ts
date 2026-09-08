import { createThemeSchema } from '@/schemas/theme';
import { json } from '@sveltejs/kit';

const createThemeRequestSchema = createThemeSchema.pick({
	dictionary: true,
	name: true,
	parent: true,
});

export async function POST(event) {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return json({ message: 'Utilizador não autenticado.' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await event.request.json();
	} catch {
		return json({ message: 'Pedido inválido.' }, { status: 400 });
	}
	const parsed = createThemeRequestSchema.safeParse(body);
	if (!parsed.success) {
		return json({ message: 'Preencha o dicionário e o tema.' }, { status: 400 });
	}

	let dictionary = parsed.data.dictionary;
	let parent: string | null = null;
	let isParent = true;

	if (parsed.data.parent !== null) {
		const { data: parentTheme, error: parentError } = await event.locals.supabase
			.from('themes')
			.select('*')
			.eq('dictionary', dictionary)
			.eq('name', parsed.data.parent)
			.eq('is_parent', true)
			.single();

		if (
			parentError ||
			!parentTheme ||
			!parentTheme.is_parent ||
			!parentTheme.dictionary ||
			!parentTheme.name
		) {
			return json(
				{ message: 'O tema principal selecionado já não está disponível.' },
				{ status: 400 }
			);
		}

		dictionary = parentTheme.dictionary;
		parent = parentTheme.name;
		isParent = false;
	}

	const { data: candidates, error: lookupError } = await event.locals.supabase
		.from('themes')
		.select('*')
		.eq('dictionary', dictionary)
		.ilike('name', parsed.data.name);

	if (lookupError) {
		return json({ message: lookupError.message }, { status: 500 });
	}

	const duplicate = candidates?.find((theme) => {
		if (isParent) return theme.is_parent === true;
		return !theme.is_parent && theme.parent === parent;
	});

	if (duplicate) {
		return json({ theme: duplicate });
	}

	const { data: theme, error: insertError } = await event.locals.supabase
		.from('themes')
		.insert({
			dictionary,
			name: parsed.data.name,
			is_parent: isParent,
			parent,
			children: null,
		})
		.select('*')
		.single();

	if (insertError || !theme) {
		return json(
			{ message: insertError?.message ?? 'Não foi possível criar o tema.' },
			{ status: 500 }
		);
	}

	let updatedParentTheme = null;
	if (parent) {
		const { data: parentTheme } = await event.locals.supabase
			.from('themes')
			.select('*')
			.eq('dictionary', dictionary)
			.eq('name', parent)
			.eq('is_parent', true)
			.single();
		updatedParentTheme = parentTheme;
	}

	return json({ theme, parentTheme: updatedParentTheme }, { status: 201 });
}
