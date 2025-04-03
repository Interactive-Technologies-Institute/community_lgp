<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  
  import type { AnnotationArray, Parameter } from '@/types/types';

  export let anotationUpdate : AnnotationArray;

  function getParameterById(id: number) {
    return anotationUpdate.find((parameter : Parameter) => parameter.id === id);
  }
</script>
<div class="flex flex-row text-sm gap-1 items-center my-5">
    <!-- Outer Card -->
    <Card.Root class="flex flex-row gap-4 p-4 items-center justify-center bg-gray-100 rounded-lg">
      {#each ["configuration", "location", "orientation", "movement", "expression"] as key}
        {#if anotationUpdate[key]} 
          <div class="flex flex-row gap-2 items-center">
            <!-- Inner Card for Each Key's Annotations -->
            {#each anotationUpdate[key] as anotation} 
              {#if getParameterById(anotation)}
                <Card.Root class="p-2 bg-white shadow-md rounded-lg w-24 h-24 flex items-center justify-center">
                  {#if getParameterById(anotation).image != null}
                    <img 
                      src={getParameterById(anotation).image} 
                      alt={key} 
                      class="w-full h-full object-contain"
                    />
                  {:else}
                    <span class="text-center">{getParameterById(anotation).nome}</span>
                  {/if}
                </Card.Root>
              {/if}
            {/each}
          </div>
        {/if}
      {/each}
    </Card.Root>
  </div>
