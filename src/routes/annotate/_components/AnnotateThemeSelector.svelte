<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Theme } from '@/types/types';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import Badge from '@/components/ui/badge/badge.svelte';
	import * as Collapsible from '@/components/ui/collapsible';
	import {
		BookOpen,
		Check,
		ChevronDown,
		ChevronRight,
		Loader2,
		Plus,
		Search,
		Trash2,
		X,
	} from 'lucide-svelte';

	export let themes: Theme[] = [];
	export let dictionaries: string[] = [];
	export let selectedThemeIds: string[] = [];

	const dispatch = createEventDispatcher<{
		change: { themeIds: string[] };
	}>();

	type ThemeBranch = {
		parent: Theme;
		normalizedParentName: string;
		children: Theme[];
		normalizedChildNames: string[];
	};

	let themeOptions = [...themes];
	let addDictionaryOpen = false;
	let dictionaryName = '';
	let firstParentName = '';
	let searchByDictionary: Record<string, string> = {};
	let expandedDictionaries: Record<string, boolean> = {};
	let newParentByDictionary: Record<string, string> = {};
	let newChildByParent: Record<number, string> = {};
	let addingParentFor: string | null = null;
	let addingChildFor: number | null = null;
	let savingKey: string | null = null;
	let errorMessage = '';
	let openThemes: Record<number, boolean> = {};

	function dictionaryForValue(value: string) {
		const theme = themeOptions.find((option) => String(option.id) === value);
		return theme?.dictionary ?? null;
	}

	const initialDictionaries = Array.from(
		new Set(selectedThemeIds.map(dictionaryForValue).filter((value): value is string => !!value))
	);

	let associatedDictionaries = initialDictionaries;

	$: availableDictionaries = Array.from(
		new Set(
			[
				...dictionaries,
				...themeOptions
					.map((theme) => theme.dictionary)
					.filter((value): value is string => !!value),
			]
				.map((dictionary) => dictionary.trim())
				.filter(Boolean)
		)
	).sort((a, b) => a.localeCompare(b, 'pt'));
	$: unassociatedDictionaries = availableDictionaries.filter(
		(dictionary) => !associatedDictionaries.includes(dictionary)
	);
	$: selectedThemes = selectedThemeIds
		.map((id) => themeOptions.find((theme) => String(theme.id) === id))
		.filter((theme): theme is Theme => !!theme);
	$: themeBranchesByDictionary = buildThemeBranches(themeOptions);

	function normalizeSearchValue(value: string) {
		return value
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLocaleLowerCase('pt');
	}

	function buildThemeBranches(options: Theme[]) {
		const themesByDictionary = new Map<string, Theme[]>();

		for (const theme of options) {
			if (!theme.dictionary) continue;
			const dictionaryThemes = themesByDictionary.get(theme.dictionary) ?? [];
			dictionaryThemes.push(theme);
			themesByDictionary.set(theme.dictionary, dictionaryThemes);
		}

		const branchesByDictionary: Record<string, ThemeBranch[]> = {};
		for (const [dictionary, dictionaryThemes] of themesByDictionary) {
			const parents = dictionaryThemes
				.filter((theme) => theme.is_parent)
				.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'pt'));
			const children = dictionaryThemes.filter((theme) => !theme.is_parent);
			const childrenByParent = new Map<string, Theme[]>();
			const childrenByName = new Map<string, Theme[]>();

			for (const child of children) {
				if (child.parent) {
					const parentChildren = childrenByParent.get(child.parent) ?? [];
					parentChildren.push(child);
					childrenByParent.set(child.parent, parentChildren);
				}
				if (child.name) {
					const namedChildren = childrenByName.get(child.name) ?? [];
					namedChildren.push(child);
					childrenByName.set(child.name, namedChildren);
				}
			}

			branchesByDictionary[dictionary] = parents.map((parent) => {
				const branchChildren = new Map<number, Theme>();
				for (const child of childrenByParent.get(parent.name ?? '') ?? []) {
					branchChildren.set(child.id, child);
				}
				for (const childName of parent.children ?? []) {
					for (const child of childrenByName.get(childName) ?? []) {
						branchChildren.set(child.id, child);
					}
				}

				const sortedChildren = [...branchChildren.values()].sort((a, b) =>
					(a.name ?? '').localeCompare(b.name ?? '', 'pt')
				);
				return {
					parent,
					normalizedParentName: normalizeSearchValue(parent.name ?? ''),
					children: sortedChildren,
					normalizedChildNames: sortedChildren.map((child) =>
						normalizeSearchValue(child.name ?? '')
					),
				};
			});
		}

		return branchesByDictionary;
	}

	function filteredThemeBranches(dictionary: string, searchValue: string) {
		const branches = themeBranchesByDictionary[dictionary] ?? [];
		const search = normalizeSearchValue(searchValue.trim());
		if (!search) return branches;

		return branches.flatMap((branch) => {
			if (branch.normalizedParentName.startsWith(search)) return [branch];

			const matchingChildren = branch.children.filter((_, index) =>
				branch.normalizedChildNames[index].startsWith(search)
			);
			return matchingChildren.length > 0 ? [{ ...branch, children: matchingChildren }] : [];
		});
	}

	function childrenFor(parent: Theme) {
		return (
			themeBranchesByDictionary[parent.dictionary ?? '']?.find(
				(branch) => branch.parent.id === parent.id
			)?.children ?? []
		);
	}

	function updateDictionarySearch(dictionary: string, event: Event) {
		const input = event.target as HTMLInputElement;
		searchByDictionary = { ...searchByDictionary, [dictionary]: input.value };
	}

	function updateChildName(parentId: number, event: Event) {
		const input = event.target as HTMLInputElement;
		newChildByParent = { ...newChildByParent, [parentId]: input.value };
	}

	function setSelection(nextSelection: string[]) {
		selectedThemeIds = Array.from(new Set(nextSelection));
		dispatch('change', { themeIds: selectedThemeIds });
	}

	function toggleParent(parent: Theme) {
		const parentThemeId = String(parent.id);
		const childThemeIds = childrenFor(parent).map((child) => String(child.id));
		const parentSelected = selectedThemeIds.includes(parentThemeId);
		setSelection(
			parentSelected
				? selectedThemeIds.filter((id) => id !== parentThemeId)
				: [...selectedThemeIds.filter((id) => !childThemeIds.includes(id)), parentThemeId]
		);
	}

	function toggleChild(parent: Theme, child: Theme) {
		const parentId = String(parent.id);
		const childId = String(child.id);
		const withoutParent = selectedThemeIds.filter((id) => id !== parentId);
		setSelection(
			withoutParent.includes(childId)
				? withoutParent.filter((id) => id !== childId)
				: [...withoutParent, childId]
		);
	}

	function parentIsSelected(parent: Theme) {
		return selectedThemeIds.includes(String(parent.id));
	}

	function parentFor(theme: Theme) {
		if (theme.is_parent) return null;
		return themeOptions.find(
			(option) =>
				option.dictionary === theme.dictionary &&
				option.is_parent &&
				(theme.parent === option.name ||
					(!!theme.name && (option.children ?? []).includes(theme.name)))
		);
	}

	function selectionLabel(theme: Theme) {
		const parent = parentFor(theme);
		return [theme.dictionary, parent?.name, theme.name].filter(Boolean).join(' › ');
	}

	function associateDictionary(dictionary: string) {
		if (!associatedDictionaries.includes(dictionary)) {
			associatedDictionaries = [...associatedDictionaries, dictionary];
		}
		addDictionaryOpen = false;
	}

	function removeDictionary(dictionary: string) {
		const dictionaryThemeIds = themeOptions
			.filter((theme) => theme.dictionary === dictionary)
			.map((theme) => String(theme.id));
		associatedDictionaries = associatedDictionaries.filter((item) => item !== dictionary);
		setSelection(selectedThemeIds.filter((id) => !dictionaryThemeIds.includes(id)));
	}

	async function createTheme(dictionary: string, name: string, parent: string | null) {
		const response = await fetch('/api/themes', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ dictionary, name, parent }),
		});
		const result = (await response.json()) as { theme?: Theme; message?: string };
		if (!response.ok || !result.theme) {
			throw new Error(result.message ?? 'Não foi possível criar o tema.');
		}
		if (!themeOptions.some((theme) => theme.id === result.theme?.id)) {
			themeOptions = [...themeOptions, result.theme];
		}
		return result.theme;
	}

	async function addParent(dictionary: string) {
		const name = (newParentByDictionary[dictionary] ?? '').trim();
		if (!name) return;
		savingKey = `parent-${dictionary}`;
		errorMessage = '';
		try {
			const theme = await createTheme(dictionary, name, null);
			newParentByDictionary = { ...newParentByDictionary, [dictionary]: '' };
			addingParentFor = null;
			setSelection([...selectedThemeIds, String(theme.id)]);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o tema.';
		} finally {
			savingKey = null;
		}
	}

	async function addChild(parent: Theme) {
		const name = (newChildByParent[parent.id] ?? '').trim();
		if (!name || !parent.dictionary || !parent.name) return;
		savingKey = `child-${parent.id}`;
		errorMessage = '';
		try {
			const theme = await createTheme(parent.dictionary, name, parent.name);
			newChildByParent = { ...newChildByParent, [parent.id]: '' };
			addingChildFor = null;
			toggleChild(parent, theme);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Não foi possível criar o subtema.';
		} finally {
			savingKey = null;
		}
	}

	async function addDictionary() {
		const dictionary = dictionaryName.trim();
		const parent = firstParentName.trim();
		if (!dictionary || !parent) return;
		savingKey = 'dictionary';
		errorMessage = '';
		try {
			const theme = await createTheme(dictionary, parent, null);
			dictionaryName = '';
			firstParentName = '';
			associateDictionary(theme.dictionary ?? dictionary);
			setSelection([...selectedThemeIds, String(theme.id)]);
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Não foi possível criar o dicionário.';
		} finally {
			savingKey = null;
		}
	}
