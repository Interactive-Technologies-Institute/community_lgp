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
  let theme = "(1ºCEB) PORTUGUÊS/ FAMÍLIA"

  signs = data?.signs 
</script>

<MetaTags title="LGP4Fun" description="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />

<PageHeader title="LGP4Fun" subtitle="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />
<!--Main container-->
<div
	class="flex flex-col justify-center text-slate-100 font-Hellovetica items-center p-4 w-full"
>
	<!-- Title container -->
  <div class="relative mt-2 border-slate-800 border-[3px]">
    <!--Game-->
    <iframe
      bind:this={iframeRef}
      src="/game/lgp4fun"
      frameborder="0"
      title="LGP4Fun"
      height="500"
      width="888.89"
      on:load={() => {
        gameLoaded = true;
      }}
      class=""
    />
    <!--Corners-->
    <div
      class="h-[3px] bg-[#0C0F19] w-[3px] z-10 absolute -top-[3px] -left-[3px]"
    />
    <div
      class="h-[3px] bg-[#0C0F19] w-[3px] z-10 absolute -bottom-[3px] -left-[3px]"
    />
    <div
      class="h-[3px] bg-[#0C0F19] w-[3px] z-10 absolute -top-[3px] -right-[3px]"
    />
    <div
      class="h-[3px] bg-[#0C0F19] w-[3px] z-10 absolute -bottom-[3px] -right-[3px]"
    />
  </div>
</div>