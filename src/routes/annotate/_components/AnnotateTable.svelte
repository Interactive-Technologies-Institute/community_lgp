<script lang="ts">
	  import type { Sign } from "@/types/types";
    import { createTable, Render, Subscribe } from "svelte-headless-table";
    import { addPagination } from "svelte-headless-table/plugins";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
	  import PencilCircleFill from "@/img/pencil_circle_fill.svelte";
    

    export let signs : Sign[]
    const table = createTable<Sign>(readable(signs), {
        page:addPagination(),
    });

    
    const columns = table.createColumns([

       
        table.column({
            accessor: "name",
            header: "Nome",
        }),
        table.column({
            accessor: "theme",
            header: "Etiquetas", 
        }),
        table.column({
            accessor: "is_anotated",
            header: "Estado de Anotação",
            cell : () => {
              return "";
            },
        })
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
    table.createViewModel(columns);

    const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
    
    
</script>

<div class="w-2/5 md:w-2/5 overflow-x-hidden">
  <Table.Root {...$tableAttrs} class="table-fixed w-full">
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row class="h-12"> <!-- Fixed height here -->
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                <Table.Head {...attrs} class="w-1/3 truncate overflow-hidden whitespace-nowrap">
                  <Render of={cell.render()} />
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
          <Table.Row
            class="h-12" 
            {...rowAttrs}
            on:click={() => goto(`/annotate/${row.original.id}`)}
          >
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs} class="w-1/3 truncate overflow-hidden whitespace-nowrap">
                  {#if cell.id === "is_anotated"}
                  <div class="flex items-right justify-center">
                  <PencilCircleFill anotation_value={cell.value} />
                  <Render of={cell.render() } />
                </div>
                  {:else}
                  
                    <Render of={cell.render()} />
                  
                  {/if}
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
  	
<div class="w-2/5">
    <div class="rounded-md border">
      <Table.Root {...$tableAttrs}>
        <!-- .... -->
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
  
  