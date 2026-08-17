<script lang="ts">
	import DictionaryGrid from './DictionaryGrid.svelte';
	import type { Sign } from '@/types/types';
	import { Loader2 } from 'lucide-svelte';

	export let data;
	export let signs;
	export let parameters;
	export let isFiltering: boolean = false;
	export let isSearching: boolean = false;

	$: featuredSigns = (data?.featuredSigns ?? []) as Sign[];
	$: dailySigns = (data?.dailySigns ?? []) as Sign[];
</script>

<div class="mx-auto flex max-w-[1400px] flex-col px-[30px]">
	{#if isSearching}
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
					<DictionaryGrid {data} signs={dailySigns} theme={null} parameter={parameters} horizontal />
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
					<DictionaryGrid {data} signs={featuredSigns} theme={null} parameter={parameters} horizontal />
				</section>
			{/if}
		</div>
	{:else}
		<!-- When filtering, show all results in one grid -->
		<DictionaryGrid {data} {signs} theme={null} parameter={parameters} />

		{#if signs.length === 0}
			<p class="py-8 text-center text-gray-500">Nenhum resultado encontrado</p>
		{/if}
	{/if}
</div>
