<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "@/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
    export let results : {id: number, name: string, video: string}[] = [];

    let isOpen = false;

    onMount(() => {
    isOpen = true; // Open the dialog automatically on mount
    });
    
    function goToSignPage(id:number){
        goto(`/dictionary/sign/${id}`);
    }
</script>



<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="max-w-[95vw] max-h-[90vh] p-8 rounded-lg shadow-lg">
        <ScrollArea class="max-h-[85vh] max-w-[95vw] overflow-auto p-6">
            <div>
                {#if results.length > 0}
                    <ul class="grid grid-cols-2 gap-8 place-items-center">
                        {#each results as result}
                            <li class="flex justify-center w-full">
                                <Card.Root class="w-[350px] lg:w-[400px] h-[375px] shadow-lg rounded-xl p-6"
                                on:click={() => goToSignPage(result.id)}>
                                    <Card.Content class="flex flex-col items-center justify-center">
                                        <!-- Medium-sized video -->
                                        <video class="w-full h-[250px] object-cover rounded-lg" controls playsinline on:click|stopPropagation>
                                            <source src={result.video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <!-- Title underneath the video -->
                                        <h3 class="mt-4 text-center font-semibold text-xl "
                                        >
                                        <a href="/dictionary/sign/{result.id}" class="hover:underline">{result.name}</a>
                                    </h3>
                                    </Card.Content>
                                </Card.Root>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-center text-lg">No results found.</p>
                {/if}
            </div>
        </ScrollArea>
    </Dialog.Content>
</Dialog.Root>
