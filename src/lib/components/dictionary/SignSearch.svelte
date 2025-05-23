<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import { Button } from '@/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Popover from '$lib/components/ui/popover';
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';

	export let parameters: Parameter[] = [];
	export let signs: Sign[] = [];
	import { createEventDispatcher } from 'svelte';
	import { afterNavigate, pushState } from '$app/navigation';
	import { Search } from 'lucide-svelte';
	import { arrayQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';
	const dispatch = createEventDispatcher();

	import { ChevronUp } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';

	let searchResults: Sign[] = [];

	const annotation = queryParam('annotation', arrayQueryParam());

	let searchArray = Array(300).fill(0);
	let selectedParameterIds: number[] = [];
	let isFiltering = false;
	let hasLoadedFromAnnotation = false;

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

	function filterByType(type: string) {
		return parameters.filter((p) => p.tipo === type);
	}

	function getChildren(code: string) {
		return parameters.filter((p) => p.parent === code);
	}

	function toggleParameter(p: Parameter) {
	const isSelected = selectedParameterIds.includes(p.id);
	if (isSelected) {
		selectedParameterIds = selectedParameterIds.filter((id) => id !== p.id);
		searchArray[p.id] = 0;
	} else {
		selectedParameterIds = [...selectedParameterIds, p.id];
		searchArray[p.id] = 1;
	} 
}

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

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ searchArray }),
			});

			if (!response.ok) {
				console.error('Failed to fetch signs');
				return;
			}
			const data = await response.json();
			signs = data.signs;
			console.log('Fetched signs:', signs);
			dispatch('updateSigns', signs);
			dispatch('updateIsFiltering', (isFiltering = true));
		} catch (error) {
			console.error('Error fetching signs:', error);
		}
	}

	function applySearch() {
	// Set URL param
	annotation.set(selectedParameterIds.map(String));

	// Update internal state
	searchArray = Array(300).fill(0);
	selectedParameterIds.forEach((id) => {
		if (id > 0 && id <= 300) {
			searchArray[id - 1] = 1;
		}
	});

	// Trigger actual search
	searchSigns();
}
	let openTab = '';

	afterNavigate(() => {
		signs = signs ?? [];
	});
</script>

