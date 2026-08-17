<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';
	import Badge from '@/components/ui/badge/badge.svelte';
	import AnnotationGrid from './AnnotationGrid.svelte';
	import { goto } from '$app/navigation';
	export let data;
	export let signs: Sign[];
	export let theme;
	export let parameter: Parameter[];
	export let horizontal: boolean = false;

	function getParameters(annotation: AnnotationArray) {
		const parameterFilter: Parameter[] = [];
		let flatAnnotation = Object.values(annotation || {}).flat();
		parameter.filter((param: Parameter) => {
			if (flatAnnotation.includes(param.id)) {
				parameterFilter.push(param);
			}
		});
		return parameterFilter;
	}

	function goToDictionary(signId: number) {
		const type = window.location.pathname.split('/')[1]; // Get the type from the URL

		if (type === 'dictionary') {
			return goto(`/dictionary/sign/${signId}`);
		} else if (type === 'fcdictionary') {
			return goto(`/fcdictionary/sign/${signId}`);
		} else {
			console.error('Invalid type parameter in URL');
			return;
		}
	}
</script>

<div
	class={horizontal
		? 'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3'
		: 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'}
>
	{#each signs as sign (sign.id)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<Card.Root
			class={`rounded-2xl border border-brand-border ${
				horizontal ? 'w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]' : ''
			}`}
		>
			<Card.Content class="flex items-center justify-center p-3" on:click={() => goToDictionary(sign.id)}>
				<div class="flex w-full flex-col" on:click={() => goToDictionary(sign.id)}>
					<video class="aspect-video w-full rounded-b-none rounded-t-xl" controls muted>
						<source src={sign.video} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<p class="pt-4 text-lg font-medium">{sign.name}</p> 
					<div class="mt-2 flex flex-wrap gap-2">
						{#each sign.theme as t}
							{#if t}
								<Badge class="w-fit border border-brand-border bg-brand-surface dark:bg-brand-border/60" variant="outline">{t}</Badge>
							{/if}
						{/each}
						<AnnotationGrid data={getParameters(sign.annotation)} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
