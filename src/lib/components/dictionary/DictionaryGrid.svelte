<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';
	import Badge from '@/components/ui/badge/badge.svelte';
	import AnnotationGrid from './AnnotationGrid.svelte';
	export let signs: Sign[];
	export let theme;
	export let parameter: Parameter[];

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

	console.log(parameter)
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
	{#each signs as sign (sign.id)}
		<Card.Root class="rounded-2xl">
			<Card.Content class="flex items-center justify-center p-3">
				<div class="flex w-full flex-col">
					<video class="aspect-video w-full rounded-xl" controls muted>
						<source src={sign.video} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<a href="/dictionary/sign/{sign.id}" class="pt-4 text-lg">{sign.name}</a>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each sign.theme as t}
							{#if t}
								<Badge class="w-fit" variant="outline">{t}</Badge>
							{/if}
						{/each}
						<AnnotationGrid data={getParameters(sign.annotation)} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
