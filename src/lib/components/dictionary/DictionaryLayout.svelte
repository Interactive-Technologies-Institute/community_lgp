<script lang="ts">
	import type { Parameter, Sign } from '@/types/types';
	import { Input } from '@/components/ui/input';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import DictionaryView from '@/components/dictionary/DictionaryView.svelte';
	import SignSearch from '../../../routes/dictionary/_components/SignSearch.svelte';
	import * as Pagination from "$lib/components/ui/pagination";
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { PlusCircle } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	export let data;
	let signs: Sign[] = [];
	
	afterNavigate(() => {
	signs = data?.signs ?? [];
	});

	
	let allThemes = data?.themes ? Array.from(data.themes.keys()) as string[] : [];
	const desiredThemes = [
		"(1ºCEB) PORTUGUÊS",
		"1ºCEB-ESTUDO DO MEIO",
		"(1ºCEB) MATEMÁTICA"
	];
	let initialThemes = allThemes.filter(theme => desiredThemes.includes(theme));
	let parameters: Parameter[] = data.parameters;
	let isLoading = false;
	let errorMessage = '';

	let totalPages = data.totalPages ?? 1;
	let perPage = data.perPage ?? 10;
	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});

	let countSign = data.countSign ?? 0;
	const theme = queryParam('theme', arrayQueryParam());

	const page = queryParam('page', stringQueryParam(), {
		debounceHistory: 250,
	});

	$: isFiltering = ($search ?? '').trim().length > 0 || ($theme ?? []).length > 0;
	$: $search = data.search || $search; 
	$: currentPageNumber = parseInt(data?.page ?? '') || 1;
	
	function buildUrlWithUpdatedPage(page: number): string {
		if (!browser) return '#'; // SSR-safe fallback
		const url = new URL(window.location.href);
		url.searchParams.set('page', String(page));
		return `${url.pathname}?${url.searchParams.toString()}`;
	}

	function goToPreviousPage() {
 	 	if (currentPageNumber > 1) {
    		location.href = buildUrlWithUpdatedPage(currentPageNumber - 1);
  		}
	}

	function goToNextPage() {
		if(currentPageNumber < totalPages) {
			location.href = buildUrlWithUpdatedPage(currentPageNumber + 1);
		}
	}
</script>

<div>
	<div class="container mx-auto flex flex-row justify-between gap-x-2 py-5">
		<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
			<Input placeholder="Procura por texto..." class="flex-1 sm:max-w-64" bind:value={$search}></Input>
			<SignSearch
				{parameters}
				{signs}
				on:updateSigns={(e) => {signs = e.detail; console.log('Updated signs:', signs)}}
			/>
            <TagFilterButton tags={data.themes} bind:filterValues={$theme} />
		</div>
		
		

	</div>

	{#if isLoading}
		<p class="loading">Loading...</p>
	{/if}
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	<DictionaryView {signs} themes={isFiltering ? allThemes : initialThemes} />
	
	<div class ="flex justify-start items-start pb-5">
		<Pagination.Root count={countSign} {perPage} let:pages let:currentPage>
			<Pagination.Content class="flex justify-center items-center gap-2">
			  
			  <Pagination.Item>
				<Pagination.PrevButton on:click={goToPreviousPage} disabled={currentPageNumber === 1}>
				  Anterior
				</Pagination.PrevButton>
			  </Pagination.Item>
		  
			  {#each pages as page (page.key)}
				{#if page.type === "ellipsis"}
				  <Pagination.Item>
					<Pagination.Ellipsis />
				  </Pagination.Item>
				{:else}
				  <Pagination.Item>
					<Pagination.Link {page} isActive={currentPageNumber == page.value}>
						<a href="{buildUrlWithUpdatedPage(page.value)}" data-sveltekit-reload>
							{page.value}
						</a>
					</Pagination.Link>
				  </Pagination.Item>
				{/if}
			  {/each}
		  
			  <Pagination.Item>
				<Pagination.NextButton on:click={goToNextPage} disabled={parseInt($page ?? '1') === totalPages}>
				  Próximo
				</Pagination.NextButton>
			  </Pagination.Item>
		  
			</Pagination.Content>
		  </Pagination.Root>
</div>
</div>