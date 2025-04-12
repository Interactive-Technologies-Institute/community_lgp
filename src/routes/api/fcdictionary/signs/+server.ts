// src/routes/api/signs.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
    const search = url.searchParams.get("search");

    let query = locals.supabase.from("signs")
    .select("*")
    .ilike('theme_flattened', '%1ºceb%')
    .eq("is_anotated", "2");

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase query error:", error);
        return new Response(JSON.stringify({ error: "Error fetching signs" }), { status: 500 });
    }

    return new Response(JSON.stringify({ signs: data }), { status: 200 });
}
