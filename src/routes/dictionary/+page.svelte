<script lang="ts">
	import DictionaryLayout from '@/components/dictionary/DictionaryLayout.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
</script>
<MetaTags
		title="Dicionário Geral"
		description="Página príncipal do dicionário geral"
		openGraph={{
			title: "Dicionário Geral",
			description: "Página príncipal do dicionário geral",
		}}
		twitter={{
			cardType: 'summary_large_image',
			title: "Dicionário Geral",
			description: "Página príncipal do dicionário geral",
		}}
	/>
<div>
	<div class="container mx-auto flex flex-auto flex-col items-start justify-start overflow-x-auto pt-2">
		<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl"> Dicionário Geral</h1>
		<p class="mt-1 mb-10 leading-7 text-foreground">Pesquise um gesto através do seus parâmetros ou por texto.</p>
	</div>
	<DictionaryLayout {data} />
</div>
