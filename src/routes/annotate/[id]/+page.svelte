<script lang="ts">
	import { Trash } from 'lucide-svelte';
	import SignForm from '../../dictionary/_components/sign-form.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	// import SignDeleteDialog from '../_components/sign-delete-dialog.svelte'; 
	export let data;

	let openDeleteDialog = false;
</script>

<PageHeader
	title="Entrada de Gesto"
	subtitle="Altere esta entrada de gesto, complementando a sua anotação."
/>
<div class="container mx-auto mb-20">
	<SignForm data={data.updateForm} user={data.user} parameter={data.parameters} />
	<!--
	<div class="flex items-center justify-center">
	 <Button variant="destructive" on:click={() => (openDeleteDialog = true)}>
				<Trash class="mr-2 h-4 w-4" />
				Apagar
			</Button>
			</div> 
</div>-->
