<script lang="ts">
    import type { Parameter, Sign } from '@/types/types';
	import AnnotationShowcase from '../../../lib/components/dictionary/AnnotationShowcase.svelte';
	import Badge from '@/components/ui/badge/badge.svelte';
	import AnnotationLayout from '@/components/dictionary/AnnotationLayout.svelte';
	import { Button } from '@/components/ui/button';
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Card from "$lib/components/ui/card";
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
    export let data;
    let sign : Sign | null = data.sign;
	let parameter: Parameter[] = data.parameters;
</script>


<!-- svelte-ignore a11y-media-has-caption -->
<div class="flex justify-start mx-72 py-10 gap-8">
	<div class="flex flex-col space-y-4 w-[600px]">
		<video class="w-full h-auto rounded-2xl" controls playsinline>
		  <source src={sign?.video} type="video/mp4" />
		  Your browser does not support the video tag.
		</video>
	
		<AnnotationShowcase data={data.parametersById} />

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

<div class="flex items-center justify-center">
<Tabs.Root value="annotation" class="w-[1000px]">
	<div class="flex items-center justify-center">
	<Tabs.List>
	  <Tabs.Trigger value="annotation">Anotação Fonológica</Tabs.Trigger>
	  <Tabs.Trigger value="content">Conteúdo</Tabs.Trigger>
	</Tabs.List>
</div>
	<Tabs.Content value="annotation">
	<Card.Root>
		
		<Card.Content>
			<div class ="py-5">
			<AnnotationLayout {parameter} />
		</div>
	
		</Card.Content>
	
	</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="content"></Tabs.Content>
  </Tabs.Root>
</div>