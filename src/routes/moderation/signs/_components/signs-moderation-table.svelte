<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Table from '@/components/ui/table';
	import type { UpdateModerationInfoSchema } from '@/schemas/moderation-info';
	import type { SignWithModeration } from '@/types/types';
	import dayjs from 'dayjs';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { writable } from 'svelte/store';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import SignsModerationActions from './signs-moderation-actions.svelte';
	import SignsModerationStatusCell from './signs-moderation-status-cell.svelte';

	export let signs: SignWithModeration[];
	export let updateModerationForm: SuperValidated<Infer<UpdateModerationInfoSchema>>;
	let data = writable(signs);
	$: data.set(signs);

	const table = createTable(data, { page: addPagination() });

	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'Nome',
		}),
		table.column({
			accessor: ({ moderation }) => moderation[0].inserted_at,
			header: 'Última vez atualizado',
			cell: ({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
		}),
		table.column({
			accessor: ({ moderation }) => moderation[0].status,
			header: 'Estado',
			cell: ({ value, row }) => {
				if (row.isData()) {
					return createRender(SignsModerationStatusCell, {
						status: value,
					});
				}
				return value ?? '';
			},
		}),
		table.column({
			accessor: ({ moderation }) => moderation[0].comment,
			header: 'Comentário',
		}),
		table.column({
			accessor: ({ id, created_by_user_id }) => ({ id, created_by_user_id }),
			header: '',
			cell: ({ value }) => {
				return createRender(SignsModerationActions, {
					id: value.id,
					userId: value.created_by_user_id,
					data: updateModerationForm,
				});
			},
		}),
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Anterior</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Próximo</Button
		>
	</div>
</div>
