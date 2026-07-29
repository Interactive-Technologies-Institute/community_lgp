<script lang="ts">
	import SignForm from '@/components/dictionary/sign/sign-form.svelte';
	import PageHeader from '@/components/page-header.svelte';

	export let data;
</script>

<PageHeader
	title="Entrada de Gesto"
	subtitle="Adicione uma nova entrada de gesto ao Dicionário de Lingua Gestual Portuguesa."
/>
<div class="container mx-auto mb-20">
	<SignForm data={data.createForm} user={data.user} />
</div>