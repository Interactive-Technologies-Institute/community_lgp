<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { Parameter } from '@/types/types';
  export let data: Parameter[];
</script>

<div class="flex flex-wrap gap-2 mt-2">
  {#each data as parameter}
    <Card.Root class="flex items-center justify-center w-[70px] h-[70px] bg-white shadow rounded-xl overflow-hidden">
      {#if parameter.image}
        <img
          src={parameter.image}
          alt={parameter.name ?? parameter.code}
          class="w-16 h-16 object-contain"
        />
      {:else}
        <span class="text-[10px] text-center px-1 text-black">{parameter.name ?? parameter.code}</span>
      {/if}
    </Card.Root>
  {/each}
</div>
