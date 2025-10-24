<script lang="ts">
	import type { Parameter, Sign } from '@/types/types';
	import { Input } from '@/components/ui/input';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import DictionaryView from '@/components/dictionary/DictionaryView.svelte';
	import SignSearch from './SignSearch.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';
	import { PlusCircle } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import SearchBar from './SearchBar.svelte';
	export let data;
	let signs: Sign[] = [];

	afterNavigate(() => {
		signs = data?.signs ?? [];
	});

	let allThemes = data?.themes ? (Array.from(data.themes.keys()) as string[]) : [];
	const desiredThemes = ['(1ºCEB) PORTUGUÊS', '1ºCEB-ESTUDO DO MEIO', '(1ºCEB) MATEMÁTICA'];
	let initialThemes = allThemes.filter((theme) => desiredThemes.includes(theme));
	let parameters: Parameter[] = data.parameters;
	let isLoading = false;
	let errorMessage = '';

	let totalPages = data.totalPages ?? 1;
	let perPage = data.perPage ?? 9;
	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});

	let countSign = data.countSign ?? 0;
	const theme = queryParam('theme', arrayQueryParam());

	const annotation = queryParam('annotation', arrayQueryParam());

	const page = queryParam('page', stringQueryParam(), {
		debounceHistory: 250,
	});

	$: isFiltering =
		($search ?? '').trim().length > 0 ||
		($theme ?? []).length > 0 ||
		($annotation ?? []).length > 0;
	$: $search = data.search || $search;
	$: $annotation = data.annotation || $annotation;
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
</script>

<div>
	<div
		class="container mx-auto flex flex-auto flex-row items-center justify-center overflow-x-auto py-5"
	>
		<SearchBar
			{data}
			{signs}
			{parameters}
			on:updateSigns={(e) => {
				signs = e.detail;
			}}
			on:updateIsFiltering={(e) => {
				isFiltering = e.detail;
			}}
			on:updateCountSign={(e) => {
				countSign = e.detail;
			}}
		/>
	</div>
	<div>
		{#if isLoading}
			<p class="loading">Loading...</p>
		{/if}
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		<div class="pb-4">
			<DictionaryView
				{data}
				{signs}
				themes={isFiltering ? allThemes : initialThemes}
				{parameters}
				{isFiltering}
			/>
		</div>
		{#if isFiltering && countSign > 0}
			<div class="flex items-start justify-start pb-5">
				<Pagination.Root count={countSign} {perPage} let:pages let:currentPage>
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
	</div>
</div>
