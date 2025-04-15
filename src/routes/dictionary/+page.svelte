<script lang="ts">
	import { onMount } from 'svelte';
	import FileTable from './_components/FileTable.svelte';
	import type { Parameter, Sign, UserRole } from '@/types/types';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import { PlusCircle } from 'lucide-svelte';
	import ParameterDialog from './_components/ParameterDialog.svelte';
	import DictionaryView from '@/components/dictionary/DictionaryView.svelte';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import { stringQueryParam, arrayQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';

	export let theme_options: { name: string; show: boolean }[] = [];
	export let anotation_options = [
		{ name: 'Anotados', show: true },
		{ name: 'Anotação não terminada', show: true },
		{ name: 'Por anotar', show: true },
	];
	let selection = false;
	export let signs_to_delete: number[] = [];
	let searchQuery = '';
	export let data;
	let signs: Sign[] = [];
	$: signs =  data?.signs ?? [];
	let parameters: Parameter[] = data.parameters;
	let isLoading = false;
	let errorMessage = '';

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});


	const theme = queryParam('theme', arrayQueryParam());

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

	
</script>

<div>
	<div class="container mx-auto flex flex-row justify-between gap-x-2 py-5">
		<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
			<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
				<Input placeholder="Procura por texto..." class="flex-1 sm:max-w-64" bind:value={$search}></Input>
				<TagFilterButton tags={data.themes} bind:filterValues={$theme} />
				<ParameterDialog parameter={parameters}/>
			</div>
			
		</div>
		{#if data?.user?.role == 'moderator' || data?.user?.role == 'admin'}
		<Button href="/dictionary/sign/create" class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2">
			<PlusCircle class="h-4 w-4 sm:mr-2" />
			<span class="sr-only sm:not-sr-only">Adicionar entrada de gesto</span>
		</Button>
		{/if}
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
