<script lang="ts">
	import { Button } from '@/components/ui/button';
	import PageHeader from '@/components/page-header.svelte';
	import { consentSchema, type ConsentSchema } from '@/schemas/consent';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: { consent: SuperValidated<Infer<ConsentSchema>> };

	const form = superForm(data.consent, {
		validators: zodClient(consentSchema),
		taintedMessage: null,
	});

	const { form: formData, enhance, submitting } = form;
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
	<!-- TODO: placeholder video, replace with the real consent explainer -->
	<video class="h-auto w-full rounded-2xl" controls playsinline>
		<source src="/videos/consent-lgp.mp4" type="video/mp4" />
		O seu navegador não suporta a reprodução deste vídeo.
	</video>

	<div class="space-y-4">
		<h2 class="text-xl font-bold text-brand-dark">Resumo em texto</h2>
		<p class="leading-7 text-foreground">
			Este projeto está a construir um conjunto de dados de vídeos de gestos isolados (ISLR -
			Isolated Sign Language Recognition) de Língua Gestual Portuguesa, a utilizar para investigação
			e desenvolvimento de ferramentas de reconhecimento automático de gestos.
		</p>
		<p class="leading-7 text-foreground">
			Ao contribuir, os vídeos que gravar serão associados à sua conta e poderão ser utilizados para
			treinar e avaliar modelos de reconhecimento de gestos, bem como para fins de investigação
			académica relacionados com este projeto. Os seus dados são tratados de acordo com a política
			de privacidade da plataforma.
		</p>
		<p class="leading-7 text-foreground">
			Pode deixar de contribuir a qualquer momento. Ao clicar em "Consinto" abaixo, está a confirmar
			que assistiu ao vídeo acima e que concorda com os termos aí descritos.
		</p>
	</div>

	<form method="POST" action="?/consent" use:enhance class="flex flex-wrap gap-4">
		<label class="flex w-full items-center gap-2 text-sm text-foreground">
			<input
				type="checkbox"
				name="consent"
				value="true"
				required
				checked={$formData.consent === 'true'}
				on:change={(e) => ($formData.consent = e.currentTarget.checked ? 'true' : '')}
			/>
			<span>Confirmo que li e concordo com os termos acima.</span>
		</label>
		<Button type="submit" disabled={$submitting} class="bg-brand-blue hover:bg-brand-blue/90">
			Consinto
		</Button>
		<Button variant="outline" href="/">Não consinto</Button>
	</form>
</div>
