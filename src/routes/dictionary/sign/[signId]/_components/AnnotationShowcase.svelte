<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  
  import type { AnnotationArray, Parameter } from '@/types/types';


  export let data: Parameter[];
 
  

  const orderedKeys: string[] = ['configuracao', 'orientacao', 'localizacao', 'movimento', 'expressao facial'];


  function getParametersByTipo(tipo: string): Parameter[] {
    return data.filter((param) => param.tipo === tipo);
  }
</script>

<div class="py-5 px-[275px]">
<Card.Root class="w-[1000px]">
    <Card.Content class="bg-secondary rounded-md">
<div class="flex flex-row gap-8 py-5">
  {#each orderedKeys as key}
    {#if getParametersByTipo(key).length > 0}
      
        <div class="grid grid-cols-5 pt-5">
          {#each getParametersByTipo(key) as parameter}
            <Card.Root class="flex flex-col items-center justify-center w-40 h-40 bg-white shadow-md rounded-md">
              {#if parameter.image}
                <img
                  src={parameter.image}
                  alt={parameter.name ?? parameter.code}
                  class="w-20 h-20 object-cover rounded-md mb-2 "
                />
              {:else}
                <span class="text-xs text-center text-black">{parameter.name ?? parameter.code}</span>
              {/if}
            </Card.Root>
          {/each}
        </div>
      
    {/if}
  {/each}
</div>
</Card.Content>
</Card.Root>
</div>