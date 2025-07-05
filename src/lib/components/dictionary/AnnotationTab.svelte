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
	<Popover.Trigger>
		<Tabs.Trigger {value} on:click={() => (openTab = openTab === value ? '' : value)}>
			{displayName}
			{#if openTab === value}
				<ChevronUp class="pt-1" />
			{:else}
				<ChevronDown class="pt-1" />
			{/if}
		</Tabs.Trigger>
	</Popover.Trigger>

	<Popover.Content class="w-[1000px] overflow-auto p-4">
		<ScrollArea class="h-[700px] overflow-auto px-2">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
				{#each filterByType(value) as parent}
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
									{#if parent.tipo == 'expressao facial'}
										<span class="font-semibold text-black">{parent.name}</span>
									{/if}
								{:else}
									<div
										class="flex h-32 w-full cursor-pointer items-center justify-center text-center font-semibold"
										on:click={() => toggleParameter(parent)}
									>
										<span class="font-semibold text-black">{parent.name ?? parent.code}</span>
									</div>
								{/if}

								{#if parent.code}
									<div class="mt-2 grid max-h-32 grid-cols-3 gap-2 overflow-y-auto">
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
