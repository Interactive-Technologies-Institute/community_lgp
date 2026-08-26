<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '@/components/ui/button';
	import * as Command from '@/components/ui/command';
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Popover from '@/components/ui/popover';
	import { Check, ChevronRight, ChevronDown, Funnel } from 'lucide-svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { stringQueryParam } from '@/utils';

	export let filterValues: string[] | null = [];
	export let districtFilterValues: string[] | null = [];
	export let tags: Map<string, string[]> = new Map();
	export let districts: Map<string, number> | null | undefined = undefined;

	const page = queryParam('page', stringQueryParam());

	let open = false;
	let openThemes: Record<string, boolean> = {};
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

	function handleParentThemeSelect(parentName: string, children: string[]) {
		const branchThemes = [parentName, ...children];
		const parentSelected = selectedThemes.includes(parentName);

		if (parentSelected) {
			// Deselect the parent and all of its children
			filterValues = selectedThemes.filter(
				(theme) => !branchThemes.includes(theme)
			);
		} else {
			// Select the parent and all of its children
			filterValues = Array.from(
				new Set([...selectedThemes, ...branchThemes])
			);
		}
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

	function customFilter(commandValue: string, search: string): number {
		const normalizedValue = commandValue
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();
		const normalizedSearch = search
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();

		return normalizedValue.includes(normalizedSearch) ? 1 : 0;
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
	<Popover.Content class="mt-2 w-[350px] p-0 rounded-lg border border-brand-border" align="start" side="bottom">
		<Command.Root filter={customFilter}>
			{#if showDistricts}
				<div class="grid grid-cols-2 gap-1 border-b border-brand-border p-2">
					<button
						type="button"
						class={cn(
							'rounded-md px-3 py-2 text-sm font-medium transition-colors',
							activeSection === 'themes'
								? 'bg-brand-yellow/70 text-brand-dark shadow-sm'
								: 'bg-background text-foreground hover:bg-brand-yellow/20'
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
								? 'bg-brand-yellow/70 text-brand-dark shadow-sm'
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
						{#each tags as [parentName, children]}
							<div class="rounded-md px-1 py-1">
								<Collapsible.Root bind:open={openThemes[parentName]}>
									<!-- Parent Theme -->
									<Collapsible.Trigger class="flex flex-row items-center w-full">
										<Command.Item
											value={parentName}
											class="flex flex-1 items-center gap-2 w-full"
										>
		
											<button
												type="button"
												role="checkbox"
												class={cn(
													'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue',
													selectedThemes.includes(parentName)
													? 'bg-brand-blue text-white'
													: 'bg-background'
												)}
												on:click={() => handleParentThemeSelect(parentName, children)}
											>
												{#if selectedThemes.includes(parentName)}
												<Check class="h-3 w-3" />
												{/if}
												</button>
											
											<span class="flex flex-1 text-sm font-semibold w-full">
												{parentName}
											</span>
											{#if children.length > 0 && !openThemes[parentName]}
												<ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground" />
											{:else if children.length > 0 && openThemes[parentName]}
												<ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
											{/if}
										</Command.Item>
									</Collapsible.Trigger>
									
									<!-- Children Themes -->
									<Collapsible.Content>
										{#if children.length > 0}
										<div class="ml-8 space-y-1 border-l border-brand-border pl-4">
												{#each children as childName}
													<Command.Item
														value={childName}
														class="flex items-center gap-2"
													>
														<button
															type="button"
															role="checkbox"
															class={cn(
																'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue',
																selectedThemes.includes(childName)
																	? 'bg-brand-blue text-white'
																	: 'bg-background'
															)}
															on:click={() => handleThemeSelect(childName)}
														>
															{#if selectedThemes.includes(childName)}
																<Check class="h-3 w-3" />
															{/if}
														</button>
		
														<span class="text-sm">
															{childName}
														</span>
													</Command.Item>
												{/each}
											</div>
										{/if}
									</Collapsible.Content>
								</Collapsible.Root>
							</div>
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
