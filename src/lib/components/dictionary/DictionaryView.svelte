<script lang="ts">

    export let signs;
    export let themes;
	import SignFlow from "./SignFlow.svelte";
    import { Separator } from "$lib/components/ui/separator";
	import type { Sign } from "@/types/types";

    // Only include themes that actually have matching signs
	$: visibleThemes = themes?.filter((theme : string) =>
		signs?.some((sign : Sign) => sign.theme.includes(theme))
	) ?? [];
</script>

<div class="flex flex-col ml-[287px] max-w-[2000px]">
	{#if signs.length === 0}
		<p class="text-center text-gray-500 py-8">Nenhum resultado encontrado.</p>
	{:else}
		{#each visibleThemes as theme}
			<SignFlow {signs} {theme} />
			<Separator class="my-4" />
		{/each}
	{/if}
</div>