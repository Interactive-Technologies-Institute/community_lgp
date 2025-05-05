<script lang="ts">
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";
  import SearchResults from "./SearchResults.svelte";
  import type { AnnotationArray, Parameter } from "@/types/types";

  export let parameter: Parameter[];

  let searchArray: number[] = Array(279).fill(0);
  let selectedParameterId: number[] = []; // Track selected parent IDs
  let searchResults: { id: number; name: string; video: string }[] = []; // Store search results
  let showSearchResults = false; // Toggle between dialog content

  let tabs: Record<string, { displayName: string; annotationKey: keyof AnnotationArray }> = {
    configuracao: { displayName: "Configuração", annotationKey: "configuration" },
    localizacao: { displayName: "Localização", annotationKey: "location" },
    orientacao: { displayName: "Orientação", annotationKey: "orientation" },
    movimento: { displayName: "Movimento", annotationKey: "movement" },
    "expressao facial": { displayName: "Expressão Facial", annotationKey: "expression" }
  };

  let selectedTab: keyof typeof tabs = "configuracao"; // Default to the first tab

  function filterByType(parameter_type: string) {
    return parameter.filter(p => p.tipo === parameter_type);
  }

  function getChildren(parentCode: string) {
    return parameter.filter(p => p.parent === parentCode);
  }

  function addToSearchArray(p: Parameter) {
    const index = p.id - 1;
    if (index >= 0 && index < searchArray.length) {
      searchArray[index] = 1;
    }
  }

  async function searchSigns() {
    try {
      const response = await fetch('/api/dictionary/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchArray }),
      });

      if (!response.ok) {
        console.error('Failed to fetch signs');
        return;
      }

      const data = await response.json();
      console.log('Fetched signs:', data.signs);

      searchResults = data.signs; 
      showSearchResults = true; // Show search results
    } catch (error) {
      console.error('Error fetching signs:', error);
    }
  }

  function handleParameterIdClick(p: Parameter) {
    if (selectedParameterId.includes(p.id)) {
      selectedParameterId = selectedParameterId.filter(id => id !== p.id);
    } else {
      selectedParameterId = [...selectedParameterId, p.id];
    }
    addToSearchArray(p);
    console.log("Selected Parameters:", selectedParameterId, searchArray);
  }

  function closeSearchResults() {
    showSearchResults = false; // Reset to show parameter selection
  }
</script>

<Dialog.Root>
  <Dialog.Trigger>
    <Button data-umami-event="procura-por-gesto">Procura por gesto</Button>
  </Dialog.Trigger>
  <Dialog.Content class="w-[1000px] max-w-[1000px] h-[600px] max-h-[600px]">
    <Dialog.Header>
      {#if showSearchResults}
        <!-- Render the SearchResults component -->
        <SearchResults results={searchResults} on:close={closeSearchResults} />
      {:else}
        <div class="flex gap-2 mb-4 justify-center items-center">
          {#each Object.entries(tabs) as [key, { displayName }]}
            <Button
              on:click={() => (selectedTab = key)}
              class="{selectedTab === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}"
            >
              {displayName}
            </Button>
          {/each}
          <Button class="bg-blue-500 text-white" data-umami-event="submeter-procura-gesto" on:click={searchSigns}>
            Procurar
          </Button>
        </div>

        <ScrollArea class="max-h-[500px] overflow-auto">
          <Dialog.Description>
            <div class="grid grid-cols-5 gap-4">
              {#each filterByType(selectedTab) as p}
                {#if p.is_parent}
                
                  <Card.Root
                    class="bg-white {selectedParameterId.includes(p.id) ? 'border-2 border-blue-500' : ''}"
                  >
                    {#if p.image}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                      <Card.Content class="flex items-center justify-center py-3 px-3">
                        <img
                          src={p.image}
                          alt="Parameter drawing"
                          class="w-full h-full py-2 cursor-pointer"
                          on:click={() => handleParameterIdClick(p)}
                        />  
                      </Card.Content>
                    {:else}
                    <Card.Content
                    class="flex items-center justify-center py-12 px-2 font-bold text-lg text-black cursor-pointer text-center"
                  >
                    <Button
                      class="bg-white whitespace-normal text-wrap max-w-xs max-h-sm"
                      on:click={() => handleParameterIdClick(p)}
                    >
                      <span class="line-clamp-3">
                        {p.name ?? p.code}
                      </span>
                    </Button>
                  </Card.Content>
                    {/if}
                    
                    {#if p.code}
 
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="grid grid-cols-5 gap-4 mt-4 max-h-40 overflow-y-auto">
                      
                      {#each getChildren(p.code) as child}
                        <div
                          class="flex flex-col items-center justify-center w-16 h-16 cursor-pointer rounded-md {selectedParameterId.includes(child.id) ? 'border-2 border-blue-500' : ''}"
                          on:click={() => handleParameterIdClick(child)}
                        >
                          {#if child.image}
                            <img
                              src={child.image}
                              alt="Child Parameter"
                              class="w-12 h-12 object-cover rounded-md"
                            />
                          {:else}
                            <span class="text-xs text-center">{child.name ?? child.code}</span>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  {/if}
                  </Card.Root>
                {/if}
              {/each}
            </div>
          </Dialog.Description>
        </ScrollArea>
      {/if}
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>