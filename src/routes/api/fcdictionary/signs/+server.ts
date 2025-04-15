import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
	const search = url.searchParams.get('search')?.trim() || null;

	let query = locals.supabase.from("signs")
    .select("*")
    .ilike('theme_flattened', '%1ºceb%')
    .eq("is_anotated", "2");

	if (search) {
		query = query.ilike('name', `%${search}%`);
	}

	const { data: signs, error } = await query;

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

  
	return json({ signs });
}
