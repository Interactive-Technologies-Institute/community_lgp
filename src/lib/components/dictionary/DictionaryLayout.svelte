<script lang="ts">
	import type { Parameter, Sign, Theme } from '@/types/types';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import DictionaryView from '@/components/dictionary/DictionaryView.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import SearchBar from './SearchBar.svelte';
	export let data;
	let signs: Sign[] = [];

	afterNavigate(() => {
		signs = data?.signs ?? [];
	});
	
	let parameters: Parameter[] = data.parameters;
	let themes: Theme[] = data.themes;
	let errorMessage = '';

	let totalPages = data.totalPages ?? 1;
	let perPage = data.perPage ?? 9;
	let countSign = data.countSign ?? 0;

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});
	const theme = queryParam('theme', arrayQueryParam());
	const district = queryParam('district', arrayQueryParam());
	const annotation = queryParam('annotation', arrayQueryParam());

	$: isFiltering =
		($search ?? '').trim().length > 0 ||
		($theme ?? []).length > 0 ||
		($district ?? []).length > 0 ||
		($annotation ?? []).length > 0;
	$: isSearching = $navigating !== null;
	$: $search = data.search || $search;
	$: $annotation = data.annotation || $annotation;
	$: totalPages = data.totalPages ?? Math.ceil(countSign / perPage);
	$: perPage = data.perPage ?? 9;
	$: countSign = data.countSign ?? 0;
	$: currentPageNumber = Math.min(
		Math.max(parseInt(data?.page ?? '') || 1, 1),
		Math.max(totalPages, 1)
	);
	$: compactPages = getCompactPages(currentPageNumber, totalPages);

	function buildUrlWithUpdatedPage(page: number): string {
		if (!browser) return '#'; // SSR-safe fallback
		const url = new URL(window.location.href);
		url.searchParams.set('page', String(page));
		return `${url.pathname}?${url.searchParams.toString()}`;
	}

	function goToPage(targetPage: number) {
		if (targetPage < 1 || targetPage > totalPages || targetPage === currentPageNumber) return;
		goto(buildUrlWithUpdatedPage(targetPage));
	}

	function goToPreviousPage() {
		goToPage(currentPageNumber - 1);
	}

	function goToNextPage() {
		goToPage(currentPageNumber + 1);
	}

	function getCompactPages(currentPage: number, pageCount: number) {
		if (pageCount <= 4) {
			return Array.from({ length: pageCount }, (_, index) => index + 1);
		}

		if (currentPage <= 2) {
			return [1, 2, 'ellipsis-end', pageCount];
		}

		if (currentPage >= pageCount - 1) {
			return [1, 'ellipsis-start', pageCount - 1, pageCount];
		}

		return [1, 'ellipsis-start', currentPage, 'ellipsis-end', pageCount];
	}
</script>

<div>
	<div
		class="container mx-auto flex flex-auto flex-col items-start justify-start overflow-x-auto pb-5"
	>
		<SearchBar
			{data}
			{signs}
			{parameters}
		/>
	</div>
	<div>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		<div class="pb-4">
			<DictionaryView
				{data}
				{signs}
				{themes}
				{parameters}
				{isFiltering}
				{isSearching}
			/>
		</div>
		{#if isFiltering && !isSearching && countSign > 0}
			<div class="flex items-start justify-start pb-5">
				<Pagination.Root count={countSign} {perPage} page={currentPageNumber} let:pages>
					<Pagination.Content class="flex items-center justify-center gap-1 sm:hidden">
						<Pagination.Item>
							<Pagination.PrevButton
								class="h-9 w-9 p-0"
								aria-label="Página anterior"
								on:click={goToPreviousPage}
								disabled={currentPageNumber === 1}
							>
								<ChevronLeft class="h-4 w-4" aria-hidden="true" />
							</Pagination.PrevButton>
						</Pagination.Item>

						{#each compactPages as compactPage, index (`${compactPage}-${index}`)}
							<Pagination.Item>
								{#if typeof compactPage === 'number'}
									<Button
										variant={currentPageNumber === compactPage ? 'outline' : 'ghost'}
										size="icon"
										class={currentPageNumber === compactPage
											? 'h-9 w-9 border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
											: 'h-9 w-9'}
										aria-label="Ir para a página {compactPage}"
										aria-current={currentPageNumber === compactPage ? 'page' : undefined}
										on:click={() => goToPage(compactPage)}
									>
										{compactPage}
									</Button>
								{:else}
									<Pagination.Ellipsis class="h-9 w-9" />
								{/if}
							</Pagination.Item>
						{/each}

						<Pagination.Item>
							<Pagination.NextButton
								class="h-9 w-9 p-0"
								aria-label="Página seguinte"
								on:click={goToNextPage}
								disabled={currentPageNumber === totalPages}
							>
								<ChevronRight class="h-4 w-4" aria-hidden="true" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>

					<Pagination.Content class="hidden items-center justify-center gap-2 sm:flex">
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
										on:click={() => goToPage(page.value)}
									>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}

						<Pagination.Item>
							<Pagination.NextButton
								on:click={goToNextPage}
								disabled={currentPageNumber === totalPages}
							>
								Próximo
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				</Pagination.Root>
			</div>
		{/if}
	</div>
</div>
