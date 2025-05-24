<script>
  import PageHeader from '@/components/page-header.svelte';
  import { MetaTags } from 'svelte-meta-tags';
  import { onMount } from 'svelte';

  export let data;
  
  // State for the selected letter
  let selectedLetter = '';
  let gameLoaded = false;
  
  onMount(() => {
    // Define a global function that Godot can call
    window.onLetterSelected = function(letter) {
      console.log("Letter selected:", letter);
      selectedLetter = letter;
      // Make sure Svelte updates the UI
      setTimeout(() => {}, 0);
    };
  });
</script>

<!-- <MetaTags title="LGP4Fun" description="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />

<PageHeader title="LGP4Fun" subtitle="Aprende Língua Portuguesa e Língua Gestual Portuguesa" /> -->
<!--Main container-->
<div
	class="flex flex-col justify-center text-slate-100 font-Hellovetica items-center p-4 w-full"
>
	<!-- Title container
	<div
		class="flex flex-col justify-center items-center space-y-4 text-center"
	>
    {#if gameLoaded}
      {#if selectedLetter}
        <div class="letter-display">
          <h2>Selected Letter: {selectedLetter}</h2>
        </div>
      {/if}
    {/if}
	</div> -->
  <div class="relative mt-5 border-slate-800 border-[3px]">
    <!--Game-->
    <iframe
      src="game/lgp4fun.html"
      frameborder="0"
      title="LGP4Fun"
      height="540"
      width="960"
      on:load={() => gameLoaded = true}
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