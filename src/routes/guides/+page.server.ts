import type { Guide } from '@/types/types';
import { arrayQueryParam, stringQueryParam } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const search = stringQueryParam().decode(event.url.searchParams.get('s'));
	const tags = arrayQueryParam().decode(event.url.searchParams.get('tags'));

	async function getGuides(): Promise<Guide[]> {
		let query = event.locals.supabase
			.from('guides_view')
			.select('*')
			.order('moderation_status', { ascending: true })
			.order('inserted_at', { ascending: false });

		if (search) {
			query = query.ilike('title', `%${search}%`);
		}

		if (tags && tags.length) {
			query = query.overlaps('tags', tags);
		}

		const { data: guides, error: guidesError } = await query;

		if (guidesError) {
			const errorMessage = 'Error fetching guides, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}
		return guides;
	}

	async function getTags(): Promise<Map<string, number>> {
		const { data: tags, error: tagsError } = await event.locals.supabase
			.from('guides_tags')
			.select();

		if (tagsError) {
			const errorMessage = 'Error fetching tags, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		const tagMap = new Map<string, number>();
		if (tags) {
			tags.forEach((tag) => {
				const { count, tag: tagName } = tag;
				if (count !== null && tagName !== null) {
					tagMap.set(tagName, count);
				}
			});
		}

		return tagMap;
	}

	return {
		guides: await getGuides(),
		tags: await getTags(),
	};
};
