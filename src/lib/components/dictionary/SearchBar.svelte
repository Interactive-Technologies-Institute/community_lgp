<script lang="ts">
	import type { Parameter, Sign } from '@/types/types';
	export let data;
	export let signs: Sign[];
	export let parameters;
	import * as Tabs from '$lib/components/ui/tabs';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import SignSearch from './SignSearch.svelte';
	import TextSearch from './TextSearch.svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import { goto } from '$app/navigation';

	import { Hand } from 'lucide-svelte';
	import { TextCursor } from 'lucide-svelte';

	import * as Card from '$lib/components/ui/card';

	const theme = queryParam('theme', arrayQueryParam());
	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});

	let localSearch = $search; // Initialize localSearch with current query param value
	let selectedTab = 'gesto';

	function buildUrlForMode(mode: 'gesto' | 'texto') {
		const url = new URL(window.location.href);
		const themes = Array.isArray($theme) ? $theme : [];

		url.searchParams.delete('s');
		url.searchParams.delete('annotation');
		url.searchParams.delete('page');
		url.searchParams.delete('theme');

		for (const themeValue of themes) {
			url.searchParams.append('theme', themeValue);
		}

		url.searchParams.set('page', '1');

		if (mode === 'texto') {
			localSearch = '';
		}

		return `${url.pathname}?${url.searchParams.toString()}`;
	}

	async function switchTab(mode: 'gesto' | 'texto') {
		if (selectedTab === mode) return;

		selectedTab = mode;
		localSearch = '';
		await goto(buildUrlForMode(mode), {
			replaceState: true,
			noScroll: true,
			keepFocus: true,
		});
	}
</script>

<div class="flex w-full min-w-0 flex-1">
	<Card.Root
		class="w-full min-w-0 rounded-2xl border border-brand-border bg-brand-surface p-3 shadow-sm"
	>
		<div class="flex min-w-0 flex-auto flex-col">
			<Tabs.Root value="gesto">
				<Tabs.List class="border-brand-border">
					<Tabs.Trigger
						class={`h-10 rounded-l-lg rounded-r-none px-4 transition duration-300 ${
							selectedTab !== 'gesto' ? 'text-foreground' : ''
						}`}
						value="gesto"
						on:click={() => switchTab('gesto')}
					>
						<Hand />&nbsp;Gesto
					</Tabs.Trigger>

					<Tabs.Trigger
						class={`h-10 rounded-l-none rounded-r-lg px-4 transition duration-300 ${
							selectedTab !== 'texto' ? 'text-foreground' : ''
						}`}
						value="texto"
						on:click={() => switchTab('texto')}
					>
						<TextCursor /> &nbsp;Texto
					</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>

			<div class="flex w-full min-w-0 flex-1 flex-col gap-4 pt-4 lg:flex-row lg:gap-10">
				{#if selectedTab === 'gesto'}
					<div class="flex w-full min-w-0 flex-1 flex-row lg:ml-1">
						<SignSearch {data} {parameters} {signs} />
					</div>
				{/if}
				{#if selectedTab === 'texto'}
					<div class="flex w-full min-w-0 flex-1 flex-row lg:ml-1">
						<TextSearch />
					</div>
				{/if}
				<TagFilterButton tags={data.themes} />
			</div>
		</div>
	</Card.Root>
</div>
