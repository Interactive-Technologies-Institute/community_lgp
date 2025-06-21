<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import { Button } from '@/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Popover from '$lib/components/ui/popover';
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';

	export let parameters: Parameter[] = [];
	export let signs: Sign[] = [];
	const page = queryParam('page', stringQueryParam());
	import { createEventDispatcher } from 'svelte';
	import { afterNavigate, pushState } from '$app/navigation';
	import { Search } from 'lucide-svelte';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';
	const dispatch = createEventDispatcher();

	import { ChevronUp } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import AnnotationTab from './AnnotationTab.svelte';

	let searchResults: Sign[] = [];

	const annotation = queryParam('annotation', arrayQueryParam());

	let searchArray = Array(300).fill(0);
	let selectedParameterIds: number[] = [];
	let isFiltering = false;
	let hasLoadedFromAnnotation = false;
	$: currentPageNumber = parseInt($page ?? '') || 1;


	$: if ($annotation && $annotation.length > 0 && !isFiltering && !hasLoadedFromAnnotation) {
		hasLoadedFromAnnotation = true;
	selectedParameterIds = $annotation.map((id : string) => parseInt(id));
	searchArray = Array(300).fill(0);
	selectedParameterIds.forEach((id) => {
		if (id > 0 && id <= 300) {
			searchArray[id - 1] = 1;
		}
	});
	searchSigns();
}



	const tabs: Record<string, { displayName: string; annotationKey: keyof AnnotationArray }> = {
		configuracao: { displayName: 'Configuração', annotationKey: 'configuration' },
		localizacao: { displayName: 'Localização', annotationKey: 'location' },
		orientacao: { displayName: 'Orientação', annotationKey: 'orientation' },
		movimento: { displayName: 'Movimento', annotationKey: 'movement' },
		'expressao facial': { displayName: 'Expressão Facial', annotationKey: 'expression' },
	};

	

	async function searchSigns() {
		try {
			const type = window.location.pathname.split('/')[1]; // Get the type from the URL
			let apiUrl = '';

			if (type === 'dictionary') {
				apiUrl = '/api/dictionary/search';
			} else if (type === 'fcdictionary') {
				apiUrl = '/api/fcdictionary/search';
			} else {
				console.error('Invalid type parameter in URL');
				return;
			}

			const limit = 9;
			const currentPage = currentPageNumber;
			const offset = (currentPage - 1) * limit;

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ searchArray, limit, offset }),
			});

			if (!response.ok) {
				console.error('Failed to fetch signs');
				return;
			}
			const data = await response.json();
			signs = data.signs;
			console.log('signs length::', data)
			dispatch('updateSigns', signs);
			dispatch('updateIsFiltering', (isFiltering = true));
			dispatch('updateCountSign', 90);
		} catch (error) {
			console.error('Error fetching signs:', error);
		}
	}

	$: searchArray = (() => {
	const arr = Array(300).fill(0);
	selectedParameterIds.forEach((id) => {
		if (id > 0 && id <= 300) {
			arr[id - 1] = 1;
		}
	});
	return arr;
})();

	function applySearch() {
	// Set URL param
	annotation.set(selectedParameterIds.map(String));

	page.set('1');

	// Trigger actual search
	searchSigns();
}
	let openTab = '';

	afterNavigate(() => {
		signs = signs ?? [];
	});

	$: if (isFiltering && $page) {
	searchSigns();
}
</script>

<Tabs.Root value="configuracao">
	<Tabs.List>
		<AnnotationTab {parameters} value='configuracao' displayName='Configuração' bind:selectedParameterIds></AnnotationTab>
		<AnnotationTab {parameters} value='localizacao' displayName='Localização'  bind:selectedParameterIds></AnnotationTab>
		<AnnotationTab {parameters} value='orientacao' displayName='Orientação'  bind:selectedParameterIds></AnnotationTab>
		<AnnotationTab {parameters} value='movimento' displayName='Movimento'  bind:selectedParameterIds></AnnotationTab>
		<AnnotationTab {parameters} value='expressao facial' displayName='Expressão Facial' bind:selectedParameterIds></AnnotationTab>
	</Tabs.List>
</Tabs.Root>
<!-- Search Button Inside Each Popover (Optional) -->
<div class="flex justify-end px-2">
	<Button
		on:click={() => {
			applySearch();
		}}><Search /></Button
	>
</div>
