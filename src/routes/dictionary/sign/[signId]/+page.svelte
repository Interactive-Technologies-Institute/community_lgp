<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';
	import type { Sign } from '@/types/types';
	import AnnotationShowcase from '../../../../lib/components/dictionary/AnnotationShowcase.svelte';
	export let data;
	export let sign : Sign | null = data.sign;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div class="flex justify-start mx-72 py-10 gap-8">
	<div class="flex flex-col space-y-4 w-[600px]">
		<video class="w-full h-auto rounded-2xl" controls playsinline>
		  <source src={sign?.video} type="video/mp4" />
		  Your browser does not support the video tag.
		</video>
	
		<AnnotationShowcase data={data.parameters} />

		{#if sign?.context_video}
		<video class="w-full h-auto rounded-2xl" controls playsinline>
			
			<source src={sign?.context_video} type="video/mp4" />
			Your browser does not support the video tag.
		  </video>
		{/if}
	  </div>
  
    
    <div class="flex flex-col justify-start ml-10">
		<h1 class="text-2xl font-bold">{sign?.name}</h1>
	
		<h2 class="mt-2 text-lg">
		  {#if sign?.theme}
			{#each sign?.theme as t}
			  <Badge variant="outline" class="m-1">{t}</Badge>
			{/each}
		  {:else}
			Sem temas atribuídos.
		  {/if}
		</h2>

		<h2 class="mt-2 text-lg">
		  {#if sign?.district}
			  <Badge variant="outline" class="m-1">{sign.district}</Badge>
		  {/if}
		</h2>

		<h2 class="mt-[360px] text-xl">
			{#if sign?.description}
			  {sign?.description}
			{/if}
		</h2>
		

		<h2 class="mt-[300px] text-xl">
			{#if sign?.sentence}
			  {sign?.sentence}
			{/if}
		</h2>
	  </div>
	
</div>


