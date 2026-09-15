<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import PageHeader from '@/components/page-header.svelte';
	import { consentSchema, type ConsentSchema } from '@/schemas/consent';
	import { CONSENT_TEXT_PARAGRAPHS } from '@/consent-text';
	import { Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: { consent: SuperValidated<Infer<ConsentSchema>> };

	const form = superForm(data.consent, {
		validators: zodClient(consentSchema),
		taintedMessage: null,
	});

	const { form: formData, enhance, submitting } = form;

	let confirmOpen = false;
	let videoAvailable: boolean | null = null;
	let showText = false;

	function handleConfirm() {
		form.submit();
	}
</script>

<MetaTags
	title="Dataset ISLR"
	description="Contribua com vídeos para o dataset de reconhecimento de gestos isolados (ISLR) de Língua Gestual Portuguesa."
/>

<PageHeader
	title="Contribuição para o Dataset ISLR"
	subtitle="Veja o vídeo e leia o resumo abaixo antes de continuar."
/>

<div class="container mx-auto max-w-3xl space-y-8 pb-16">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		class="h-auto w-full rounded-2xl"
		class:hidden={videoAvailable === false}
		controls
		playsinline
		on:loadedmetadata={() => (videoAvailable = true)}
		on:error={() => (videoAvailable = false)}
	>
		<source src="/videos/consent-lgp.mp4" type="video/mp4" />
		O seu navegador não suporta a reprodução deste vídeo.
	</video>

	{#if videoAvailable === true}
		<button
			type="button"
			class="text-sm font-medium text-brand-blue underline"
			on:click={() => (showText = !showText)}
		>
			{showText ? 'Ocultar' : 'Mostrar'} texto do vídeo
		</button>
	{/if}

	{#if videoAvailable !== true || showText}
		<div class="space-y-4">
			<h2 class="text-xl font-bold text-brand-dark">Resumo em texto</h2>
			<div class="max-h-96 space-y-4 overflow-y-auto rounded-lg border p-4">
				{#each CONSENT_TEXT_PARAGRAPHS as paragraph}
					<p class="text-justify leading-7 text-foreground">{paragraph}</p>
				{/each}
			</div>
		</div>
	{/if}

	<form method="POST" action="?/consent" use:enhance class="flex flex-wrap gap-4">
		<label class="flex w-full items-center gap-2 text-sm text-foreground">
			<input
				type="checkbox"
				name="consent"
				value="true"
				checked={$formData.consent === 'true'}
				on:change={(e) => ($formData.consent = e.currentTarget.checked ? 'true' : '')}
			/>
			<span
				>Li e compreendi a informação acima e autorizo a gravação de vídeos para fins de
				investigação científica e para a construção do conjunto de dados.</span
			>
		</label>
		<Button
			type="button"
			disabled={$formData.consent !== 'true' || $submitting}
			class="bg-brand-blue hover:bg-brand-blue/90"
			on:click={() => (confirmOpen = true)}
		>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submeter
		</Button>
		<Button variant="outline" href="/">Não quero participar</Button>
	</form>
</div>

<AlertDialog.Root bind:open={confirmOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirmar a sua escolha</AlertDialog.Title>
			<AlertDialog.Description>
				Ao confirmar, vai poder começar a contribuir com vídeos para o Dataset ISLR.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={$submitting}>Cancelar</AlertDialog.Cancel>
			<AlertDialog.Action disabled={$submitting} on:click={handleConfirm}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Confirmar
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
