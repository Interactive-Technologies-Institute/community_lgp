<script lang="ts">
	import DictionaryGrid from './DictionaryGrid.svelte';

	export let data;
	export let signs;
	export let parameters;
	export let isFiltering: boolean = false;
</script>

<div class="mx-auto flex max-w-[1400px] flex-col px-[30px]">
	{#if !isFiltering}
		<div class="flex flex-col items-center justify-center gap-2 pt-10">
			<img
					src="/branding/search-empty-state.svg"
					alt=""
					aria-hidden="true"
					class="h-32 lg:h-40"
				/>
				<p class="py-8 text-center text-foreground/80">Comece a sua pesquisa por um gesto</p>
		</div>
	{:else}
		<!-- When filtering, show all results in one grid -->
		<DictionaryGrid {data} {signs} theme={null} parameter={parameters} />

		{#if signs.length === 0}
			<p class="py-8 text-center text-gray-500">Nenhum resultado encontrado</p>
			
		{/if}
	{/if}
</div>
