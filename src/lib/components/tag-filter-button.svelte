<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '@/components//ui/button';
	import * as Command from '@/components//ui/command';
	import * as Popover from '@/components//ui/popover';
	import { Check, Funnel } from 'lucide-svelte';

	export let filterValues: string[] | null = [];
	export let tags: Map<string, number> = new Map();

	let open = false;

	function handleSelect(currentValue: string) {
		if (Array.isArray(filterValues) && filterValues.includes(currentValue)) {
			filterValues = filterValues.filter((v) => v !== currentValue);
		} else {
			filterValues = [...(Array.isArray(filterValues) ? filterValues : []), currentValue];
		}
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class="w-10 p-0 md:w-auto md:px-4 md:py-2">
			<div class="relative flex items-center">
				<Funnel class="h-4 w-4" /> &nbsp; Filtrar
			</div>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="mt-2 w-[200px] p-0" align="start" side="bottom">
		<Command.Root>
			<Command.Input placeholder="Filtrar por" />
			<Command.List>
				<Command.Empty>Não foram encontrados temas.</Command.Empty>
				<Command.Group>
					{#each tags as tag}
						<Command.Item
							value={tag[0]}
							onSelect={(currentValue) => {
								handleSelect(currentValue);
							}}
						>
							<div
								class={cn(
									'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
									filterValues?.includes(tag[0])
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check class="h-4 w-4" />
							</div>
							<span>
								{tag[0]}
							</span>
							<span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
								{tag[1]}
							</span>
						</Command.Item>
					{/each}
				</Command.Group>
				{#if filterValues && filterValues.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center"
						onSelect={() => {
							filterValues = [];
						}}
					>
						Limpar Filtros
					</Command.Item>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
