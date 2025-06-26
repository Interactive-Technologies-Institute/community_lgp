<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { Sign } from '@/types/types';
	import AnnotateTable from './_components/AnnotateTable.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import { PlusCircle } from 'lucide-svelte';

	export let data;
	let signs: Sign[] = data.signs;
	let nonAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated === 0);
	let semiAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated === 1);
	let fullyAnotatedSigns: Sign[] = signs.filter((sign) => sign.is_anotated === 2);
</script>

<PageHeader
	title="Anotações"
	subtitle="Crie uma nova entrada de um gesto, anote ou altere as anotações de um gesto."
/>

<div class="mx-72 flex items-start justify-start">
	{#if data?.user?.role == 'moderator' || data?.user?.role == 'admin'}
		<Button href="/annotate/create" class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2">
			<PlusCircle class="h-4 w-4 sm:mr-2" />
			<span class="sr-only sm:not-sr-only">Adicionar entrada de gesto</span>
		</Button>
	{/if}
</div>
<div class="grid grid-cols-2 gap-4">
	<div class="col-span-2 px-72 py-8">
		<h2 class="text-2xl font-bold">Anotações Pendentes</h2>
		<p class="text-sm text-gray-500">Anotações que ainda não foram feitas.</p>
		<Separator class="my-4 w-[40%]" />
		<AnnotateTable signs={nonAnotatedSigns} />
	</div>

	<div class="col-span-2 px-72 py-8">
		<h2 class="text-2xl font-bold">Anotações Semi-Concluídas</h2>
		<p class="text-sm text-gray-500">Anotações que foram parcialmente feitas.</p>
		<Separator class="my-4 w-[40%]" />
		<AnnotateTable signs={semiAnotatedSigns} />
	</div>

	<div class="col-span-2 px-72 py-8">
		<h2 class="text-2xl font-bold">Anotações Concluídas</h2>
		<p class="text-sm text-gray-500">Anotações que foram concluídas.</p>
		<Separator class="my-4 w-[40%]" />
		<AnnotateTable signs={fullyAnotatedSigns} />
	</div>
</div>
