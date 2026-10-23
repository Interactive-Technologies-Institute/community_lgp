<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
	export let form;
</script>

<MetaTags
	title="Resumo semanal"
	description="Deixar de receber o resumo semanal do Dataset ISLR."
/>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<PageHeader
	title="Resumo semanal do Dataset ISLR"
	subtitle="Escolha se quer continuar a receber o email semanal."
/>

<div class="container mb-20 flex max-w-2xl flex-col gap-y-6">
	{#if form?.unsubscribed}
		<p>
			Pronto, deixou de receber o resumo semanal. Pode continuar a contribuir sempre que quiser, e
			obrigado por tudo o que já gravou!
		</p>
		<div>
			<Button href="/islr-dataset/dashboard">Ver o meu progresso</Button>
		</div>
	{:else if !data.valid}
		<p>Este link não é válido. Confirme que copiou o endereço completo a partir do email.</p>
	{:else}
		<p>
			Quer deixar de receber o email semanal com o resumo das suas contribuições para o Dataset
			ISLR?
		</p>
		{#if form?.message}
			<p class="text-destructive">{form.message}</p>
		{/if}
		<form method="POST">
			<Button type="submit">Deixar de receber</Button>
		</form>
	{/if}
</div>
