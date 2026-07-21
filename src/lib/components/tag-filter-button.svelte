<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '@/components//ui/button';
	import * as Command from '@/components//ui/command';
	import * as Popover from '@/components//ui/popover';
	import { Check, Funnel } from 'lucide-svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { arrayQueryParam, stringQueryParam } from '@/utils';

	export let filterValues: string[] | null = [];
	export let tags: Map<string, number> = new Map();

	const theme = queryParam('theme', arrayQueryParam());
	const page = queryParam('page', stringQueryParam());

	let open = false;

	function handleSelect(currentValue: string) {
		if (Array.isArray(filterValues) && filterValues.includes(currentValue)) {
			filterValues = filterValues.filter((v) => v !== currentValue);
		} else {
			filterValues = [...(Array.isArray(filterValues) ? filterValues : []), currentValue];
		}
	}

	function customFilter(
    commandValue: string,
    search: string,
    commandKeywords?: string[]
  ): number {
		commandValue = commandValue.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
		search = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
		return commandValue.includes(search) ? 1 : 0;
  }
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class="flex-none min-w-10 text-base text-brand-blue border-brand-border rounded-lg px-4 py-2">
			<div class="relative flex items-center">
				<Funnel class="h-4 w-4" /> &nbsp; Filtrar
			</div>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="mt-2 w-[350px] p-0 rounded-lg border border-brand-border" align="start" side="bottom">
		<Command.Root filter={customFilter}>
			<Command.Input placeholder="Filtrar por" />
			<Command.List>
				{#if filterValues && filterValues.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center rounded-none shadow-sm"
						onSelect={() => {
							filterValues = [];
							theme.set([]);
							page.set('1');
						}}
					>
						Limpar Filtros
					</Command.Item>
				{/if}
				<Command.Empty>Não foram encontrados temas.</Command.Empty>
				<Command.Group>
					{#each tags as tag}
						<Command.Item
							value={tag[0]}
							onSelect={(currentValue) => {
								handleSelect(currentValue);
								theme.set(Array.isArray(filterValues) ? filterValues : []);
								page.set('1');
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
							<span class="ml-auto flex h-4 w-4 items-center justify-center text-xs">
								{tag[1]}
							</span>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
