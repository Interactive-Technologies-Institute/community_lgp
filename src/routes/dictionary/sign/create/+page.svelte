<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import SignForm from '../../_components/sign-form.svelte';

	export let data;
</script>

<PageHeader title="Entrada de Gesto" subtitle="Adicione uma nova entrada de gesto ao Dicionário de Lingua Gestual Portuguesa." />
<div class="container mx-auto mb-20">
	<SignForm data={data.createForm} />
</div>
