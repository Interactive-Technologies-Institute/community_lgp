<script lang="ts">
    export let signs: Sign[];
    export let theme;
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import type { Sign } from "@/types/types";

    let isVisible = false;
    let container: HTMLDivElement;

    onMount(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    observer.unobserve(container);
                }
            },
            {
                rootMargin: "200px",
                threshold: 0.1
            }
        );
        observer.observe(container);
    });
</script>

<div class="flex flex-col justify-start items-start">

    <h1 class="py-3 text-xl text-left pl-2">{theme}</h1>
    <Carousel.Root
        opts={{
            align: "start"
        }}
        class="w-full max-w-[1250px]"
    >
        <Carousel.Content>
            {#each signs.filter(sign => sign.theme.includes(theme)) as sign}
                <Carousel.Item class="md:basis-2/3 lg:basis-1/3">
                    <div class="p-1">
                        <Card.Root class="rounded-2xl">
                            <!-- svelte-ignore a11y-media-has-caption -->
                            <Card.Content
                                class="flex  items-center justify-center p-3"
                            >   
                            <div class="flex flex-col">
                                <div bind:this={container}>
                                    {#if isVisible}
                                        <video class="w-full aspect-video rounded-xl" controls preload="metadata" muted>
                                            <source src={sign.video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    {/if}
                                </div>
                                <a href="/dictionary/sign/{sign.id}" class="text-l pt-9 py-5">{sign.name}</a>
                            </div>
                            </Card.Content>
                        </Card.Root>
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
    </Carousel.Root>
</div>
