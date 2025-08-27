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

	import * as Card from '$lib/components/ui/card';

	const dispatch = createEventDispatcher();

	const theme = queryParam('theme', arrayQueryParam());

	let isFiltering = false;
	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});
	let countSign;

	let localSearch = $search; // Initialize localSearch with current query param value
	let selectedTab = 'gesto';

	// Update query param on button click
	function doSearch() {
		search.set(localSearch);
	}
</script>

<div class="overflow-x-auto">
	<Card.Root class="border-background drop-shadow-xl">
		<div class="md-rounded-2xl flex flex-auto flex-row">
			<Tabs.Root value="gesto">
				<Tabs.List class="md-rounded-2xl drop-shadow-xl">
					<Tabs.Trigger
						class={`md-rounded-2xl transition duration-300 ${
							selectedTab !== 'gesto' ? 'opacity-25 grayscale' : ''
						}`}
						value="gesto"
						on:click={() => (selectedTab = 'gesto')}
					>
						<Hand />&nbsp;Gesto
					</Tabs.Trigger>

					<Tabs.Trigger
						class={`md-rounded-2xl transition duration-300 ${
							selectedTab !== 'texto' ? 'opacity-40 grayscale' : ''
						}`}
						value="texto"
						on:click={() => (selectedTab = 'texto')}
					>
						<TextCursor /> &nbsp;Texto
					</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>

			{#if selectedTab === 'gesto'}
				<div class="ml-1 flex flex-row">
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
						on:updateCountSign={(e) => {
							countSign = e.detail;
							dispatch('updateCountSign', e.detail);
						}}
					/>
				</div>
			{/if}
			{#if selectedTab === 'texto'}
				<div class="ml-1 flex flex-row">
					<Input
						placeholder="Escreva uma palavra..."
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
				</div>
			{/if}
			<TagFilterButton tags={data.themes} bind:filterValues={$theme} />
		</div>
	</Card.Root>
</div>
