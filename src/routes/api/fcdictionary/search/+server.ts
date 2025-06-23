import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { searchArray, limit, offset } = await request.json();

		// Call the `getSignsBySearch` function with the `searchArray`
		const { data: signs, error: signsError } = await locals.supabase.rpc('get_closest_signs_fc', {
			query_array: searchArray,
			limit_count: limit,
			offset_count: offset,
		});

		if (signsError) {
			return new Response(
				JSON.stringify({ error: `Error fetching signs: ${signsError.message}` }),
				{
					status: 500,
				}
			);
		}

		return new Response(JSON.stringify({ signs }), { status: 200 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Failed to fetch signs' }), { status: 500 });
	}
};
