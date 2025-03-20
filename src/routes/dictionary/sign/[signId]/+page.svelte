<script lang="ts">
	export let data;
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

	
</script>

<div class="py-5">
	<div>
		{#if data.sign}
		<!--<video class="mx-auto aspect-video rounded-lg pt-2" controls>
			<track kind="captions" />
			<source src={data.sign.video} type="video/mp4" />
			Your browser does not support the video tag.
		</video>-->
		{/if}
	</div>
	<div class="flex items-center justify-center py-5">
		<Button href="{$page.url.pathname}/anotate" >Anotar</Button>
	</div>
</div>
