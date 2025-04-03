<script lang="ts">
	
	import * as Card from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Accordion from '$lib/components/ui/accordion';
	import Badge from '@/components/ui/badge/badge.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Carousel from '$lib/components/ui/carousel';
	//ICONS//
	import { ThumbsUp } from 'lucide-svelte';
	import { ThumbsDown } from 'lucide-svelte';
	import { MessageSquareText } from 'lucide-svelte';
	import { page } from '$app/stores';
	import type { Sign } from '@/types/types';
	import AnnotationShowcase from '../_components/AnnotationShowcase.svelte';

	export let data;
	export let sign : Sign | null = data.sign;
	
</script>

<div class="py-5 flex gap-8">
    <!-- Left-hand side: Video and Title -->
    <div class="w-1/3">
        {#if sign}
            <video class="w-full aspect-video rounded-lg mb-4 ml-72" controls>
                <track kind="captions" />
                <source src={sign.video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <h2 class="text-xl font-bold text-center mt-10">{sign.name}</h2>
			<!--<AnnotationShowcase anotationUpdate={sign.annotation} />-->
			
		{:else}
			<p class="text-center text-lg">Loading...</p>
        {/if}
    </div>

</div>
