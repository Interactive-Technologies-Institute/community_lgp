<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Parameter } from '@/types/types';
	export let data: Parameter[];
</script>

<div class="mt-2 flex flex-wrap gap-2">
	{#each data as parameter}
		<Card.Root
			class="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-xl bg-white shadow"
		>
			{#if parameter.image}
				<img
					src={parameter.image}
					alt={parameter.name ?? parameter.code}
					class="h-16 w-16 object-contain"
				/>
			{:else}
				<span class="px-1 text-center text-[10px] text-black"
					>{parameter.name ?? parameter.code}</span
				>
			{/if}
		</Card.Root>
	{/each}
</div>
