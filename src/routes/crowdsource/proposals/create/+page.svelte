<script lang="ts">
	import PageHeader from "@/components/page-header.svelte";
	import { MetaTags } from "svelte-meta-tags";
	import ProposalForm from "./_components/proposal-form.svelte";
    export let data;
</script>


<MetaTags
	title="Criar proposta"
	description="Crie uma nova proposta de entrada de gesto e partilhe-a com a comunidade"
/>

<PageHeader title="Criar proposta" subtitle="Crie uma nova proposta de entrada de gesto e partilhe-a com a comunidade" />

<div class="container mx-auto mb-20">
	<ProposalForm data={data.createForm} />
</div>