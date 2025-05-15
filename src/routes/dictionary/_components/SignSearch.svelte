<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";
  import { Button } from "@/components/ui/button";
  import * as Popover from "$lib/components/ui/popover";
  import type { AnnotationArray, Parameter, Sign } from "@/types/types";
  import { get } from 'svelte/store';
  export let parameters: Parameter[] = [];
  export let signs: Sign[] = [];
  import { createEventDispatcher } from 'svelte';
	import { afterNavigate, pushState } from "$app/navigation";
	import { queryParam } from "sveltekit-search-params";
	import { arrayQueryParam } from "@/utils";
  const dispatch = createEventDispatcher();

  let searchResults: Sign[] = [];

  let searchArray = Array(300).fill(0);
  let selectedParameterIds: number[] = [];
  let selectedTab: keyof typeof tabs = "configuracao";

  
  const tabs: Record<string, { displayName: string; annotationKey: keyof AnnotationArray }> = {
    configuracao: { displayName: "Configuração", annotationKey: "configuration" },
    localizacao: { displayName: "Localização", annotationKey: "location" },
    orientacao: { displayName: "Orientação", annotationKey: "orientation" },
    movimento: { displayName: "Movimento", annotationKey: "movement" },
    "expressao facial": { displayName: "Expressão Facial", annotationKey: "expression" }
  };

  function filterByType(type: string) {
    return parameters.filter(p => p.tipo === type);
  }

  function getChildren(code: string) {
    return parameters.filter(p => p.parent === code);
  }

  function toggleParameter(p: Parameter) {
    const isSelected = selectedParameterIds.includes(p.id);
    selectedParameterIds = isSelected
      ? selectedParameterIds.filter(id => id !== p.id)
      : [...selectedParameterIds, p.id];

    searchArray[p.id - 1] = isSelected ? 0 : 1;
  }






    function buildAnnotation(): AnnotationArray {
      // Convert searchArray (0/1 array) to AnnotationArray { configuration: [ids], ... }
      const annotation: AnnotationArray = {
        configuration: [],
        location: [],
        orientation: [],
        movement: [],
        expression: []
      };

      for (const [tabKey, tab] of Object.entries(tabs)) {
        annotation[tab.annotationKey] = parameters
          .filter(p => selectedParameterIds.includes(p.id) && p.tipo === tabKey)
          .map(p => p.id);
      }

      return annotation;
    }
    

     async function searchSigns() {
    try {
      const type = window.location.pathname.split('/')[1]; // Get the type from the URL
      const annotation = buildAnnotation();

      let apiUrl = '';

  

      if (type === 'dictionary') {
        apiUrl = '/api/dictionary/search';
      } else if (type === 'fcdictionary') {
        apiUrl = '/api/fcdictionary/search';
      } else {
        console.error('Invalid type parameter in URL');
        return;
      }
      
      console.log(window.location.href);
      const response = await fetch(apiUrl, {
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
      signs = data.signs;
      dispatch('updateSigns', data.signs);
      console.log('Fetched signs:', signs);
    } catch (error) {
      console.error('Error fetching signs:', error);
    }
  }

  let isOpen = false;

  afterNavigate(() => {
  signs = signs ?? [];
});
</script>

<Popover.Root bind:open={isOpen}>
  <Popover.Trigger on:click={() => (isOpen = true)}>
    <Button>Procurar por Gesto</Button>
  </Popover.Trigger>


<Popover.Content class="w-[1000px] overflow-auto p-2">
<!-- Tab Buttons -->
<div class="flex flex-wrap justify-center gap-2 my-4">
  {#each Object.entries(tabs) as [key, tab]}
    <Button
      on:click={() => (selectedTab = key)}
      class="{selectedTab === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}"
    >
      {tab.displayName}
    </Button>
  {/each}
  <Button on:click={() => { searchSigns(); (isOpen=false); }} class="bg-blue-600 text-white">Procurar</Button>
</div>

<!-- Parameter Selection -->
<ScrollArea class="h-[700px] overflow-auto px-2">
  <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
    {#each filterByType(selectedTab) as parent}
    {#if parent.is_parent && (parent.image || ['mão', 'braço', 'frente', 'tronco'].includes(parent.name?.toLowerCase() ?? '') || ['2ebj'].includes(parent.code?.toLowerCase() ?? ''))}
  <Card.Root class="{selectedParameterIds.includes(parent.id) ? 'border-2 border-blue-500' : 'border'} bg-white">
    <Card.Content class="flex flex-col items-center gap-2 p-4">
      <!-- Parent Button/Image or fallback to name -->
        {#if parent.image}
          <img
            src={parent.image}
            alt={parent.name ?? parent.code}
            class="w-full h-32 object-contain cursor-pointer"
            on:click={() => toggleParameter(parent)}
          />
        {:else}
          <div 
            class="w-full h-32 flex items-center justify-center text-center font-semibold cursor-pointer"
            on:click={() => toggleParameter(parent)}
          >
            <div class="text-black font-semibold">{parent.name ?? parent.code}
              </div>
          </div>
        {/if}

        <!-- Children -->
        {#if parent.code}
          <div class="grid grid-cols-4 gap-2 mt-2 max-h-32 overflow-y-auto">
            {#each getChildren(parent.code) as child}
              {#if child.image}
                <div
                  class="flex flex-col items-center justify-center text-xs cursor-pointer rounded-md text-center {selectedParameterIds.includes(child.id) ? 'border-2 border-blue-500' : ''}"
                  on:click={() => toggleParameter(child)}
                >
                  <img src={child.image} alt={child.name ?? child.code} class="w-full h-[60px] aspect-square rounded-md" />
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  {/if}
    {/each}
    
  </div>

</ScrollArea>
</Popover.Content>

</Popover.Root>