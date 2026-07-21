<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Popover from '$lib/components/ui/popover';
	import { ChevronUp } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { Parameter } from '@/types/types';

	export let parameters: Parameter[];
	export let value: string;
	export let displayName: string;
	export let selectedParameterIds: number[] = [];

	let openTab = '';
	function filterByType(type: string) {
		return parameters.filter((p) => p.tipo === type && p.code !== 'F000');
	}

	function toggleParameter(p: Parameter) {
		const isSelected = selectedParameterIds.includes(p.id);
		if (isSelected) {
			selectedParameterIds = selectedParameterIds.filter((id) => id !== p.id);
		} else {
			selectedParameterIds = [...selectedParameterIds, p.id];
		}
	}

	function getChildren(code: string) {
		return parameters.filter((p) => p.parent === code);
	}
</script>

<Popover.Root>
	<Popover.Trigger class="flex min-w-0 flex-1 bg-brand-surface">
		<Tabs.Trigger
			{value}
			class="min-h-8 min-w-0 flex-1 whitespace-normal px-2 text-center text-sm sm:text-base data-[state=active]:text-brand-blue data-[state=active]:bg-brand-white"
			on:click={() => (openTab = openTab === value ? '' : value)}
		>
			<span class="min-w-0 break-words leading-tight">{displayName}</span>
			{#if openTab === value}
				<ChevronUp class="h-5 w-5 shrink-0 pt-1" />
			{:else}
				<ChevronDown class="h-5 w-5 shrink-0 pt-1" />
			{/if}
		</Tabs.Trigger>
	</Popover.Trigger>

	<Popover.Content
		class="flex max-h-[400px] h-auto max-w-[900px] w-auto flex-1 overflow-y-scroll p-4 border border-brand-border drop-shadow-lg"
		side="bottom"
		sideOffset={8}
		avoidCollisions={false}
	>
			<div class="grid h-full w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
				{#each filterByType(value) as parent}
					{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
						<Card.Root
							class="min-w-0 {selectedParameterIds.includes(parent.id)
								? 'border-2 border-solid border-brand-blue'
								: 'border border-brand-border'} bg-white"
						>
							<Card.Content class="flex min-w-0 flex-1 flex-col items-center gap-2 p-2">
								{#if parent.image}
									<img
										src={parent.image}
										alt={parent.name ?? parent.code}
										class="h-32 w-full cursor-pointer object-contain"
										on:click={() => toggleParameter(parent)}
									/>
									{#if parent.tipo == 'expressao facial'}
										<span class="font-semibold text-black">{parent.name}</span>
									{/if}
								{:else}
									<div
										class="flex h-16 w-full cursor-pointer items-center justify-center text-center font-semibold"
										on:click={() => toggleParameter(parent)}
									>
										<span class="font-semibold text-black">{parent.name ?? parent.code}</span>
									</div>
								{/if}

								{#if parent.code}
									{#if parent.code === 'LTR'}
										<div class="grid w-full grid-cols-2 gap-1 overflow-y-auto">
											{#each getChildren(parent.code) as child}
												{#if child.image}
													<div
														class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
															child.id
														)
															? 'border-2 border-solid border-brand-blue'
															: ''}"
														on:click={() => toggleParameter(child)}
													>
														<img
															src={child.image}
															alt={child.name ?? child.code}
															class="h-24 w-full rounded-md object-contain"
														/>
													</div>
												{/if}
											{/each}
										</div>
									{:else}
										<div class="grid w-full grid-cols-3 gap-1 overflow-y-auto">
											{#each getChildren(parent.code) as child}
												{#if child.image}
													<div
														class="flex cursor-pointer flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
															child.id
														)
															? 'border-2 border-solid border-brand-blue'
															: ''}"
														on:click={() => toggleParameter(child)}
													>
														<img
															src={child.image}
															alt={child.name ?? child.code}
															class="h-24 w-full rounded-md object-contain"
														/>
													</div>
												{/if}
											{/each}
										</div>
									{/if}
								{/if}
							</Card.Content>
						</Card.Root>
					{/if}
				{/each}
			</div>
	</Popover.Content>
</Popover.Root>
