<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Card from '$lib/components/ui/card';
	import * as Popover from '$lib/components/ui/popover';
	import { ChevronUp } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { Parameter } from '@/types/types';

	export let parameters: Parameter[];
	export let value: string;
	export let displayName: string;
	export let selectedParameterIds: number[] = [];

	let openTab = false;
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

<Popover.Root bind:open={openTab}>
	<Popover.Trigger
		class={cn(
			'flex h-auto min-h-8 w-full min-w-0 flex-row items-center justify-center gap-2 rounded-lg border border-brand-border bg-brand-white px-2 text-foreground dark:bg-brand-surface',
			openTab && 'border-brand-blue text-brand-blue'
		)}
	>
		<span class="min-w-0 break-words leading-tight">{displayName}</span>
		{#if openTab}
			<ChevronUp class="h-5 w-5 shrink-0 pt-1" />
		{:else}
			<ChevronDown class="h-5 w-5 shrink-0 pt-1" />
		{/if}
	</Popover.Trigger>

	<Popover.Content
		class="w-[900px] max-w-[calc(100vw-2rem)] overflow-hidden border border-brand-border p-0 drop-shadow-lg"
		side="bottom"
		sideOffset={8}
		avoidCollisions={false}
	>
		<div class="max-h-[400px] overflow-y-auto overscroll-contain p-4">
			<div class="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
				{#each filterByType(value) as parent}
					{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
						<Card.Root
							class="min-w-0 {selectedParameterIds.includes(parent.id)
								? 'border-2 border-solid border-brand-blue'
								: 'border border-brand-border'} bg-brand-white"
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
									{#if parent.tipo === 'localizacao'}
										<div class="grid w-full grid-cols-2 gap-1">
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
															title={child.name ?? child.code}
															class="h-24 w-full rounded-md object-contain"
														/>
													</div>
												{/if}
											{/each}
										</div>
									{:else}
										<div class="grid w-full grid-cols-3 gap-1">
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
		</div>
	</Popover.Content>
</Popover.Root>
