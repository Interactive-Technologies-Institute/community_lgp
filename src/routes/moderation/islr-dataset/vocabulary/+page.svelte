<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import * as Tabs from '@/components/ui/tabs';
	import { ArrowDown, ArrowLeft, ArrowUp } from 'lucide-svelte';

	export let data;

	type SortKey = 'name' | 'videoCount' | 'contributorCount';

	const PAGE_SIZE = 50;

	// Fewest videos first: the signs that most need recording come up top.
	let sortKey: SortKey = 'videoCount';
	let ascending = true;
	let query = '';
	let pageIndex = 0;

	const collator = new Intl.Collator('pt-PT', { sensitivity: 'base' });
	const normalize = (value: string) =>
		value
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();

	function sortBy(key: SortKey) {
		if (sortKey === key) {
			ascending = !ascending;
		} else {
			sortKey = key;
			ascending = true;
		}
		pageIndex = 0;
	}

	$: filtered = data.signs.filter((sign) => normalize(sign.name).includes(normalize(query)));
	$: sorted = [...filtered].sort((a, b) => {
		const order =
			sortKey === 'name'
				? collator.compare(a.name, b.name)
				: a[sortKey] - b[sortKey] || collator.compare(a.name, b.name);
		return ascending ? order : -order;
	});
	$: pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
	$: if (pageIndex > pageCount - 1) pageIndex = pageCount - 1;
	$: pageSigns = sorted.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
	$: withoutVideos = data.signs.filter((sign) => sign.videoCount === 0).length;

	const columns: { key: SortKey; label: string; numeric: boolean }[] = [
		{ key: 'name', label: 'Gesto', numeric: false },
		{ key: 'videoCount', label: 'Vídeos', numeric: true },
		{ key: 'contributorCount', label: 'Contribuidores', numeric: true },
	];
</script>

<Tabs.Content value="islr-dataset" class="mt-8 flex flex-col gap-y-4">
	<a
		href="/moderation/islr-dataset"
		class="inline-flex w-fit items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
	>
		<ArrowLeft class="h-4 w-4" />
		Voltar ao resumo
	</a>

	<div class="flex flex-wrap items-center justify-between gap-2">
		<p class="text-sm text-muted-foreground">
			<span class="font-semibold text-foreground">{data.signs.length}</span> gestos no vocabulário
			<span class="mx-1.5" aria-hidden="true">·</span>
			<span class="font-semibold text-foreground">{withoutVideos}</span> ainda sem vídeos
		</p>
		<Input
			type="search"
			placeholder="Procurar gesto"
			class="w-full sm:w-64"
			bind:value={query}
			on:input={() => (pageIndex = 0)}
		/>
	</div>

	<div class="w-full overflow-x-auto rounded-2xl border border-brand-border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as column (column.key)}
						<Table.Head class={column.numeric ? 'text-right' : ''}>
							<button
								type="button"
								class="inline-flex items-center gap-1 hover:text-foreground"
								on:click={() => sortBy(column.key)}
							>
								{column.label}
								{#if sortKey === column.key}
									<svelte:component this={ascending ? ArrowUp : ArrowDown} class="h-3 w-3" />
								{/if}
							</button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each pageSigns as sign (sign.id)}
					<Table.Row>
						<Table.Cell>
							<a href="/dictionary/sign/{sign.id}" class="hover:underline">{sign.name}</a>
						</Table.Cell>
						<Table.Cell
							class="text-right tabular-nums {sign.videoCount === 0 ? 'text-muted-foreground' : ''}"
						>
							{sign.videoCount}
						</Table.Cell>
						<Table.Cell class="text-right tabular-nums">{sign.contributorCount}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={3} class="text-center text-muted-foreground">
							Nenhum gesto encontrado.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if pageCount > 1}
		<div class="flex items-center justify-end space-x-4">
			<span class="text-sm text-muted-foreground">Página {pageIndex + 1} de {pageCount}</span>
			<Button
				variant="outline"
				size="sm"
				on:click={() => (pageIndex = pageIndex - 1)}
				disabled={pageIndex === 0}>Anterior</Button
			>
			<Button
				variant="outline"
				size="sm"
				disabled={pageIndex >= pageCount - 1}
				on:click={() => (pageIndex = pageIndex + 1)}>Seguinte</Button
			>
		</div>
	{/if}
</Tabs.Content>
