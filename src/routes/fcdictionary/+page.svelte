<script lang="ts">
	import DictionaryLayout from '@/components/dictionary/DictionaryLayout.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
</script>

<MetaTags
		title="Dicionário de 1º Ciclo"
		description="Página príncipal do dicionário de primeiro ciclo"
		openGraph={{
			title: "Dicionário de 1º Ciclo",
			description: "Página príncipal do dicionário de primeiro ciclo",
		}}
		twitter={{
			cardType: 'summary_large_image',
			title: "Dicionário de 1º Ciclo",
			description: "Página príncipal do dicionário de primeiro ciclo",
		}}
	/>

<div>
		<div class="container mx-auto flex flex-auto flex-col items-start justify-start overflow-x-auto pt-2">
			<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl"> Dicionário 1º Ciclo</h1>
			<p class="mt-1 mb-10 leading-7 text-foreground">Pesquise um gesto através do seus parâmetros ou por texto.</p>
		</div>
	<DictionaryLayout {data} />
</div>
