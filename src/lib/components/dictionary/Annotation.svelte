<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import { Button } from '@/components/ui/button';
	import type { AnnotationArray, Parameter } from '@/types/types';

	export let parameter: Parameter[];
	export let annotation: Record<keyof AnnotationArray, number[]> = {
		configuration: [],
		location: [],
		orientation: [],
		movement: [],
		expression: [],
	};
	export let annotation_array: number[] = Array(300).fill(0);

	let tabs: Record<string, { displayName: string; annotationKey: keyof AnnotationArray }> = {
		configuracao: { displayName: 'Configuração', annotationKey: 'configuration' },
		localizacao: { displayName: 'Localização', annotationKey: 'location' },
		orientacao: { displayName: 'Orientação', annotationKey: 'orientation' },
		movimento: { displayName: 'Movimento', annotationKey: 'movement' },
		'expressao facial': { displayName: 'Expressão Facial', annotationKey: 'expression' },
	};

	let selectedTab: keyof typeof tabs = 'configuracao'; // Default to the first tab

	function filterByType(parameter_type: string) {
		return parameter.filter((p) => p.tipo === parameter_type);
	}

	function getChildren(parentCode: string) {
		return parameter.filter((p) => p.parent === parentCode);
	}

	function addToannotationArray(p: Parameter, isSelected: boolean) {
		const index = p.id - 1;
		if (index >= 0 && index < annotation_array.length) {
			annotation_array[index] = isSelected ? 1 : 0;
		}
	}

	function handleParameterIdClick(p: Parameter) {
		const annotationKey = tabs[selectedTab].annotationKey;
		const isSelected = annotation[annotationKey].includes(p.id);

		if (isSelected) {
			annotation[annotationKey] = annotation[annotationKey].filter((id) => id !== p.id);
			addToannotationArray(p, false);
		} else {
			annotation[annotationKey] = [...annotation[annotationKey], p.id];
			addToannotationArray(p, true);
		}
	}
</script>

<div class="mx-auto flex w-auto flex-col items-center justify-center">
	<div class="mb-4 flex items-center justify-center gap-2">
		{#each Object.entries(tabs) as [key, { displayName }]}
			<Button
				on:click={() => (selectedTab = key)}
				class={selectedTab === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}
			>
				{displayName}
			</Button>
		{/each}
	</div>

	<ScrollArea class="max-h-[4000px] overflow-auto">
		<div class="grid auto-rows-min grid-cols-4 gap-4">
			{#each filterByType(selectedTab) as p}
				{#if p.is_parent}
					<Card.Root
						class="flex flex-col items-center justify-center rounded-md border bg-white p-2 shadow {annotation[
							tabs[selectedTab].annotationKey
						].includes(p.id)
							? 'border-4 border-blue-500'
							: ''}"
					>
						{#if p.image}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
							<Card.Content class="flex flex-col items-center justify-center px-1 py-2">
								<img
									src={p.image}
									alt="Parameter drawing"
									class="aspect-square h-[100px] w-[100px] cursor-pointer object-contain"
									on:click={() => handleParameterIdClick(p)}
								/>
								{#if p.tipo == "expressao facial"}
									<span class="mt-1 text-xs text-center text-black">{p.name}</span>
								{/if}
							</Card.Content>
						{:else}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<Card.Content class="px-3 py-3 font-semibold text-black">
								<div
									class="flex w-full cursor-pointer items-center justify-center"
									on:click={() => handleParameterIdClick(p)}
								>
									{p.name ?? p.code}
								</div>
							</Card.Content>
						{/if}

						{#if p.code}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="mt-2 grid grid-cols-3 justify-center gap-x-5 gap-y-5 overflow-auto">
								{#each getChildren(p.code) as child}
									<div
										class="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-md {annotation[
											tabs[selectedTab].annotationKey
										].includes(child.id)
											? 'border-4 border-blue-500'
											: ''}"
										on:click={() => handleParameterIdClick(child)}
									>
										{#if child.image}
											<img
												src={child.image}
												alt="Child Parameter"
												class="w-18 h-18 aspect-square rounded-md object-contain"
											/>
										{:else}
											<span class="text-center text-xs text-black">{child.name ?? child.code}</span>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</Card.Root>
				{/if}
			{/each}
		</div>
	</ScrollArea>
</div>
