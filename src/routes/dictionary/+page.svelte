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
	<DictionaryLayout {data} />
</div>
