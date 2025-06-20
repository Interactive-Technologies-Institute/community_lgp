<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { PlusCircle } from 'lucide-svelte';

    export let data;
</script>

<div class="mx-72 flex items-start justify-start">
	{#if data?.user?.role == 'admin'}
		<Button href="/crowdsource/proposals/create" class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2">
			<PlusCircle class="h-4 w-4 sm:mr-2" />
			<span class="sr-only sm:not-sr-only">Propor uma nova entrada de gesto</span>
		</Button>
	{/if}
</div>