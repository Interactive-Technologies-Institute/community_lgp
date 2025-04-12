<script lang="ts">
    import { Separator } from "$lib/components/ui/separator";
    import type { Sign } from "@/types/types";
    import AnnotateTable from "./_components/AnnotateTable.svelte";
	import PageHeader from "@/components/page-header.svelte";

    export let data;
    let signs: Sign[] = data.signs;
    let nonAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated == 0);
    let semiAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated == 1);
</script>

<PageHeader title="Anotações" subtitle="Anote ou altere as anotações de um gesto." />

<div class="grid grid-cols-2 gap-4">
    <div class="col-span-2 px-72 py-8">
        <h2 class="text-2xl font-bold">Anotações Pendentes</h2>
        <p class="text-sm text-gray-500">Anotações que ainda não foram feitas.</p>
        <Separator class="my-4 w-[40%]" />
        <AnnotateTable signs={nonAnotatedSigns} />
    </div>
        
    

    <div class="col-span-2 px-72 py-8">
        <h2 class="text-2xl font-bold">Anotações Semi-Concluídas</h2>
        <p class="text-sm text-gray-500">Anotações que foram parcialmente feitas.</p>
        <Separator class="my-4 w-[40%]" />
        <AnnotateTable signs={semiAnotatedSigns} />
    </div>
</div>
