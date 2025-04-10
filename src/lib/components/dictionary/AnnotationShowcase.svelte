<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  
  import type { AnnotationArray, Parameter } from '@/types/types';


  export let data: Parameter[];
 
  

  const orderedKeys: string[] = ['configuracao', 'orientacao', 'localizacao', 'movimento', 'expressao facial'];


  function getParametersByTipo(tipo: string): Parameter[] {
    return data.filter((param) => param.tipo === tipo);
  }
</script>

<div class="py-5">
<Card.Root class="w-[600px] rounded-2xl">
    <Card.Content class="bg-secondary rounded-2xl">

<div class="flex flex-row pt-5 ">
  {#each orderedKeys as key}
    {#if getParametersByTipo(key).length > 0}
        <div class="grid grid-cols-5 ">
          {#each getParametersByTipo(key) as parameter}
            <Card.Root class="flex flex-col items-center justify-center w-[105px] h-[105px] bg-white shadow-md rounded-2xl">
              {#if parameter.image}
                <img
                  src={parameter.image}
                  alt={parameter.name ?? parameter.code}
                  class="w-18 h-18 object-cover rounded-md "
                />
              {:else}
                <span class="text-xs text-center text-black">{parameter.name ?? parameter.code}</span>
              {/if}
            </Card.Root>
          {/each}
        </div>
        {:else}
        <div class ="grid grid-cols-5">
        <Card.Root class="flex flex-col items-center justify-center text-center  w-[105px] h-[105px] bg-white shadow-md rounded-2xl text-black text-sm">
          Falta o campo {key}.
        </Card.Root>
      </div>
    {/if}
  {/each}
</div>
</Card.Content>
</Card.Root>
</div>