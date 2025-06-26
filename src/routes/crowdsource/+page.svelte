<script lang="ts">
	import { Button } from '@/components/ui/button';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { PlusCircle } from 'lucide-svelte';

	export let data;
</script>

<div class="mx-72 my-10 flex items-end justify-end">
	{#if data?.user?.role == 'admin'}
		<Button href="/dictionary/sign/create" class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2">
			<PlusCircle class="h-4 w-4 sm:mr-2" />
			<span class="sr-only sm:not-sr-only">Propor uma nova entrada de gesto</span>
		</Button>
	{/if}
</div>

<div class="flex mx-72">
	<div class="flex justify-start items-start mr-10">
		Gestos a aprovar
	</div>

	<Separator orientation="vertical" class="h-72"/>

	<div class="flex justify-start items-start ml-10">
		Gestos aprovados
	</div>
</div>
