<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import type { Parameter } from '@/types/types';
    export let data: Parameter[];
    const orderedKeys: string[] = [
        'configuracao',
        'orientacao',
        'localizacao',
        'movimento',
        'expressao facial',
    ];
    
    // Make this reactive
    $: filteredData = orderedKeys.flatMap(tipo => 
        data.filter((param) => param.tipo === tipo && param.code !== 'F000')
    );
</script>

<div class="py-5">
    <Card.Root class="w-[600px] rounded-2xl">
        <Card.Content class="rounded-2xl bg-secondary">
            <div class="pt-5">
                <div class="grid grid-cols-5 gap-4">
                    {#each filteredData as parameter}
                        <Card.Root
                            class="flex h-[105px] w-[105px] flex-col items-center justify-center rounded-2xl bg-white shadow-md"
                        >
                            {#if parameter.image}
                                <img
                                    src={parameter.image}
                                    alt={parameter.name ?? parameter.code}
                                    class="h-24 w-24 rounded-2xl object-contain"
                                />
                            {:else}
                                <span class="text-center text-xs text-black"
                                    >{parameter.name ?? parameter.code}</span
                                >
                            {/if}
                        </Card.Root>
                    {/each}
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</div>