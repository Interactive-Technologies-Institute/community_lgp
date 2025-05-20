<script lang="ts">
	import SignForm from '../../dictionary/_components/sign-form.svelte';
	import PageHeader from '@/components/page-header.svelte';
	export let data;
</script>

<PageHeader
	title="Entrada de Gesto"
	subtitle="Altere esta entrada de gesto, complementando a sua anotação."
/>
<div class="container mx-auto mb-20">
	<SignForm data={data.updateForm} user={data.user} parameter={data.parameters} />
</div>
