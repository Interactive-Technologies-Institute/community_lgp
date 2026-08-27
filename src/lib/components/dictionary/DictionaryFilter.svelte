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

	type ThemeBranch = {
		parentName: string;
		children: string[];
	};

	$: selectedThemes = Array.isArray(filterValues) ? filterValues : [];
	$: selectedDistricts = Array.isArray(districtFilterValues) ? districtFilterValues : [];
	$: showDistricts = districts instanceof Map && districts.size > 0;
	$: activeFilterCount = selectedThemes.length + (showDistricts ? selectedDistricts.length : 0);
	$: activeSectionFilterCount =
		activeSection === 'themes' || !showDistricts ? selectedThemes.length : selectedDistricts.length;
	$: filteredThemeBranches = filterThemeBranches(tags, filterSearch);
	$: filteredDistricts = filterDistrictOptions(districts, filterSearch);

	function toggleValue(values: string[], value: string) {
		return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
	}

	function handleThemeSelect(value: string) {
		filterValues = toggleValue(selectedThemes, value);
		page.set('1');
	}

	function handleParentThemeSelect(parentName: string) {
		const children = tags.get(parentName) ?? [];
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

	function normalize(value: string) {
		return value
			.trim()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();
	}

	function filterThemeBranches(themeOptions: Map<string, string[]>, searchValue: string) {
		const search = normalize(searchValue);
		const branches: ThemeBranch[] = [];

		for (const [parentName, children] of themeOptions) {
			if (!search || normalize(parentName).includes(search)) {
				branches.push({ parentName, children });
				continue;
			}

			const matchingChildren = children.filter((childName) =>
				normalize(childName).includes(search)
			);

			if (matchingChildren.length > 0) {
				branches.push({ parentName, children: matchingChildren });
			}
		}

		return branches;
	}

	function filterDistrictOptions(
		districtOptions: Map<string, number> | null | undefined,
		searchValue: string
	) {
		if (!(districtOptions instanceof Map)) return [];

		const search = normalize(searchValue);
		return [...districtOptions].filter(
			([districtName]) => !search || normalize(districtName).includes(search)
		);
	}

	function selectedChildCount(children: string[]) {
		return children.filter((childName) => selectedThemes.includes(childName)).length;
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
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			class="min-w-10 flex-none rounded-lg border-brand-border px-4 py-2 text-base text-brand-blue"
		>
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
	<Popover.Content
		class="mt-2 w-[350px] rounded-lg border border-brand-border p-0"
		align="start"
		side="bottom"
	>
		<Command.Root shouldFilter={false}>
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
				{#if activeSectionFilterCount > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center rounded-none text-center shadow-sm"
						onSelect={clearFilters}
					>
						Limpar Filtros
					</Command.Item>
				{/if}

				{#if activeSection === 'themes' || !showDistricts}
					{#if filteredThemeBranches.length === 0}
						<div class="py-6 text-center text-sm">Não foram encontrados temas.</div>
					{:else}
						<Command.Group>
							{#each filteredThemeBranches as { parentName, children } (parentName)}
								<div class="rounded-md px-1 py-1">
									<Collapsible.Root
										bind:open={openThemes[parentName]}
									>
										<!-- Parent Theme -->
										<div
											class={cn(
												'flex w-full items-center rounded-sm hover:bg-accent',
													selectedChildCount(tags.get(parentName) ?? []) > 0
													? 'bg-brand-blue/5'
													: ''
											)}
										>
											<button
												type="button"
												role="checkbox"
												aria-checked={selectedThemes.includes(parentName)}
												aria-label="Selecionar {parentName} e os seus subtemas"
												class={cn(
													'ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue',
													selectedThemes.includes(parentName)
														? 'bg-brand-blue text-white'
														: 'bg-background'
												)}
												on:click={() => handleParentThemeSelect(parentName)}
											>
												{#if selectedThemes.includes(parentName)}
													<Check class="h-3 w-3" />
												{/if}
											</button>

											<Collapsible.Trigger
												class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left"
											>
												<span class="min-w-0 flex-1 truncate text-sm font-semibold">
													{parentName}
												</span>
												{#if selectedChildCount(tags.get(parentName) ?? []) > 0}
													<span
														class="shrink-0 rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-medium text-brand-blue"
														aria-label={`${selectedChildCount(tags.get(parentName) ?? [])} subtemas selecionados`}
													>
														{selectedChildCount(tags.get(parentName) ?? [])} selecionado{selectedChildCount(
															tags.get(parentName) ?? []
														) === 1
															? ''
															: 's'}
													</span>
												{/if}
												{#if children.length > 0 && !openThemes[parentName]}
													<ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground" />
												{:else if children.length > 0 && openThemes[parentName]}
													<ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
												{/if}
											</Collapsible.Trigger>
										</div>

										<!-- Children Themes -->
										<Collapsible.Content>
											{#if children.length > 0}
												<div class="ml-8 space-y-1 border-l border-brand-border pl-4">
													{#each children as childName}
														<Command.Item
															value={`${parentName}:${childName}`}
															class="flex items-center gap-2"
															onSelect={() => handleThemeSelect(childName)}
														>
															<button
																type="button"
																role="checkbox"
																aria-checked={selectedThemes.includes(childName)}
																aria-label="Selecionar subtema {childName}"
																class={cn(
																	'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue',
																	selectedThemes.includes(childName)
																		? 'bg-brand-blue text-white'
																		: 'bg-background'
																)}
																on:click|stopPropagation={() => handleThemeSelect(childName)}
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
					{/if}
				{:else if districts}
					{#if filteredDistricts.length === 0}
						<div class="py-6 text-center text-sm">Não foram encontrados distritos.</div>
					{:else}
						<Command.Group>
							{#each filteredDistricts as [districtName, count] (districtName)}
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
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
