<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import VariationForm from '@/components/dictionary/sign/variation-form.svelte';
	import { goto } from '$app/navigation';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		goto('/dictionary');
	}
</script>

<MetaTags
	title={`Proposta de Variante de Gesto`}
	description="Proponha uma nova variante do gesto ${data.sign.name}."
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

		<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">Proposta de Variante de Gesto</h1>
		<p class="mt-1 mb-10 leading-7 text-foreground">Proponha uma nova variante do gesto <strong>{data.sign.name}</strong>.</p>
	</div>
</div>

<div class="mb-20">
	<VariationForm
		data={data.createForm}
		user={data.user}
		parameter={data.parameters}
		mainSign={data.sign}
	/>
</div>
