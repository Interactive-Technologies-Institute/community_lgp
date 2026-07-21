<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Parameter } from '@/types/types';
	import { createEventDispatcher } from 'svelte';
	import { X } from 'lucide-svelte';

	export let data: Parameter[] = [];
	export let removable = false;

	const dispatch = createEventDispatcher<{ remove: number }>();
	const orderedKeys: string[] = [
		'configuracao',
		'localizacao',
		'orientacao',
		'movimento',
		'expressao facial',
	];

	// Make this reactive
	$: filteredData = orderedKeys.flatMap((tipo) =>
		data.filter((param) => param.tipo === tipo && param.code !== 'F000')
	);
</script>

<div class="flex w-full min-w-0 flex-1">
	<Card.Root
		class={`flex w-full min-w-0 flex-1 rounded-l-lg rounded-r-none border border-brand-border bg-brand-white ${
			filteredData.length > 0 ? 'min-h-28' : 'h-10'
		}`}
	>
		<Card.Content class="flex w-full min-w-0 flex-1 items-center justify-start px-3 py-3 sm:px-4">
			{#if filteredData.length > 0}
				<div class="max-h-[min(17rem,45vh)] w-full min-w-0 pr-1">
					<div class="showcase-grid">
						{#each filteredData as parameter}
							<div
								class="overflow-visible showcase-tile relative flex min-w-0 flex-col items-center justify-center rounded-lg border bg-brand-white shadow-sm"
							>
								{#if removable}
									<button
										type="button"
										class="absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-red-100 p-1 hover:bg-red-200 text-red-500 transition"
										aria-label="Remover parâmetro {parameter.name ?? parameter.code}"
										on:click={() => dispatch('remove', parameter.id)}
									>
										<X class="h-4 w-4" aria-hidden="true" />
									</button>
								{/if}
								{#if parameter.image}
									<img
										src={parameter.image}
										alt={parameter.name ?? parameter.code}
										class="h-full w-full rounded-lg object-contain p-1.5"
									/>
								{:else}
									<span class="break-words px-1.5 text-center text-xs leading-tight text-black"
										>{parameter.name ?? parameter.code}</span
									>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<span class="min-w-0 truncate text-base text-foreground/60">
					Selecione parâmetros abaixo para pesquisar...
				</span>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.showcase-grid {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: clamp(0.375rem, 1.4vw, 0.75rem);
	}

	.showcase-tile {
		aspect-ratio: 1 / 1;
		flex: 0 1 clamp(4.25rem, 16vw, 6.75rem);
		width: clamp(4.25rem, 16vw, 6.75rem);
	}
</style>
