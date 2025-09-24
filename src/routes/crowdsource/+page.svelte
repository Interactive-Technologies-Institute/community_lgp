<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { Input } from '@/components/ui/input';
	import Button from '@/components/ui/button/button.svelte';
	import CrowdsourceGrid from './_components/CrowdsourceGrid.svelte';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';
	import * as Pagination from '$lib/components/ui/pagination';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { PlusCircle, Search } from 'lucide-svelte';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import SortButton from '@/components/sort-button.svelte';
	export let data;
	const sortBy = queryParam('sortBy', stringQueryParam());
	const sortOrder = queryParam('sortOrder', stringQueryParam());

	let totalPages = data.totalPages ?? 1;
	let perPage = data.perPage ?? 9;
	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});

	let countSign = data.countSign ?? 0;
	const theme = queryParam('theme', arrayQueryParam());

	$: $search = data.search || $search;
	$: currentPageNumber = parseInt(data?.page ?? '') || 1;
	$: countSign = data.countSign ?? 0;

	function buildUrlWithUpdatedPage(page: number): string {
		if (!browser) return '#'; // SSR-safe fallback
		const url = new URL(window.location.href);
		url.searchParams.set('page', String(page));
		return `${url.pathname}?${url.searchParams.toString()}`;
	}

	function goToPreviousPage() {
		if (currentPageNumber > 1) {
			const newUrl = buildUrlWithUpdatedPage(currentPageNumber - 1);
			goto(newUrl);
		}
	}

	function goToNextPage() {
		if (currentPageNumber < totalPages) {
			const newUrl = buildUrlWithUpdatedPage(currentPageNumber + 1);
			goto(newUrl);
		}
	}

	let localSearch = $search;

	function doSearch() {
		search.set(localSearch);
	}
</script>

<MetaTags
	title="Participação em Comunidade"
	description="Proponha uma nova entrada de gesto, consulte as propostas que estão a decorrer e participe na deliberação
de novos termos."
/>

<PageHeader
	title="Participação em Comunidade"
	subtitle="Proponha uma nova entrada de gesto, consulte as propostas que estão a decorrer e participe na deliberação
de novos termos."
/>

<div class="flex px-72 py-5">
	<Input
		placeholder="Procure uma entrada de gesto..."
		class="w-[680px] flex-1 "
		bind:value={localSearch}
		on:keydown={(e) => {
			if (e.key === 'Enter') doSearch();
		}}
	/>
	<div class="px-2">
		<Button on:click={doSearch} class="btn btn-primary">
			<Search />
		</Button>
	</div>
	<div class="flex gap-x-2">
		<TagFilterButton tags={data.themes} bind:filterValues={$theme} />
		<SortButton bind:sortBy={$sortBy} bind:sortOrder={$sortOrder} />
	</div>
	<div class="ml-48 flex">
		<Button on:click={() => goto('dictionary/sign/create')}>
			<PlusCircle class="h-4 w-4 sm:mr-2" /> Propor Gesto
		</Button>
	</div>
</div>
<div class="flex items-center justify-center px-72 py-5">
	<CrowdsourceGrid signs={data.signs} />
</div>

{#if countSign > 0}
	<div class="flex items-start justify-start py-5">
		<Pagination.Root count={countSign} {perPage} let:pages>
			<Pagination.Content class="flex items-center justify-center gap-2">
				<Pagination.Item>
					<Pagination.PrevButton on:click={goToPreviousPage} disabled={currentPageNumber === 1}>
						Anterior
					</Pagination.PrevButton>
				</Pagination.Item>

				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link
								{page}
								isActive={currentPageNumber == page.value}
								class={`${currentPageNumber === page.value ? ' rounded-lg border-primary bg-primary px-3 py-5' : ''}`}
							>
								<a href={buildUrlWithUpdatedPage(page.value)}>
									{page.value}
								</a>
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}

				<Pagination.Item>
					<Pagination.NextButton
						on:click={goToNextPage}
						disabled={currentPageNumber === Math.ceil(countSign / perPage)}
					>
						Próximo
					</Pagination.NextButton>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	</div>
{/if}
