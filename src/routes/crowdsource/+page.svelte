<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
</script>

<MetaTags title="Central de Crowdsource" description="Proponha uma nova entrada de gesto, consulte as propostas que estão a decorrer e participe na deliberação
de novos termos." />

<PageHeader
	title="Central de Crowdsource"
	subtitle="Proponha uma nova entrada de gesto, consulte as propostas que estão a decorrer e participe na deliberação
de novos termos."
/>

<div class="mx-72 my-10 flex items-end justify-end">
	{#if data?.user?.role == 'admin'}
		<Button href="/dictionary/sign/create" class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2">
			<PlusCircle class="h-4 w-4 sm:mr-2" />
			<span class="sr-only sm:not-sr-only">Propor uma nova entrada de gesto</span>
		</Button>
	{/if}
</div>

<div class="mx-72 flex">
	<div class="mr-10 flex items-start justify-start">Propostas em processo de aprovação</div>

	<Separator orientation="vertical" class="h-72" />

	<div class="ml-10 flex items-start justify-start">Propostas aprovadas</div>
</div>