<Tabs.Root value="configuracao">
	<Tabs.List>
		<Popover.Root>
			<Popover.Trigger>
				<Tabs.Trigger value="configuracao" 
				on:click={() => openTab = openTab === 'configuracao' ? '' : 'configuracao'}
				>
					Configuração 
					{#if openTab === 'configuracao'}
						<ChevronUp class="pt-1" />
					{:else}
						<ChevronDown class="pt-1" />
					{/if}
				</Tabs.Trigger>
			</Popover.Trigger>

			<Popover.Content class="w-[1000px] overflow-auto p-4">
				<ScrollArea class="h-[700px] overflow-auto px-2">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
						{#each filterByType('configuracao') as parent}
							{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
								<Card.Root
									class="{selectedParameterIds.includes(parent.id)
										? 'border-2 border-blue-500'
										: 'border'} bg-white"
								>
									<Card.Content class="flex flex-col items-center gap-2 p-4">
										{#if parent.image}
											<img
												src={parent.image}
												alt={parent.name ?? parent.code}
												class="h-32 w-full cursor-pointer object-contain"
												on:click={() => toggleParameter(parent)}
											/>
										{:else}
											<div
												class="flex h-32 w-full cursor-pointer items-center justify-center text-center font-semibold"
												on:click={() => toggleParameter(parent)}
											>
												<div class="font-semibold text-black">{parent.name ?? parent.code}</div>
											</div>
										{/if}

										{#if parent.code}
											<div class="mt-2 grid max-h-32 grid-cols-4 gap-2 overflow-y-auto">
												{#each getChildren(parent.code) as child}
													{#if child.image}
														<div
															class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
																child.id
															)
																? 'border-2 border-blue-500'
																: ''}"
															on:click={() => toggleParameter(child)}
														>
															<img
																src={child.image}
																alt={child.name ?? child.code}
																class="aspect-square h-[60px] w-full rounded-md"
															/>
														</div>
													{/if}
												{/each}
											</div>
										{/if}
									</Card.Content>
								</Card.Root>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				<Tabs.Trigger value="localizacao" 
				on:click={() => openTab = openTab === 'localizacao' ? '' : 'localizacao'}
				>
					Localização 
					{#if openTab === 'localizacao'}
						<ChevronUp class="pt-1" />
					{:else}
						<ChevronDown class="pt-1" />
					{/if}
				</Tabs.Trigger>
			</Popover.Trigger>

			<Popover.Content class="w-[1000px] overflow-auto p-4">
				<ScrollArea class="h-[700px] overflow-auto px-2">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
						{#each filterByType('localizacao') as parent}
							{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
								<Card.Root
									class="{selectedParameterIds.includes(parent.id)
										? 'border-2 border-blue-500'
										: 'border'} bg-white"
								>
									<Card.Content class="flex flex-col items-center gap-2 p-4">
										{#if parent.image}
											<img
												src={parent.image}
												alt={parent.name ?? parent.code}
												class="h-32 w-full cursor-pointer object-contain"
												on:click={() => toggleParameter(parent)}
											/>
										{:else}
											<div
												class="flex h-32 w-full cursor-pointer items-center justify-center text-center font-semibold"
												on:click={() => toggleParameter(parent)}
											>
												<div class="font-semibold text-black">{parent.name ?? parent.code}</div>
											</div>
										{/if}

										{#if parent.code}
											<div class="mt-2 grid max-h-32 grid-cols-4 gap-2 overflow-y-auto">
												{#each getChildren(parent.code) as child}
													{#if child.image}
														<div
															class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
																child.id
															)
																? 'border-2 border-blue-500'
																: ''}"
															on:click={() => toggleParameter(child)}
														>
															<img
																src={child.image}
																alt={child.name ?? child.code}
																class="aspect-square h-[60px] w-full rounded-md"
															/>
														</div>
													{/if}
												{/each}
											</div>
										{/if}
									</Card.Content>
								</Card.Root>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				<Tabs.Trigger value="orientacao" 
				on:click={() => openTab = openTab === 'orientacao' ? '' : 'orientacao'}
				>
					Orientação 
					{#if openTab === 'orientacao'}
						<ChevronUp class="pt-1" />
					{:else}
						<ChevronDown class="pt-1" />
					{/if}
				</Tabs.Trigger>
			</Popover.Trigger>

			<Popover.Content class="w-[1000px] overflow-auto p-4">
				<ScrollArea class="h-[700px] overflow-auto px-2">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
						{#each filterByType('orientacao') as parent}
							{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
								<Card.Root
									class="{selectedParameterIds.includes(parent.id)
										? 'border-2 border-blue-500'
										: 'border'} bg-white"
								>
									<Card.Content class="flex flex-col items-center gap-2 p-4">
										{#if parent.image}
											<img
												src={parent.image}
												alt={parent.name ?? parent.code}
												class="h-32 w-full cursor-pointer object-contain"
												on:click={() => toggleParameter(parent)}
											/>
										{:else}
											<div
												class="flex h-32 w-full cursor-pointer items-center justify-center text-center font-semibold"
												on:click={() => toggleParameter(parent)}
											>
												<div class="font-semibold text-black">{parent.name ?? parent.code}</div>
											</div>
										{/if}

										{#if parent.code}
											<div class="mt-2 grid max-h-32 grid-cols-4 gap-2 overflow-y-auto">
												{#each getChildren(parent.code) as child}
													{#if child.image}
														<div
															class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
																child.id
															)
																? 'border-2 border-blue-500'
																: ''}"
															on:click={() => toggleParameter(child)}
														>
															<img
																src={child.image}
																alt={child.name ?? child.code}
																class="aspect-square h-[60px] w-full rounded-md"
															/>
														</div>
													{/if}
												{/each}
											</div>
										{/if}
									</Card.Content>
								</Card.Root>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				<Tabs.Trigger value="movimento" 
				on:click={() => openTab = openTab === 'movimento' ? '' : 'movimento'}
				>
					Movimento 
					{#if openTab === 'movimento'}
						<ChevronUp class="pt-1" />
					{:else}
						<ChevronDown class="pt-1" />
					{/if}
				</Tabs.Trigger>
			</Popover.Trigger>

			<Popover.Content class="w-[1000px] overflow-auto p-4">
				<ScrollArea class="h-[700px] overflow-auto px-2">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
						{#each filterByType('movimento') as parent}
							{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
								<Card.Root
									class="{selectedParameterIds.includes(parent.id)
										? 'border-2 border-blue-500'
										: 'border'} bg-white"
								>
									<Card.Content class="flex flex-col items-center gap-2 p-4">
										{#if parent.image}
											<img
												src={parent.image}
												alt={parent.name ?? parent.code}
												class="h-32 w-full cursor-pointer object-contain"
												on:click={() => toggleParameter(parent)}
											/>
										{:else}
											<div
												class="flex h-32 w-full cursor-pointer items-center justify-center text-center font-semibold"
												on:click={() => toggleParameter(parent)}
											>
												<div class="font-semibold text-black">{parent.name ?? parent.code}</div>
											</div>
										{/if}

										{#if parent.code}
											<div class="mt-2 grid max-h-32 grid-cols-4 gap-2 overflow-y-auto">
												{#each getChildren(parent.code) as child}
													{#if child.image}
														<div
															class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
																child.id
															)
																? 'border-2 border-blue-500'
																: ''}"
															on:click={() => toggleParameter(child)}
														>
															<img
																src={child.image}
																alt={child.name ?? child.code}
																class="aspect-square h-[60px] w-full rounded-md"
															/>
														</div>
													{/if}
												{/each}
											</div>
										{/if}
									</Card.Content>
								</Card.Root>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				<Tabs.Trigger value="expressao facial" 
				on:click={() => openTab = openTab === 'expressao facial' ? '' : 'expressao facial'}
				>
					Expressão Facial 
					{#if openTab === 'expressao facial'}
						<ChevronUp class="pt-1" />
					{:else}
						<ChevronDown class="pt-1" />
					{/if}
				</Tabs.Trigger>
			</Popover.Trigger>

			<Popover.Content class="w-[1000px] overflow-auto p-4">
				<ScrollArea class="h-[700px] overflow-auto px-2">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
						{#each filterByType('expressao facial') as parent}
							{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
								<Card.Root
									class="{selectedParameterIds.includes(parent.id)
										? 'border-2 border-blue-500'
										: 'border'} bg-white"
								>
									<Card.Content class="flex flex-col items-center gap-2 p-4">
										{#if parent.image}
											<img
												src={parent.image}
												alt={parent.name ?? parent.code}
												class="h-32 w-full cursor-pointer object-contain"
												on:click={() => toggleParameter(parent)}
											/>
										{:else}
											<div
												class="flex h-32 w-full cursor-pointer items-center justify-center text-center font-semibold"
												on:click={() => toggleParameter(parent)}
											>
												<div class="font-semibold text-black">{parent.name ?? parent.code}</div>
											</div>
										{/if}

										{#if parent.code}
											<div class="mt-2 grid max-h-32 grid-cols-4 gap-2 overflow-y-auto">
												{#each getChildren(parent.code) as child}
													{#if child.image}
														<div
															class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
																child.id
															)
																? 'border-2 border-blue-500'
																: ''}"
															on:click={() => toggleParameter(child)}
														>
															<img
																src={child.image}
																alt={child.name ?? child.code}
																class="aspect-square h-[60px] w-full rounded-md"
															/>
														</div>
													{/if}
												{/each}
											</div>
										{/if}
									</Card.Content>
								</Card.Root>
							{/if}
						{/each}
					</div>
				</ScrollArea>
			</Popover.Content>
		</Popover.Root>
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
