<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import VariationForm from './_components/variation-form.svelte';

	export let data;
</script>

<PageHeader
	title="Proposta de Variante de Gesto"
	subtitle="Proponha uma nova variante do gesto {data.sign
		.name} do Dicionário de Lingua Gestual Portuguesa."
/>
<div class="container mx-auto mb-20">
	<VariationForm
		data={data.createForm}
		user={data.user}
		parameter={data.parameters}
		mainSign={data.sign}
	/>
</div>
