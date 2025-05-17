<script lang="ts">

    export let signs;
    export let themes;
	export let parameters;
	import SignFlow from "./SignFlow.svelte";
	import DictionaryGrid from "./DictionaryGrid.svelte";
    import { Separator } from "$lib/components/ui/separator";
	import type { Sign } from "@/types/types";

	export let isFiltering: boolean = false;
    // Only include themes that actually have matching signs
	$: visibleThemes = themes?.filter((theme: string) =>
	signs?.some((sign: Sign) => sign.theme?.includes?.(theme))
	) ?? [];
</script>

<div class="flex flex-col mx-auto px-[30px] max-w-[1400px]">
	{#if signs.length === 0}
		<p class="text-center text-gray-500 py-8">Nenhum resultado encontrado.</p>
	{:else}
	{#each visibleThemes as theme}
		{#if isFiltering}
			<DictionaryGrid {signs} {theme} parameter={parameters} />
		{:else}
				<SignFlow {signs} {theme} />
				<Separator class="my-4" />
	{/if}
	{/each}
		
	{/if}
</div>