<script lang="ts">
	import DictionaryLayout from '@/components/dictionary/DictionaryLayout.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { OG_IMAGE, SITE_TITLE, SITE_URL } from '@/seo';

	export let data;
</script>
<MetaTags
		title="Dicionário Geral"
		description="Página príncipal do dicionário geral"
		openGraph={{
			type: 'website',
			url: `${SITE_URL}/dictionary`,
			title: "Dicionário Geral",
			description: "Página príncipal do dicionário geral",
			siteName: SITE_TITLE,
			locale: 'pt_PT',
			images: [OG_IMAGE],
		}}
		twitter={{
			cardType: 'summary_large_image',
			title: "Dicionário Geral",
			description: "Página príncipal do dicionário geral",
			image: OG_IMAGE.url,
			imageAlt: OG_IMAGE.alt,
		}}
	/>
<div>
	<div class="container mx-auto flex flex-auto flex-col items-start justify-start overflow-x-auto pt-2">
		<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl"> Dicionário Geral</h1>
		<p class="mt-1 mb-10 leading-7 text-foreground">Pesquise um gesto através do seus parâmetros ou por texto.</p>
	</div>
	<DictionaryLayout {data} />
</div>
