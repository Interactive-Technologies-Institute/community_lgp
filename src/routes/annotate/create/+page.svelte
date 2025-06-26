<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import AnnotateForm from '../_components/annotate-form.svelte';

	export let data;
</script>

<PageHeader
	title="Entrada de Gesto"
	subtitle="Adicione uma nova entrada de gesto ao Dicionário de Lingua Gestual Portuguesa."
/>
<div class="container mx-auto mb-20">
	<AnnotateForm data={data.createForm} user={data.user} parameter={data.parameters} />
</div>
