<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { Parameter, Sign } from '@/types/types';
	import { afterNavigate } from '$app/navigation';
	import { Search, X } from 'lucide-svelte';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';
	import AnnotationTab from './AnnotationTab.svelte';
	import AnnotationShowcase from './AnnotationShowcase.svelte';

	export let data;
	export let parameters: Parameter[] = [];
	export let signs: Sign[] = [];

	const page = queryParam('page', stringQueryParam());
	const annotation = queryParam('annotation', arrayQueryParam());

	let selectedParameterIds: number[] = [];
	let hasLoadedFromAnnotation = false;

	$: selectedParameters = getParametersById(selectedParameterIds);

	$: if ($annotation && $annotation.length > 0 && !hasLoadedFromAnnotation) {
		hasLoadedFromAnnotation = true;
		selectedParameterIds = $annotation.map((id: string) => parseInt(id));
	}

	function getParametersById(ids: number[]) {
		return parameters.filter((param) => ids.includes(param.id));
	}

	function applySearch() {
		annotation.set(selectedParameterIds.map(String));
		page.set('1');
	}

	function removeSelectedParameter(id: number) {
		selectedParameterIds = selectedParameterIds.filter((parameterId) => parameterId !== id);
		annotation.set(selectedParameterIds.map(String));
		page.set('1');
	}

	afterNavigate(() => {
		signs = signs ?? [];
	});
</script>

<div class="flex w-full min-w-0 flex-1 flex-col gap-4">
	<div class="flex w-full min-w-0 flex-1 gap-0">
		<AnnotationShowcase
			data={selectedParameters}
			removable
			on:remove={(event) => removeSelectedParameter(event.detail)}
		/>
		{#if selectedParameterIds.length > 0}
			<Button
				variant="outline"
				class="h-auto shrink-0 rounded-none border border-brand-border bg-red-100 p-1 hover:bg-red-200"
				on:click={() => {
					selectedParameterIds = [];
					annotation.set([]);
					page.set('1');
				}}
			>
				<X class="h-5 w-5 text-red-500" />
			</Button>
		{/if}
		<div class="flex shrink-0 justify-end">
			<Button
				class="h-auto rounded-l-none rounded-r-lg bg-brand-blue text-brand-white"
				on:click={() => {
					applySearch();
				}}><Search /></Button
			>
		</div>
	</div>

	<div class="flex w-full min-w-0 flex-1 flex-row">
		<Tabs.Root value="configuracao" class="flex w-full min-w-0 flex-1">
			<Tabs.List
				class="grid h-auto w-full min-w-0 flex-1 grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-3 lg:grid-cols-5"
			>
				<AnnotationTab
					{parameters}
					value="configuracao"
					displayName="Configuração"
					bind:selectedParameterIds
				></AnnotationTab>
				<AnnotationTab
					{parameters}
					value="localizacao"
					displayName="Localização"
					bind:selectedParameterIds
				></AnnotationTab>
				<AnnotationTab
					{parameters}
					value="orientacao"
					displayName="Orientação"
					bind:selectedParameterIds
				></AnnotationTab>
				<AnnotationTab
					{parameters}
					value="movimento"
					displayName="Movimento"
					bind:selectedParameterIds
				></AnnotationTab>
				<AnnotationTab
					{parameters}
					value="expressao facial"
					displayName="Expressão Facial"
					bind:selectedParameterIds
				></AnnotationTab>
			</Tabs.List>
		</Tabs.Root>
	</div>
</div>