</script>

<div class="flex w-full flex-col gap-3">
	<!-- Label and Button -->
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div>
			<p class="text-base font-semibold text-brand-grey">Dicionário e Temas</p>
			<p class="text-sm text-brand-grey">
				Associe o gesto a um ou mais dicionários e escolha os respetivos temas.
			</p>
		</div>
		<Button
			variant="outline"
			class="border-brand-blue text-brand-blue"
			on:click={() => (addDictionaryOpen = !addDictionaryOpen)}
		>
			<Plus class="mr-2 h-4 w-4" />
			{associatedDictionaries.length === 0
		? 'Associar dicionário'
		: 'Associar outro dicionário'}
		</Button>
	</div>

	<!-- Associate Dictionary Button Popup -->
	{#if addDictionaryOpen}
		<div class="rounded-lg border border-brand-border bg-brand-surface p-3">
			{#if unassociatedDictionaries.length > 0}
				<p class="mb-2 text-sm font-semibold text-brand-grey">Dicionários existentes</p>
				<div class="mb-4 flex flex-wrap gap-2">
					{#each unassociatedDictionaries as dictionary}
						<Button variant="outline" size="sm" on:click={() => associateDictionary(dictionary)}>
							<BookOpen class="mr-2 h-4 w-4" />{dictionary}
						</Button>
					{/each}
				</div>
			{/if}
			<p class="mb-2 text-sm font-semibold text-brand-grey">Novo dicionário</p>
			<p class="mb-2 text-xs text-muted-foreground">
				Crie um dicionário com o primeiro tema principal.
			</p>
			<div class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
				<Input bind:value={dictionaryName} placeholder="Nome do dicionário" />
				<Input bind:value={firstParentName} placeholder="Primeiro tema principal" />
				<Button
					on:click={addDictionary}
					disabled={!dictionaryName.trim() || !firstParentName.trim() || savingKey === 'dictionary'}
				>
					{#if savingKey === 'dictionary'}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Criar
				</Button>
			</div>
		</div>
	{/if}

	<!-- Selected Themes Show -->
	{#if selectedThemes.length > 0}
		<div class="flex flex-wrap gap-2" aria-label="Temas selecionados">
			{#each selectedThemes as theme (theme.id)}
				<Badge
					variant="outline"
					class="flex gap-2 rounded-full border-brand-border bg-brand-surface px-3 py-1 text-sm"
				>
					{selectionLabel(theme)}
					<button
						type="button"
						class="rounded-full text-muted-foreground hover:text-destructive"
						aria-label="Remover {theme.name}"
						on:click={() => setSelection(selectedThemeIds.filter((id) => id !== String(theme.id)))}
					>
						<X class="h-3.5 w-3.5" />
					</button>
				</Badge>
			{/each}
		</div>
	{/if}

	<!-- Dictionary themes selection -->
	{#each associatedDictionaries as dictionary (dictionary)}
		<Collapsible.Root
			class="rounded-xl border border-brand-border bg-background"
			open={expandedDictionaries[dictionary] ?? true}
			onOpenChange={(open) =>
				(expandedDictionaries = { ...expandedDictionaries, [dictionary]: open })}
		>
			<!-- Dictionary info -->
			<div class="flex items-center gap-3">
				<Collapsible.Trigger
					class="flex flex-1 items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-brand-dark dark:text-foreground"
				>
					<span class="flex items-center gap-2">
						Dicionário {dictionary}
						<span class="text-xs font-normal text-muted-foreground">
							{selectedThemes.filter((theme) => theme.dictionary === dictionary).length} selecionado(s)
						</span>
					</span>
					<ChevronDown
						class="h-4 w-4 shrink-0 transition-transform {expandedDictionaries[dictionary]
							? 'rotate-180'
							: ''}"
					/>
				</Collapsible.Trigger>
				<button
					type="button"
					class="mr-4 text-muted-foreground disabled:cursor-not-allowed disabled:opacity-30"
					aria-label="Remover dicionário {dictionary}"
					on:click={() => removeDictionary(dictionary)}
				>
					<Trash2 class="h-4 w-4" />
				</button>
			</div>

			<!-- Dictionary Themes -->
			<Collapsible.Content class="space-y-3 border-t border-brand-border p-4">
					<div class="relative">
						<Search class="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							value={searchByDictionary[dictionary] ?? ''}
							class="pl-9"
							placeholder="Pesquisar temas em {dictionary}"
							on:input={(event) => updateDictionarySearch(dictionary, event)}
						/>
					</div>

					<!-- Parent Theme -->
					<div class="space-y-1 max-h-[300px] overflow-y-auto">
						{#each filteredThemeBranches(dictionary, searchByDictionary[dictionary] ?? '') as branch (branch.parent.id)}
							<Collapsible.Root
								class="rounded-md px-1 py-1 hover:bg-brand-surface/70"
								open={openThemes[branch.parent.id] ?? false}
								onOpenChange={(open) =>
									(openThemes = { ...openThemes, [branch.parent.id]: open })}
							>
								<div class="flex items-center gap-2 w-full">
                  <Collapsible.Trigger class="flex flex-1 items-center gap-2 text-left">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selectedThemeIds.includes(String(branch.parent.id))}
                      aria-label="Selecionar tema {branch.parent.name}"
                      class="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-brand-blue {selectedThemeIds.includes(String(branch.parent.id))
                        ? 'bg-brand-blue text-white'
                        : 'bg-background'}"
                      on:click={() => toggleParent(branch.parent)}
                    >
                      {#if selectedThemeIds.includes(String(branch.parent.id))}<Check class="h-3 w-3" />{/if}
                    </button>
										<span class="flex flex-1 w-full text-sm font-semibold">{branch.parent.name}</span>
										<ChevronRight
											class="h-4 w-4 text-muted-foreground transition-transform {openThemes[
												branch.parent.id
											]
												? 'rotate-90'
												: ''}"
										/>
									</Collapsible.Trigger>
								</div>

								<!-- Children Theme -->
								<Collapsible.Content>
									<div class="ml-8 mt-1 space-y-1 border-l border-brand-border pl-4">
										{#each branch.children as child (child.id)}
											<button
												type="button"
                        role="checkbox"
                        aria-checked={selectedThemeIds.includes(String(child.id))}
                        class="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm hover:bg-brand-surface"
                        on:click={() => toggleChild(branch.parent, child)}
                      >
                        <span
                          class="flex h-4 w-4 items-center justify-center rounded-sm border border-brand-blue {selectedThemeIds.includes(
                            String(child.id)
                          )
                            ? 'bg-brand-blue text-white'
                            : 'bg-background'}"
                        >
                          {#if selectedThemeIds.includes(String(child.id))}<Check
                              class="h-3 w-3"
                            />{/if}
                        </span>
												{child.name}
											</button>
										{/each}

										{#if !(searchByDictionary[dictionary] ?? '').trim() && addingChildFor === branch.parent.id}
										<div class="flex gap-2 py-1">
											<Input
												value={newChildByParent[branch.parent.id] ?? ''}
												placeholder="Nome do subtema"
												on:input={(event) => updateChildName(branch.parent.id, event)}
											/>
											<Button
												size="sm"
												disabled={!(newChildByParent[branch.parent.id] ?? '').trim() ||
													savingKey === `child-${branch.parent.id}`}
												on:click={() => addChild(branch.parent)}
											>
												{#if savingKey === `child-${branch.parent.id}`}<Loader2
														class="h-4 w-4 animate-spin"
													/>{:else}Adicionar{/if}
											</Button>
										</div>
									{:else if !(searchByDictionary[dictionary] ?? '').trim()}
										<button
											type="button"
											class="flex items-center gap-2 px-1 py-1 text-sm text-brand-blue"
											on:click={() => (addingChildFor = branch.parent.id)}
										>
											<Plus class="h-4 w-4" /> Novo subtema em {branch.parent.name}
										</button>
										{/if}
									</div>
								</Collapsible.Content>
							</Collapsible.Root>
						{:else}
							<p class="py-4 text-center text-sm text-muted-foreground">
								Não foram encontrados temas.
							</p>
						{/each}
					</div>

					{#if !(searchByDictionary[dictionary] ?? '').trim() && addingParentFor === dictionary}
						<div class="flex gap-2">
							<Input
								value={newParentByDictionary[dictionary] ?? ''}
								placeholder="Nome do tema principal"
								on:input={(event) =>
									(newParentByDictionary = {
										...newParentByDictionary,
										[dictionary]: event.currentTarget.value,
									})}
							/>
							<Button
								disabled={!(newParentByDictionary[dictionary] ?? '').trim() ||
									savingKey === `parent-${dictionary}`}
								on:click={() => addParent(dictionary)}
							>
								{#if savingKey === `parent-${dictionary}`}<Loader2
										class="h-4 w-4 animate-spin"
									/>{:else}Adicionar{/if}
							</Button>
						</div>
					{:else if !(searchByDictionary[dictionary] ?? '').trim()}
						<button
							type="button"
							class="flex items-center gap-2 text-sm text-brand-blue"
							on:click={() => (addingParentFor = dictionary)}
						>
							<Plus class="h-4 w-4" /> Novo tema em {dictionary}
						</button>
					{/if}
			</Collapsible.Content>
		</Collapsible.Root>
	{/each}

	{#if associatedDictionaries.length === 0}
		<p
			class="rounded-lg border border-dashed border-brand-border p-4 text-sm text-muted-foreground"
		>
			Nenhum dicionário ou tema associado.
		</p>
	{/if}

	{#if errorMessage}
		<p class="text-sm text-destructive" role="alert">{errorMessage}</p>
	{/if}
</div>
