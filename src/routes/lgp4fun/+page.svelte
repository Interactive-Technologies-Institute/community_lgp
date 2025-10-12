<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { onMount } from 'svelte';
	import type { Sign } from '@/types/types';

	export let data;

	// State for the selected letter
	let gameLoaded = false;

	let iframeRef: HTMLIFrameElement;

	let signs: Sign[] = [];
	let theme = '(1ºCEB) PORTUGUÊS/ FAMÍLIA';

	signs = data?.signs;
</script>

<MetaTags title="LGP4Fun" description="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />

<PageHeader title="LGP4Fun" subtitle="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />
<!--Main container-->
<div class="font-Hellovetica flex w-full flex-col items-center justify-center p-4 text-slate-100">
	<!-- Title container -->
	<div class="relative mt-2 border-[3px] border-slate-800">
		<!--Game-->
		<iframe
			bind:this={iframeRef}
			src="/game/index.html"
			frameborder="0"
			title="LGP4Fun"
			height="540"
			width="960"
			on:load={() => {
				gameLoaded = true;
			}}
			class=""
		/>
		<!--Corners-->
		<div class="absolute -left-[3px] -top-[3px] z-10 h-[3px] w-[3px] bg-[#0C0F19]" />
		<div class="absolute -bottom-[3px] -left-[3px] z-10 h-[3px] w-[3px] bg-[#0C0F19]" />
		<div class="absolute -right-[3px] -top-[3px] z-10 h-[3px] w-[3px] bg-[#0C0F19]" />
		<div class="absolute -bottom-[3px] -right-[3px] z-10 h-[3px] w-[3px] bg-[#0C0F19]" />
	</div>
</div>
