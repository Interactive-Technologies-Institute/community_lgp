<script lang="ts">
	import { Trash, ArrowLeft } from 'lucide-svelte';
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import SignDeleteDialog from '../_components/sign-delete-dialog.svelte';
	import AnnotateForm from '../_components/annotate-form.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { goto } from '$app/navigation';
	export let data;

	let openDeleteDialog = false;

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		goto('/annotate');
	}
</script>

<MetaTags
	title={`Anotação ${data.sign.name}`}
	description="Altere esta entrada de gesto, complementando a sua anotação."
/>

<div class="container mx-auto pt-2">
	<div class="flex flex-auto flex-col items-start justify-start overflow-x-auto">
		<Button
			variant="ghost"
			size="icon"
			class="h-10 w-10 rounded-full text-foreground hover:bg-transparent hover:text-foreground/80 justify-start"
			aria-label="Voltar"
			on:click={goBack}
		>
			<ArrowLeft class="h-6 w-6" />
		</Button>

		<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">Editar entrada de gesto</h1>
		<p class="mt-1 mb-10 leading-7 text-foreground">Edite as informações da entrada de gesto.</p>
	</div>

</div>
<div class="mb-20">
	<AnnotateForm data={data.updateForm} user={data.user} parameter={data.parameters} themes={data.themes} />
	
	<div class="flex items-center justify-center">
		<Button variant="destructive" on:click={() => (openDeleteDialog = true)}>
			<Trash class="mr-2 h-4 w-4" />
			Apagar
		</Button>
	</div>
</div>

<SignDeleteDialog signId={data.sign.id} data={data.deleteForm} bind:open={openDeleteDialog} />
