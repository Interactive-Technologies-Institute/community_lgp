<script lang="ts">
	export let signs;
	export let themes;
	export let parameters;
	import SignFlow from './SignFlow.svelte';
	import DictionaryGrid from './DictionaryGrid.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { Sign } from '@/types/types';

	export let isFiltering: boolean = false;
	// Only include themes that actually have matching signs
	$: visibleThemes =
		themes?.filter((theme: string) => signs?.some((sign: Sign) => sign.theme?.includes?.(theme))) ??
		[];
</script>

<div class="mx-auto flex max-w-[1400px] flex-col px-[30px]">
	{#if signs.length === 0}
    <p class="py-8 text-center text-gray-500">Nenhum resultado encontrado.</p>
{:else if isFiltering}
    <!-- When filtering, show all results in one grid -->
    <DictionaryGrid {signs} theme={null} parameter={parameters} />
{:else}
    <!-- When not filtering, group by themes -->
    {#each visibleThemes as theme}
        <SignFlow {signs} {theme} />
        <Separator class="my-4" />
    {/each}
{/if}
</div>
