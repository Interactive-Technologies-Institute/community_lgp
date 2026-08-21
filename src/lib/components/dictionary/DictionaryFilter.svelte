<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '@/components//ui/button';
	import * as Command from '@/components//ui/command';
	import * as Popover from '@/components//ui/popover';
	import { Check, Funnel } from 'lucide-svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { stringQueryParam } from '@/utils';

	export let filterValues: string[] | null = [];
  export let districtFilterValues: string[] | null = [];

	export let tags: Map<string, number> = new Map();
  export let districts: Map<string, number> | null | undefined = undefined;

	const page = queryParam('page', stringQueryParam());

	let open = false;
  let activeSection: 'themes' | 'districts' = 'themes';
	let filterSearch = '';

  $: selectedThemes = Array.isArray(filterValues) ? filterValues : [];
	$: selectedDistricts = Array.isArray(districtFilterValues) ? districtFilterValues : [];
	$: showDistricts = districts instanceof Map && districts.size > 0;
	$: activeFilterCount = selectedThemes.length + (showDistricts ? selectedDistricts.length : 0);

	function toggleValue(values: string[], value: string) {
		return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
	}

	function handleThemeSelect(value: string) {
		filterValues = toggleValue(selectedThemes, value);
		page.set('1');
	}

	function handleDistrictSelect(value: string) {
		districtFilterValues = toggleValue(selectedDistricts, value);
		page.set('1');
	}

	function selectSection(section: 'themes' | 'districts') {
		activeSection = section;
		filterSearch = '';
	}

	function clearFilters() {
		if (activeSection == "themes") {
			filterValues = [];
		}

		else {
			if (showDistricts) districtFilterValues = [];
		}
		page.set('1');
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
        {#if activeFilterCount > 0}
					<span
						class="ml-2 flex min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1.5 py-0.5 text-xs font-bold text-brand-dark"
					>
						{activeFilterCount}
					</span>
				{/if}
			</div>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="mt-2 w-[400px] p-0 rounded-lg border border-brand-border" align="start" side="bottom">
		<Command.Root filter={customFilter}>
      {#if showDistricts}
				<div class="grid grid-cols-2 gap-1 border-b border-brand-border p-2">
					<button
						type="button"
						class={cn(
							'rounded-md px-3 py-2 text-sm font-medium transition-colors',
							activeSection === 'themes'
								? 'bg-brand-border text-foreground shadow-sm'
								: 'bg-background text-foreground hover:bg-brand-border/20'
						)}
						on:click={() => selectSection('themes')}
					>
						Temas{selectedThemes.length ? ` (${selectedThemes.length})` : ''}
					</button>
					<button
						type="button"
						class={cn(
							'rounded-md px-3 py-2 text-sm font-medium transition-colors',
							activeSection === 'districts'
								? 'bg-brand-yellow/70 text-foreground shadow-sm'
								: 'bg-background text-foreground hover:bg-brand-yellow/20'
						)}
						on:click={() => selectSection('districts')}
					>
						Distritos ou Regiões{selectedDistricts.length ? ` (${selectedDistricts.length})` : ''}
					</button>
				</div>
			{/if}

			<Command.Input 
        bind:value={filterSearch}
				placeholder={showDistricts
					? activeSection === 'themes'
						? 'Pesquisar temas...'
						: 'Pesquisar distritos...'
					: 'Filtrar por'}
      />
			<Command.List>
				{#if activeFilterCount > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center rounded-none text-center shadow-sm"
						onSelect={clearFilters}
					>
						Limpar Filtros
					</Command.Item>
				{/if}

				<Command.Empty>
          {activeSection === 'themes'
						? 'Não foram encontrados temas.'
						: 'Não foram encontrados distritos.'}
        </Command.Empty>

        {#if activeSection === 'themes' || !showDistricts}
				<Command.Group>
					{#each tags as tag}
						<Command.Item
							value={tag[0]}
							onSelect={() => {
								handleThemeSelect(tag[0]);
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
        {:else if districts}
					<Command.Group>
						{#each districts as [districtName, count]}
							<Command.Item
								value={districtName}
								onSelect={() => handleDistrictSelect(districtName)}
							>
								<div
									class={cn(
										'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
										selectedDistricts.includes(districtName)
											? 'bg-primary text-primary-foreground'
											: 'opacity-50 [&_svg]:invisible'
									)}
								>
									<Check class="h-4 w-4" />
								</div>
								<span>{districtName}</span>
								<span class="ml-auto flex min-w-6 items-center justify-center text-xs">
									{count}
								</span>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
