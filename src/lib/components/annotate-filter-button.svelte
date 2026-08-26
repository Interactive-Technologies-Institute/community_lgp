<script lang="ts">
	import type { Theme } from '@/types/types';
	import { cn } from '$lib/utils.js';
	import { Button } from '@/components/ui/button';
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Command from '@/components/ui/command';
	import * as Popover from '@/components/ui/popover';
	import { Check, ChevronDown, ChevronRight, Funnel } from 'lucide-svelte';

	export let filterValues: string[] | null = [];
	export let themes: Theme[] = [];

	type ThemeBranch = {
		parent: Theme;
		children: Theme[];
	};

	type DictionaryGroup = {
		dictionary: string;
		branches: ThemeBranch[];
	};

	let open = false;
	let filterSearch = '';
	let openDictionaries: Record<string, boolean> = {};
	let openThemes: Record<number, boolean> = {};

	$: selectedThemes = Array.isArray(filterValues) ? filterValues : [];
	$: themeHierarchy = createThemeHierarchy(themes);
	$: filteredHierarchy = filterThemeHierarchy(themeHierarchy, filterSearch);

	function normalize(value: string) {
		return value
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();
	}

	function createThemeHierarchy(themeOptions: Theme[]): DictionaryGroup[] {
		const themesByDictionary = new Map<string, Theme[]>();

		for (const theme of themeOptions) {
			const dictionary = theme.dictionary.trim();
			if (!dictionary || !theme.name) continue;

			const dictionaryThemes = themesByDictionary.get(dictionary) ?? [];
			dictionaryThemes.push(theme);
			themesByDictionary.set(dictionary, dictionaryThemes);
		}

		return [...themesByDictionary.entries()]
			.sort(([first], [second]) => first.localeCompare(second, 'pt'))
			.map(([dictionary, dictionaryThemes]) => {
				const parentThemes = dictionaryThemes
					.filter((theme) => theme.is_parent === true)
					.sort((first, second) => (first.name ?? '').localeCompare(second.name ?? '', 'pt'));
				const subThemes = dictionaryThemes.filter((theme) => theme.is_parent !== true);

				return {
					dictionary,
					branches: parentThemes.map((parent) => ({
						parent,
						children: subThemes
							.filter(
								(child) =>
									child.parent === parent.name ||
									(!!child.name && (parent.children ?? []).includes(child.name))
							)
							.sort((first, second) => (first.name ?? '').localeCompare(second.name ?? '', 'pt')),
					})),
				};
			})
			.filter((group) => group.branches.length > 0);
	}

	function filterThemeHierarchy(
		hierarchy: DictionaryGroup[],
		searchValue: string
	): DictionaryGroup[] {
		const search = normalize(searchValue.trim());
		if (!search) return hierarchy;

		return hierarchy.flatMap((group) => {
			if (normalize(group.dictionary).includes(search)) return [group];

			const branches = group.branches.flatMap((branch) => {
				if (normalize(branch.parent.name ?? '').includes(search)) return [branch];

				const children = branch.children.filter((child) =>
					normalize(child.name ?? '').includes(search)
				);

				return children.length > 0 ? [{ ...branch, children }] : [];
			});

			return branches.length > 0 ? [{ ...group, branches }] : [];
		});
	}

	function toggleTheme(themeId: string) {
		filterValues = selectedThemes.includes(themeId)
			? selectedThemes.filter((id) => id !== themeId)
			: [...selectedThemes, themeId];
	}

	function completeBranch(parentId: number) {
		for (const group of themeHierarchy) {
			const branch = group.branches.find((candidate) => candidate.parent.id === parentId);
			if (branch) return branch;
		}

		return null;
	}

	function toggleParentTheme(branch: ThemeBranch) {
		const complete = completeBranch(branch.parent.id) ?? branch;
		const parentId = String(complete.parent.id);
		const branchIds = [complete.parent, ...complete.children].map((theme) => String(theme.id));

		filterValues = selectedThemes.includes(parentId)
			? selectedThemes.filter((id) => !branchIds.includes(id))
			: Array.from(new Set([...selectedThemes, ...branchIds]));
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
				{#if selectedThemes.length > 0}
					<span
						class="ml-2 flex min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1.5 py-0.5 text-xs font-bold text-brand-dark"
					>
						{selectedThemes.length}
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
			<Command.Input bind:value={filterSearch} placeholder="Pesquisar temas..." />
			<Command.List>
				{#if selectedThemes.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center rounded-none text-center shadow-sm"
						onSelect={() => (filterValues = [])}
					>
						Limpar Filtros
					</Command.Item>
				{/if}

				{#if filteredHierarchy.length === 0}
					<div class="py-6 text-center text-sm">Não foram encontrados temas.</div>
				{:else}
					<Command.Group>
						{#each filteredHierarchy as group (group.dictionary)}
							<div class="rounded-md px-1 py-1">
								<Collapsible.Root
									bind:open={openDictionaries[group.dictionary]}
								>
									<Collapsible.Trigger
										class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-accent"
									>
										<span class="flex flex-1 text-sm font-semibold">{group.dictionary}</span>
										{#if openDictionaries[group.dictionary]}
											<ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
										{:else if !openDictionaries[group.dictionary]}
											<ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground" />
										{/if}
									</Collapsible.Trigger>

									<Collapsible.Content>
										<div class="ml-3 space-y-1 border-l border-brand-border pl-2">
											{#each group.branches as branch (branch.parent.id)}
												<Collapsible.Root
													bind:open={openThemes[branch.parent.id]}
												>
													<div class="flex items-center rounded-sm hover:bg-accent">
														<button
															type="button"
															role="checkbox"
															aria-checked={selectedThemes.includes(String(branch.parent.id))}
															aria-label="Selecionar {branch.parent.name} e os seus subtemas"
															class={cn(
																'ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue',
																selectedThemes.includes(String(branch.parent.id))
																	? 'bg-brand-blue text-white'
																	: 'bg-background'
															)}
															on:click={() => toggleParentTheme(branch)}
														>
															{#if selectedThemes.includes(String(branch.parent.id))}
																<Check class="h-3 w-3" />
															{/if}
														</button>

														<Collapsible.Trigger
															class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left"
														>
															<span class="flex-1 truncate text-sm font-semibold">
																{branch.parent.name}
															</span>
															{#if branch.children.length > 0}
																{#if openThemes[branch.parent.id]}
																	<ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
																{:else if !openThemes[branch.parent.id]}
																	<ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground" />
																{/if}
															{/if}
														</Collapsible.Trigger>
													</div>

													{#if branch.children.length > 0}
														<Collapsible.Content>
															<div class="ml-8 space-y-1 border-l border-brand-border pl-4">
																{#each branch.children as child (child.id)}
																	<Command.Item
																		value={`theme-${child.id}`}
																		class="flex items-center gap-2"
																		onSelect={() => toggleTheme(String(child.id))}
																	>
																		<span
																			class={cn(
																				'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue',
																				selectedThemes.includes(String(child.id))
																					? 'bg-brand-blue text-white'
																					: 'bg-background'
																			)}
																		>
																			{#if selectedThemes.includes(String(child.id))}
																				<Check class="h-3 w-3" />
																			{/if}
																		</span>
																		<span class="text-sm">{child.name}</span>
																	</Command.Item>
																{/each}
															</div>
														</Collapsible.Content>
													{/if}
												</Collapsible.Root>
											{/each}
										</div>
									</Collapsible.Content>
								</Collapsible.Root>
							</div>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
