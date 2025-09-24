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
	<DictionaryLayout {data} />
</div>
