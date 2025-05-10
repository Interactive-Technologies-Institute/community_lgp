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

		<h2 class="text-2xl">Utilização em Contexto</h2>
		<video class="w-full h-auto rounded-2xl" controls playsinline>
			<source src={sign?.context_video} type="video/mp4" />
			Your browser does not support the video tag.
		  </video>
	  </div>
  
    
    <div class="flex flex-col justify-start ml-10">
		<h1 class="text-2xl font-bold">{sign?.name}</h1>
	
		<h2 class="mt-2 text-lg">Temas: 
		  {#if sign?.theme}
			{#each sign?.theme as t}
			  <Badge variant="outline" class="m-1">{t}</Badge>
			{/each}
		  {:else}
			Sem temas atribuídos.
		  {/if}
		</h2>

		<h2 class="mt-2 text-lg">Variante Regional: 
		  {#if sign?.district}
			  <Badge variant="outline" class="m-1">{sign.district}</Badge>
		  {:else}
			Sem variante regional atribuída.
		  {/if}
		</h2>

		<h2 class="mt-[360px] text-xl">Descrição textual: 
			{#if sign?.description}
			  {sign?.description}
			{:else}
			  Sem descrição atribuída.
			{/if}
		</h2>
		

		<h2 class="mt-[300px] text-xl">
			Frase em Português:
			{#if sign?.sentence}
			  {sign?.sentence}
			{:else}
			  Sem frase atribuída.
			{/if}
		</h2>
	  </div>
	
</div>


