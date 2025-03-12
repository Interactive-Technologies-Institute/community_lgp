<script lang="ts">
	import { onMount } from 'svelte';
	import FileTable from './_components/FileTable.svelte';
	import type { Sign } from '@/types/types';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import { PlusCircle } from 'lucide-svelte';

	export let theme_options: { name: string; show: boolean }[] = [];
	export let anotation_options = [
		{ name: 'Anotados', show: true },
		{ name: 'Anotação não terminada', show: true },
		{ name: 'Por anotar', show: true },
	];
	let selection = false;
	export let signs_to_delete: number[] = [];
	let searchQuery = '';
	let signs: Sign[] = [];
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

	// Fetch signs based on the search query
	async function fetchSigns(query: string) {
		isLoading = true;
		try {
			const response = await fetch(`/api/dictionary/signs?search=${encodeURIComponent(query)}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			signs = data.signs;
		} catch (error) {
			errorMessage = 'Error fetching signs, please try again later.';
		} finally {
			isLoading = false;
		}
	}

	const debouncedFetchSigns = debounce(fetchSigns, 400);
	// Handle search input change
	function handleSearch() {
		debouncedFetchSigns(searchQuery);
	}

	// Initial fetch if searchQuery is not empty
	onMount(() => {
		fetchSigns(''); // Fetch all entries initially
	});
</script>

<div>
	<div class="container mx-auto flex flex-row justify-between gap-x-2 py-5">
		<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
			<Input
				type="text"
				placeholder="Procurar sinais"
				bind:value={searchQuery}
				on:input={handleSearch}
				class="w-full max-w-md rounded-md border border-gray-300 px-4 py-2 text-center"
			/>
		</div>
		<Button href="/dictionary/sign/create" class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2">
			<PlusCircle class="h-4 w-4 sm:mr-2" />
			<span class="sr-only sm:not-sr-only">Create Sign</span>
		</Button>
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
