<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Parameter } from '@/types/types';
	export let data: Parameter[];

	const sortOrder = ["configuracao", "localizacao", "orientacao", "movimento", "expressao facial"];

	function sortParameters(parameters : Parameter[]){
		return data.sort((a,b) => {
			const indexA = sortOrder.indexOf(a.tipo);
			const indexB = sortOrder.indexOf(b.tipo);

			const posA = indexA === -1 ? sortOrder.length : indexA;
			const posB = indexB === -1 ? sortOrder.length : indexB;

			return posA - posB;
		});
	}

	console.log(data)
</script>

<div class="mt-2 flex flex-wrap gap-2">
	{#each sortParameters(data).filter(p => p.code !== 'F000') as parameter}
		<Card.Root
			class="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-xl bg-white shadow"
		>

		{#if parameter.image}
			<img
				src={parameter.image}
				alt={parameter.name ?? parameter.code}
				class="h-16 w-16 object-contain"
			/>
		{/if}
		</Card.Root>
	{/each}
</div>
