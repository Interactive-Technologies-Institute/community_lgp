<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import type { Parameter } from '@/types/types';
	import { cn } from '@/utils';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	export let parameters: Parameter[];
	export let value: string;
	export let selectedParameterIds: number[] = [];

	let open = false;

	$: typeParameters = parameters.filter(
		(parameter) => parameter.tipo === value && parameter.code !== 'F000'
	);

	function toggleParameter(parameter: Parameter) {
		selectedParameterIds = selectedParameterIds.includes(parameter.id)
			? selectedParameterIds.filter((id) => id !== parameter.id)
			: [...selectedParameterIds, parameter.id];
	}

	function getChildren(code: string) {
		return parameters.filter((parameter) => parameter.parent === code);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger
			class={cn(
				'flex flex-row gap-2 h-8 w-full min-w-0 rounded-lg bg-brand-white dark:bg-brand-surface px-2 items-center justify-center border border-brand-border text-foreground',
				open && 'text-brand-blue border-brand-blue'
			)}
		>
			Selecionar
			{#if open}
				<ChevronUp class="ml-1 h-5 w-5" aria-hidden="true" />
			{:else}
				<ChevronDown class="ml-1 h-5 w-5" aria-hidden="true" />
			{/if}
	</Popover.Trigger>

	<Popover.Content
		class="flex flex-1 max-h-[400px] h-auto max-w-[900px] w-auto overflow-y-scroll p-4 border border-brand-border drop-shadow-lg"
		side="bottom"
		sideOffset={8}
		avoidCollisions={false}
	>
		<div class="grid h-full w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
			{#each typeParameters as parent}
				{#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || parent.code?.toLowerCase() === '2ebj')}
					<Card.Root
						class="min-w-0 bg-brand-white {selectedParameterIds.includes(parent.id)
							? 'border-2 border-brand-blue'
							: 'border border-brand-border'}"
					>
						<Card.Content class="flex min-w-0 flex-col items-center gap-2 p-2">
							<button
								type="button"
								class="text-brand-dark-grey flex w-full flex-col items-center justify-center text-center font-semibold"
								on:click={() => toggleParameter(parent)}
								aria-pressed={selectedParameterIds.includes(parent.id)}
							>
								{#if parent.image}
									<img
										src={parent.image}
										alt={parent.name ?? parent.code}
										class="h-32 w-full object-contain"
									/>
									{#if parent.tipo === 'expressao facial'}
										<span>{parent.name}</span>
									{/if}
								{:else}
									<span class="flex h-16 items-center">{parent.name ?? parent.code}</span>
								{/if}
							</button>

							{#if parent.code}
								<div
									class="grid w-full gap-1 overflow-y-auto {parent.tipo === 'localizacao'
										? 'grid-cols-2'
										: 'grid-cols-3'}"
								>
									{#each getChildren(parent.code) as child}
										{#if child.image}
											<button
												type="button"
												class="flex flex-col items-center justify-center rounded-md text-center text-xs {selectedParameterIds.includes(
													child.id
												)
													? 'border-2 border-brand-blue'
													: 'border-2 border-transparent'}"
												on:click={() => toggleParameter(child)}
												aria-label={child.name ?? child.code}
												aria-pressed={selectedParameterIds.includes(child.id)}
											>
												<img
													src={child.image}
													alt={child.name ?? child.code}
													title={child.name ?? child.code}
													class="h-24 w-full rounded-md object-contain"
												/>
											</button>
										{/if}
									{/each}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
