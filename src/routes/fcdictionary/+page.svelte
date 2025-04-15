<script lang="ts">
	import { onMount } from 'svelte';
	
	import type { Parameter, Sign } from '@/types/types';
	import { Input } from '@/components/ui/input';
	import ParameterDialog from '../dictionary/_components/ParameterDialog.svelte';
	import FileTable from '../dictionary/_components/FileTable.svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	

	export let theme_options: { name: string; show: boolean }[] = [];
	export let anotation_options = [
		{ name: 'Anotados', show: true },
		{ name: 'Anotação não terminada', show: true },
		{ name: 'Por anotar', show: true },
	];
	let selection = false;
	export let signs_to_delete: number[] = [];
	export let data;
	let signs: Sign[] = [];
	$: signs =  data?.signs ?? [];
	
	
	let parameters: Parameter[] = data.parameters;
	let isLoading = false;
	let errorMessage = '';

	function debounce(func: Function, wait: number) {
		let timeout: ReturnType<typeof setTimeout>;
		return function (...args: any[]) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});


	const theme = queryParam('theme', arrayQueryParam());

	// Fetch signs based on the search query
	async function fetchSigns(query: string) {
		console.log('fetch signs for: ', query)
		isLoading = true;
		try {
			const response = await fetch(`/api/fcdictionary/signs?search=${encodeURIComponent(query)}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			console.log('Fetched signs:', data);
			signs = data.signs;
		} catch (error) {
			errorMessage = 'Error fetching signs, please try again later.';
		} finally {
			isLoading = false;
		}

	}

	
	const debouncedSearch = debounce((query: string) => {
			fetchSigns(query);
		}, 250);

		$: if ($search !== null) {
			debouncedSearch($search);
}

	
	
</script>

<div>
	<div class="container mx-auto flex flex-row justify-between gap-x-2 py-5">
		<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
			<Input placeholder="Procura por texto..." class="flex-1 sm:max-w-64" bind:value={$search}></Input>
			<TagFilterButton tags={data.themes} bind:filterValues={$theme} />
			<ParameterDialog parameter={parameters}/>
		</div>
		
	</div>

	{#if isLoading}
		<p class="loading">Loading...</p>
	{/if}
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	<FileTable
		data={{ signs }}
		bind:theme_options
		bind:anotation_options
		{selection}
		bind:signs_to_delete
	/>
</div>
