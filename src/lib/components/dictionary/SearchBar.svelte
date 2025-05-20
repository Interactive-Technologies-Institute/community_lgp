<script lang="ts">
	import type { Parameter, Sign } from '@/types/types';
	export let data;
	export let signs: Sign[];
	export let parameters;
	import { Input } from '@/components/ui/input';
	import Button from '../ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import SignSearch from './SignSearch.svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import { createEventDispatcher } from 'svelte';

	import { Hand } from 'lucide-svelte';
	import { TextCursor } from 'lucide-svelte';
	import { Search } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	const theme = queryParam('theme', arrayQueryParam());

	let isFiltering = false;
	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});

	let localSearch = $search; // Initialize localSearch with current query param value
	let selectedTab = 'gesto';

	// Update query param on button click
	function doSearch() {
		search.set(localSearch);
	}
</script>

<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
	<Tabs.Root value="gesto">
		<Tabs.List>
			<Tabs.Trigger value="gesto" on:click={() => (selectedTab = 'gesto')}>
				<Hand />&nbsp;Gesto
			</Tabs.Trigger>
			<Tabs.Trigger value="texto" on:click={() => (selectedTab = 'texto')}>
				<TextCursor /> &nbsp;Texto
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	{#if selectedTab === 'gesto'}
		<SignSearch
			{parameters}
			{signs}
			on:updateSigns={(e) => {
				signs = e.detail;
				dispatch('updateSigns', e.detail);
			}}
			on:updateIsFiltering={(e) => {
				isFiltering = e.detail;
				dispatch('updateIsFiltering', e.detail);
			}}
		/>
	{/if}
	{#if selectedTab === 'texto'}
		<div class="flex flex-row gap-x-3">
			<Input
				placeholder="Escreva uma palavra..."
				class="w-[564px] flex-1"
				bind:value={localSearch}
				on:keydown={(e) => {
					if (e.key === 'Enter') doSearch();
				}}
			/>
			<Button on:click={doSearch} class="btn btn-primary">
				<Search />
			</Button>
		</div>
	{/if}
	<TagFilterButton tags={data.themes} bind:filterValues={$theme} />
</div>
