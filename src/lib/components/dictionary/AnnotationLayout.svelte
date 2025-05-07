<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";
  import { Button } from "@/components/ui/button";
  import type { AnnotationArray, Parameter } from "@/types/types";


  export let parameter: Parameter[];

  let searchArray: number[] = Array(279).fill(0);
  let selectedParameterId: number[] = []; 
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

  function addToSearchArray(p: Parameter, isSelected: boolean) {
    const index = p.id - 1;
    if (index >= 0 && index < searchArray.length) {
      searchArray[index] = isSelected ? 1 : 0;
    }
  }

  function handleParameterIdClick(p: Parameter) {
  const isCurrentlySelected = selectedParameterId.includes(p.id);
  
  if (isCurrentlySelected) {
    selectedParameterId = selectedParameterId.filter(id => id !== p.id);
    addToSearchArray(p, false); 
  } else {
    
    selectedParameterId = [...selectedParameterId, p.id];
    addToSearchArray(p, true); 
  }
}
</script>

  <div class="flex flex-col items-center justify-center w-auto mx-auto">
        <div class="flex gap-2 mb-4 justify-center items-center">
          {#each Object.entries(tabs) as [key, { displayName }]}
            <Button
              on:click={() => (selectedTab = key)}
              class="{selectedTab === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}"
            >
              {displayName}
            </Button>
          {/each}
          
        </div>

        <ScrollArea class="max-h-[2500px] overflow-auto">
          
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
                          class="w-16 h-16 py-2 cursor-pointer object-contain aspect-square"
                          on:click={() => handleParameterIdClick(p)}
                        />  
                      </Card.Content>
                    {:else}
                      <Card.Content
                        class="flex items-center justify-center py-12 px-2 font-bold text-lg text-black cursor-pointer"
                      >
                        <Button
                          class="bg-white"
                          on:click={() => handleParameterIdClick(p)}
                        >
                          {p.name ?? p.code}
                        </Button>
                      </Card.Content>
                    {/if}
                    
                    {#if p.code}
 
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="grid grid-cols-5 gap-4 mt-4  overflow-y-auto">
                      
                      {#each getChildren(p.code) as child}
                        <div
                          class="flex flex-col items-center justify-center w-16 h-16 cursor-pointer rounded-md {selectedParameterId.includes(child.id) ? 'border-2 border-blue-500' : ''}"
                          on:click={() => handleParameterIdClick(child)}
                        >
                          {#if child.image}
                            <img
                              src={child.image}
                              alt="Child Parameter"
                              class="w-12 h-12 aspect-square object-contain rounded-md"
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
         
        </ScrollArea>
      </div>