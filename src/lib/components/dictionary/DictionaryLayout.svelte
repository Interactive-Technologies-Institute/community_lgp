<script lang="ts">
	import { onMount } from 'svelte';
	
	import type { Parameter, Sign } from '@/types/types';
    import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
    import { PlusCircle } from 'lucide-svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import DictionaryView from '@/components/dictionary/DictionaryView.svelte';
	import ParameterDialog from '../../../routes/dictionary/_components/ParameterDialog.svelte';
	
	
	let selection = false;
	
	export let data;
	let signs: Sign[] = [];
	$: signs =  data?.signs ?? [];
	
	let allThemes = data?.themes ? Array.from(data.themes.keys()) : [];
	let initialThemes = allThemes.slice(0,2);

	let parameters: Parameter[] = data.parameters;
	let isLoading = false;
	let errorMessage = '';

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});


	const theme = queryParam('theme', arrayQueryParam());

	

	$: isFiltering = ($search ?? '').trim().length > 0 || ($theme ?? []).length > 0;

	
	
</script>

<div>
	<div class="container mx-auto flex flex-row justify-between gap-x-2 py-5">
		<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
			<Input placeholder="Procura por texto..." class="flex-1 sm:max-w-64" bind:value={$search}></Input>
			<ParameterDialog parameter={parameters}/>
            <TagFilterButton tags={data.themes} bind:filterValues={$theme} />
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

	<DictionaryView {signs} themes={isFiltering ? allThemes : initialThemes} />
</div>
