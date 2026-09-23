<!--
	MOCK/SCRIPTED FOR PROMO VIDEO: the video-mode branches below (skeleton grid while
	"processing", highlighted "best match" heading while "results") only ever activate
	when selectedTab === 'video', driven by the mocked state machine in
	VideoSearch.svelte via the shared video-search-state store. No real data or backend
	logic is involved — see VideoSearch.svelte for details.
-->
<script lang="ts">
	import DictionaryGrid from './DictionaryGrid.svelte';
	import type { Sign, Theme } from '@/types/types';
	import { Loader2 } from 'lucide-svelte';
	import { videoSearchStage } from './video-search-state';

	export let data;
	export let signs;
	export let themes: Theme[];
	export let parameters;
	export let isFiltering: boolean = false;
	export let isSearching: boolean = false;
	export let selectedTab: string = 'gesto';

	$: featuredSigns = (data?.featuredSigns ?? []) as Sign[];
	$: dailySigns = (data?.dailySigns ?? []) as Sign[];
</script>

<div class="mx-auto flex max-w-[1400px] flex-col px-[30px]">
	{#if selectedTab === 'video' && $videoSearchStage === 'processing'}
		<div class="space-y-4 py-6 sm:py-10">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				{#each Array(3) as _, index (index)}
					<div class="animate-pulse overflow-hidden rounded-2xl border border-brand-border">
						<div class="aspect-video w-full bg-[#eef2f7]"></div>
						<div class="space-y-2 p-4">
							<div class="h-4 w-2/3 rounded bg-[#eef2f7]"></div>
							<div class="h-3 w-1/3 rounded bg-[#eef2f7]"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if selectedTab === 'video' && $videoSearchStage === 'results'}
		<div class="space-y-2 py-6 sm:py-10">
			<h2 class="text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">
				Gestos semelhantes à sua gravação
			</h2>
			<p class="text-sm text-foreground/65">Do mais para o menos semelhante</p>
			<div class="pt-4">
				<DictionaryGrid {data} {signs} {themes} parameter={parameters} highlightFirst staggerAnimation />
			</div>

			{#if signs.length === 0}
				<p class="py-8 text-center text-gray-500">Nenhum resultado encontrado</p>
			{/if}
		</div>
	{:else if selectedTab === 'video'}
		<!-- MOCK/SCRIPTED FOR PROMO VIDEO: nothing to show before a recording has been made -->
		<div class="py-6 sm:py-10"></div>
	{:else if isSearching}
		<div
			class="flex min-h-64 flex-col items-center justify-center gap-3 py-10 text-brand-grey"
			role="status"
			aria-live="polite"
		>
			<Loader2 class="h-10 w-10 animate-spin text-brand-blue" aria-hidden="true" />
			<p class="text-center">A pesquisar gestos...</p>
		</div>
	{:else if !isFiltering}
		<div class="space-y-8 py-6 sm:py-10">
			<div class="flex items-center gap-4 pt-10 pb-5">
				<img src="/branding/search-empty-state.svg" alt="" aria-hidden="true" class="h-12" />
				<div>
					<p class="font-semibold text-foreground">Comece a sua pesquisa por um gesto</p>
					<p class="mt-1 text-sm text-foreground/65">
						Não sabe por onde começar? Veja algumas sugestões do dicionário.
					</p>
				</div>
			</div>

			<!-- Daily Signs -->
			{#if dailySigns.length > 0}
				<section
					aria-labelledby="daily-signs-heading"
					class="space-y-2 overflow-hidden rounded-2xl border border-brand-yellow/70 bg-brand-yellow/30 p-5 shadow-sm sm:p-7"
				>
					<div class="flex items-start pb-2">
						<h2 id="daily-signs-heading" class="text-xl font-bold text-brand-dark dark:text-foreground">
							Gestos do dia
						</h2>
					</div>
					<DictionaryGrid {data} signs={dailySigns} {themes} parameter={parameters} horizontal />
				</section>
			{/if}

			<!-- Recently Added -->
			{#if featuredSigns.length > 0}
				<section
					aria-labelledby="recent-signs-heading"
					class="space-y-2 overflow-hidden rounded-2xl border border-brand-blue/70 bg-brand-blue/30 p-5 shadow-sm sm:p-7"
				>
					<div class="flex items-start gap-3">
						<h2 id="recent-signs-heading" class="text-xl font-bold text-brand-dark dark:text-foreground">
							Adicionados recentemente
						</h2>
					</div>
					<DictionaryGrid {data} signs={featuredSigns} {themes} parameter={parameters} horizontal />
				</section>
			{/if}
		</div>
	{:else}
		<!-- When filtering, show all results in one grid -->
		<DictionaryGrid {data} {signs} {themes} parameter={parameters} />

		{#if signs.length === 0}
			<p class="py-8 text-center text-gray-500">Nenhum resultado encontrado</p>
		{/if}
	{/if}
</div>
