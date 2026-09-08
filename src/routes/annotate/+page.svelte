<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Sign } from '@/types/types';
	import AnnotateTable from './_components/AnnotateTable.svelte';
	import { Button } from '@/components/ui/button';
	import { CircleCheck, CircleEllipsis, CircleMinus, PlusCircle } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let signs: Sign[] = data.signs;
	let nonAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated === 0).sort((b, a) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());
	let semiAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated === 1).sort((b, a) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());
	let fullyAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated === 2).sort((b, a) => new Date(a.last_changed).getTime() - new Date(b.last_changed).getTime());

	const annotationSummaries = [
		{
			label: 'Incompletas',
			description: 'Necessitam de anotação.',
			count: data.annotationCounts.incomplete,
			target: '#incomplete-annotations',
			icon: CircleMinus,
			iconClasses: 'bg-destructive/10 dark:bg-destructive/30 text-destructive',
			hoverClasses: 'hover:border-destructive/60',
		},
		{
			label: 'Semi-Completas',
			description: 'Parcialmente anotadas.',
			count: data.annotationCounts.semiComplete,
			target: '#semi-complete-annotations',
			icon: CircleEllipsis,
			iconClasses: 'bg-brand-yellow/20 text-yellow-500',
			hoverClasses: 'hover:border-yellow-500',
		},
		{
			label: 'Completas',
			description: 'Totalmente anotadas.',
			count: data.annotationCounts.complete,
			target: '#complete-annotations',
			icon: CircleCheck,
			iconClasses: 'bg-[#c1e1c1]/20 text-green-500',
			hoverClasses: 'hover:border-green-500',
		},
	];
</script>

<MetaTags
	title="Anotações"
	description="Crie uma nova entrada de um gesto, anote ou altere as anotações de um gesto."
/>

<div class="container mx-auto pt-2">
	<div class="flex flex-auto flex-col items-start justify-start overflow-x-auto">
		<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl"> Anotações</h1>
		<p class="mt-1 mb-10 leading-7 text-foreground">Crie uma nova entrada de um gesto, anote ou altere as anotações de um gesto.</p>
	</div>

	<div class="flex items-start justify-start">
		{#if data?.user?.role == 'moderator' || data?.user?.role == 'admin'}
			<Button href="/annotate/create" class="flex flex-1 gap-2 sm:max-w-fit">
				<PlusCircle class="h-4 w-4 sm:mr-2" />
				<p>Adicionar entrada de gesto</p>
			</Button>
		{/if}
	</div>

	<section class="py-8">
		<div class="flex flex-row flex-wrap gap-5 md:gap-10">
			{#each annotationSummaries as summary}
				<Card.Root class={`flex flex-1 items-center rounded-2xl p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${summary.hoverClasses}`}>
					<Card.Content class="flex w-full p-2 items-center justify-center">
						<a class="flex flex-row w-full gap-10 items-center justify-center" href={summary.target}>
							<div class={`flex aspect-square h-16 shrink-0 items-center justify-center rounded-full ${summary.iconClasses}`}>
								<svelte:component this={summary.icon} class="h-8 w-8" strokeWidth={2.5} />
							</div>
							<div class="flex flex-col gap-2">
								<p class="font-semibold text-card-foreground">{summary.label}</p>
								<p class="text-3xl font-bold text-card-foreground">
									{summary.count.toLocaleString('pt-PT')}
								</p>
								<p class="text-muted-foreground">{summary.description}</p>
							</div>
						</a>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<div class="grid grid-cols-2 gap-4">
		<div id="incomplete-annotations" class="col-span-2 py-8">
			<div class="flex items-start justify-between rounded-t-2xl gap-4 border border-brand-border bg-destructive/10 dark:bg-destructive/30 px-5 py-2">
				<h2 class="text-xl font-bold text-card-foreground">Anotações Incompletas</h2>
				<p class="shrink-0 font-bold text-destructive dark:text-foreground">
					{data.annotationCounts.incomplete.toLocaleString('pt-PT')}
				</p>
			</div>
			<div class="py-4">
				<AnnotateTable signs={nonAnotatedSigns} themes={data.themes} />
			</div>
		</div>

		<div id="semi-complete-annotations" class="col-span-2 py-8">
			<div class="flex items-start justify-between rounded-t-2xl gap-4 border border-brand-border bg-brand-yellow/20 px-5 py-2">
				<h2 class="text-xl font-bold text-card-foreground">Anotações Semi-Completas</h2>
				<p class="shrink-0 font-bold text-yellow-500 dark:text-foreground">
					{data.annotationCounts.semiComplete.toLocaleString('pt-PT')}
				</p>
			</div>
			<div class="py-4">
				<AnnotateTable signs={semiAnotatedSigns} themes={data.themes} />
			</div>
		</div>

		<div id="complete-annotations" class="col-span-2 py-8">
			<div class="flex items-start justify-between rounded-t-2xl gap-4 border border-brand-border bg-[#c1e1c1]/20 px-5 py-2">
				<h2 class="text-xl font-bold text-card-foreground">Anotações Completas</h2>
				<p class="shrink-0 font-bold text-green-500 dark:text-foreground">
					{data.annotationCounts.complete.toLocaleString('pt-PT')}
				</p>
			</div>
			<div class="py-4">
				<AnnotateTable signs={fullyAnotatedSigns} themes={data.themes} />
			</div>
		</div>
	</div>
</div>
