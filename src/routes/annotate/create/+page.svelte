<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import AnnotateForm from '../_components/annotate-form.svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let data;

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		goto('/annotate');
	}
</script>

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

		<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">Adicionar entrada de gesto</h1>
		<p class="mt-1 mb-10 leading-7 text-foreground">Preencha as informações da entrada de gesto.</p>
	</div>

</div>
<div class="mb-20">
	<AnnotateForm
		data={data.createForm}
		user={data.user}
		parameter={data.parameters}
		themes={data.themes}
		dictionaries={data.dictionaries}
	/>
</div>
