import type { CSProposal } from '@/types/types';
import { stringQueryParam } from '@/utils';
import { error } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async (event) => {
	const page = Number(event.url.searchParams.get('page')) || 1;
	const perPage = 9;
	const search = stringQueryParam().decode(event.url.searchParams.get('s')) ?? '';
	let totalPages = 0;

	async function getProposals(): Promise<CSProposal[]> {
		let query = event.locals.supabase
			.from('crowdsource_proposals')
			.select('*', { count: 'exact' })
			.range((page - 1) * perPage, page * perPage - 1);

		if (search) {
			query = query.ilike('name', `%${search}%`);
		}

		const { data: proposals, count, error: proposalsError } = await query;
		totalPages = count ? Math.ceil(count / perPage) : 0;

		if (proposalsError) {
			const errorMessage = 'Error fetching crowdsource proposals, please try again later.';
			setFlash({ type: 'error', message: errorMessage }, event.cookies);
			return error(500, errorMessage);
		}

		return proposals as CSProposal[];
	}
};
