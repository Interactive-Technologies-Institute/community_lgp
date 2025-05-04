<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  
  import type { Parameter } from '@/types/types';


  export let data: Parameter[];
 
  

  const orderedKeys: string[] = ['configuracao', 'orientacao', 'localizacao', 'movimento', 'expressao facial'];


  function getParametersByTipo(tipo: string): Parameter[] {
    return data.filter((param) => param.tipo === tipo);
  }
</script>

<div class="py-5">
<Card.Root class="w-[600px] rounded-2xl">
    <Card.Content class="bg-secondary rounded-2xl">

      <div class="pt-5">
        <div class="grid grid-cols-5 gap-4">
          {#each orderedKeys as key}
            {#each getParametersByTipo(key) as parameter}
              <Card.Root class="flex flex-col items-center justify-center w-[105px] h-[105px] bg-white shadow-md rounded-2xl">
                {#if parameter.image}
                  <img
                    src={parameter.image}
                    alt={parameter.name ?? parameter.code}
                    class="w-24 h-24 object-contain rounded-2xl"
                  />
                {:else}
                  <span class="text-xs text-center text-black">{parameter.name ?? parameter.code}</span>
                {/if}
              </Card.Root>
            {/each}
          {/each}
        </div>
      </div>
</Card.Content>
</Card.Root>
</div>