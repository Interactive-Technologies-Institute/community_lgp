<script lang="ts">
	import type { Sign, Theme } from '@/types/types';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { writable, derived } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Input } from '@/components/ui/input';
	import { ChevronLeft, ChevronRight, Search, Pencil } from 'lucide-svelte';
	import AnnotateFilterButton from '@/components/annotate-filter-button.svelte';
	import { format } from 'date-fns';
	import Badge from '@/components/ui/badge/badge.svelte';

	export let signs: Sign[];
	export let themes: Theme[] = [];

	const searchQuery = writable('');
	const selectedThemes = writable<string[]>([]);
	let searchInput = '';

	// Filter signs based on local search input
	const filteredSigns = derived(
		[searchQuery, selectedThemes],
		([$searchQuery, $selectedThemes]) => {
			const normalizedSearch = $searchQuery
				.normalize('NFD')
				.replace(/\p{Diacritic}/gu, '')
				.toLowerCase();

			return signs.filter((sign) => {
				const matchesSearch =
					normalizedSearch.trim() === '' ||
					sign.name_unaccented.toLowerCase().startsWith(normalizedSearch);

				const matchesThemes =
					$selectedThemes.length === 0 ||
					$selectedThemes.some((selectedTheme) => sign.theme.includes(selectedTheme));

				return matchesSearch && matchesThemes;
			});
		}
	);

	const table = createTable<Sign>(filteredSigns, {
		page: addPagination(),
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'Nome',
		}),
		table.column({
			accessor: 'theme',
			header: 'Temas',
		}),
		table.column({
			accessor: 'last_changed',
			header: 'Última atualização',
		}),
		table.column({
			accessor: 'is_anotated',
			header: 'Ações',
			cell: () => '',
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex, pageSize, pageCount } = pluginStates.page;

	$: currentPageNumber = $pageIndex + 1;
	$: compactPages = getCompactPages(currentPageNumber, $pageCount);
	$: previousPageDisabled = !$hasPreviousPage;
	$: nextPageDisabled = !$hasNextPage;
	$: {
		$searchQuery;
		$selectedThemes;
		$pageIndex = 0;
	}

	function applySearch() {
		searchQuery.set(searchInput);
	}

	function formatTimestamp(dateString: string) {
		return format(new Date(dateString), 'dd-MM-yyyy');
	}

	function getCompactPages(currentPage: number, totalPages: number) {
		if (totalPages <= 4) {
			return Array.from({ length: totalPages }, (_, index) => index + 1);
		}

		if (currentPage <= 2) {
			return [1, 2, 'ellipsis-end', totalPages];
		}

		if (currentPage >= totalPages - 1) {
			return [1, 'ellipsis-start', totalPages - 1, totalPages];
		}

		return [1, 'ellipsis-start', currentPage, 'ellipsis-end', totalPages];
	}

	function themeLabel(themeId: string) {
		for (const theme of themes) {
			if (theme.id === parseInt(themeId)) {
				return [theme.dictionary, theme?.parent, theme.name].filter(Boolean).join(' › ');
			}
		}
		return [];
	}
</script>

<!-- Local search bar -->
<div class="flex w-full min-w-0 flex-1 flex-col gap-4 pt-2 lg:flex-row lg:gap-10">
	<div class="flex flex-1">
		<Input
			placeholder="Procurar por nome..."
			class="flex h-10 min-w-0 flex-1 truncate rounded-l-lg rounded-r-none border border-brand-border bg-brand-white px-4 text-base placeholder:text-foreground/60 dark:bg-brand-surface"
			bind:value={searchInput}
			on:keydown={(event) => {
				if (event.key === 'Enter') applySearch();
			}}
		/>
		<div class="flex justify-end">
			<Button
				class="rounded-l-none rounded-r-lg bg-brand-blue text-brand-white"
				on:click={applySearch}
				aria-label="Procurar"
			>
				<Search />
			</Button>
		</div>
	</div>

	<AnnotateFilterButton {themes} bind:filterValues={$selectedThemes} />
</div>

<!-- Table Container -->
<div class="mt-4 w-full overflow-x-hidden rounded-b-2xl border border-brand-border">
	<Table.Root {...$tableAttrs} class="w-full text-sm md:text-base">
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row class="flex min-h-12 w-full hover:bg-transparent">
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head
									{...attrs}
									class={`
										flex min-w-0 items-center overflow-hidden truncate whitespace-nowrap px-2 font-semibold text-muted-foreground sm:px-3
										${cell.id === 'name' ? 'flex flex-[2]' : ''}
										${cell.id === 'theme' ? 'flex w-full flex-[3]' : ''}
										${cell.id === 'last_changed' ? 'hidden lg:flex lg:flex-1 lg:justify-center' : ''}
										${cell.id === 'is_anotated' ? 'flex flex-1 justify-center' : ''}
									`}
								>
									{#if cell.id === 'last_changed' || cell.id === 'is_anotated'}
										<div class="flex items-center justify-center">
											<Render of={cell.render()} />
										</div>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row class="flex min-h-14 w-full hover:bg-transparent" {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell
									{...attrs}
									lang="pt"
									class={`
										flex min-w-0 items-center overflow-hidden px-2 sm:px-3
										${cell.id === 'name' ? 'flex flex-[2] whitespace-normal break-normal hyphens-auto' : ''}
										${cell.id === 'theme' ? 'flex w-full flex-[3] whitespace-normal break-normal hyphens-auto' : ''}
										${cell.id === 'last_changed' ? 'hidden whitespace-nowrap lg:flex lg:flex-1 lg:justify-center' : ''}
										${cell.id === 'is_anotated' ? 'flex flex-1 justify-center' : ''}
									`}
								>
									{#if cell.id === 'is_anotated'}
										<div class="flex items-center justify-center">
											<Button
												variant="outline"
												class="h-10 w-10 min-w-10 flex-none rounded-lg border-brand-border p-0 text-brand-blue md:h-auto md:w-auto md:px-4 md:py-2 sm:text-base"
												aria-label="Anotar {row.original.name}"
												on:click={() => goto(`/annotate/${row.original.id}`)}
											>
												<div class="relative flex items-center">
													<Pencil class="h-4 w-4" />
													<span class="sr-only lg:not-sr-only sm:inline">&nbsp; Anotar</span>
												</div>
											</Button>
										</div>
									{:else if cell.id === 'last_changed'}
										<div class="flex items-center justify-center">
											<Render of={formatTimestamp(cell.value)} />
										</div>
									{:else if cell.id === 'theme'}
										<div class="flex flex-wrap gap-2">
											{#each cell.value as t}
												<Badge
													lang="pt"
													class="h-auto max-w-full whitespace-normal break-normal hyphens-auto border border-brand-border bg-brand-surface px-3 py-1 text-left text-xs leading-tight dark:bg-brand-border/60 md:text-base"
													variant="outline">{themeLabel(t)}</Badge
												>
											{/each}
										</div>
									{:else}
										<div>
											<Render of={cell.render()} />
										</div>
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>

	<!-- Pagination -->
	{#if $filteredSigns.length > 0}
		<div class="flex items-start justify-center border-t border-brand-border px-2 py-4 sm:px-4">
			<Pagination.Root count={$filteredSigns.length} perPage={$pageSize} let:pages>
				<Pagination.Content class="flex items-center justify-center gap-1 sm:hidden">
					<Pagination.Item>
						<Pagination.PrevButton
							class="h-9 w-9 p-0"
							aria-label="Página anterior"
							on:click={() => ($pageIndex = $pageIndex - 1)}
							disabled={previousPageDisabled}
						>
							<ChevronLeft class="h-4 w-4" aria-hidden="true" />
						</Pagination.PrevButton>
					</Pagination.Item>

					{#each compactPages as compactPage, index (`${compactPage}-${index}`)}
						<Pagination.Item>
							{#if typeof compactPage === 'number'}
								<Button
									variant={currentPageNumber === compactPage ? 'outline' : 'ghost'}
									size="icon"
									class={currentPageNumber === compactPage
										? 'h-9 w-9 border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
										: 'h-9 w-9'}
									aria-label="Ir para a página {compactPage}"
									aria-current={currentPageNumber === compactPage ? 'page' : undefined}
									on:click={() => ($pageIndex = compactPage - 1)}
								>
									{compactPage}
								</Button>
							{:else}
								<Pagination.Ellipsis class="h-9 w-9" />
							{/if}
						</Pagination.Item>
					{/each}

					<Pagination.Item>
						<Pagination.NextButton
							class="h-9 w-9 p-0"
							aria-label="Página seguinte"
							on:click={() => ($pageIndex = $pageIndex + 1)}
							disabled={nextPageDisabled}
						>
							<ChevronRight class="h-4 w-4" aria-hidden="true" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>

				<Pagination.Content class="hidden items-center justify-center gap-2 sm:flex">
					<Pagination.Item>
						<Pagination.PrevButton
							on:click={() => ($pageIndex = $pageIndex - 1)}
							disabled={previousPageDisabled}
						>
							Anterior
						</Pagination.PrevButton>
					</Pagination.Item>

					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link
									{page}
									isActive={currentPageNumber == page.value}
									class={`${currentPageNumber === page.value ? ' rounded-lg border-primary bg-primary px-3 py-5' : ''}`}
									on:click={() => ($pageIndex = page.value - 1)}
								>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}

					<Pagination.Item>
						<Pagination.NextButton
							on:click={() => ($pageIndex = $pageIndex + 1)}
							disabled={nextPageDisabled}
						>
							Próximo
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</div>
	{/if}
</div>
