<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { consentSchema, type ConsentSchema } from '@/schemas/consent';
	import { CONSENT_TEXT_PARAGRAPHS } from '@/consent-text';
	import { goto } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { Confetti } from 'svelte-confetti';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { PUBLIC_R2_PUBLIC_URL } from '$env/static/public';

	const CONSENT_VIDEO_URL = `${PUBLIC_R2_PUBLIC_URL}/consent-lgp.mp4`;

	export let data: { consent: SuperValidated<Infer<ConsentSchema>> };

	let showConfetti = false;

	const form = superForm(data.consent, {
		validators: zodClient(consentSchema),
		taintedMessage: null,
		// Fires as soon as the user submits, before the server round-trip, so the
		// celebration feels instant rather than lagging behind the redirect. If the
		// submission turns out to fail (e.g. a DB error), onResult hides it again
		// before the animation has time to play.
		onSubmit() {
			showConfetti = true;
		},
		onResult({ result }) {
			if (result.type !== 'redirect') {
				showConfetti = false;
			}
		},
	});

	const { form: formData, enhance, submitting } = form;

	let declineOpen = false;
	let videoAvailable: boolean | null = null;
	let showText = false;
</script>

<MetaTags
	title="Dataset ISLR"
	description="Contribua com vídeos para o dataset de reconhecimento de gestos isolados (ISLR) de Língua Gestual Portuguesa."
/>

{#if showConfetti}
	<div
		style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; pointer-events: none;"
		aria-hidden="true"
	>
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			duration={1200}
			amount={200}
			fallDistance="100vh"
		/>
	</div>
{/if}

<div class="mx-auto max-w-[760px] px-4 pb-12 pt-8">
	<div class="flex flex-col items-start gap-5">
		<div class="flex flex-col gap-1.5">
			<h1 class="text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">
				Contribua com os seus gestos
			</h1>
			<p class="leading-7 text-foreground">Veja o vídeo e dê o seu consentimento para começar.</p>
		</div>

		<div class="flex w-full flex-col gap-2">
			<!-- svelte-ignore a11y-media-has-caption -->
			<video
				class="aspect-video w-full rounded-[14px] object-cover"
				class:hidden={videoAvailable === false}
				controls
				playsinline
				on:loadedmetadata={() => (videoAvailable = true)}
				on:error={() => (videoAvailable = false)}
			>
				<source src={CONSENT_VIDEO_URL} type="video/mp4" />
				O seu navegador não suporta a reprodução deste vídeo.
			</video>

			{#if videoAvailable !== false}
				<button
					type="button"
					class="self-start text-[14px] font-medium text-brand-blue underline"
					on:click={() => (showText = !showText)}
				>
					{showText ? 'Ocultar' : 'Mostrar'} texto do vídeo
				</button>
			{/if}
		</div>

		{#if videoAvailable === false || showText}
			<div class="w-full space-y-4">
				<div class="max-h-96 space-y-4 overflow-y-auto rounded-lg border p-4">
					{#each CONSENT_TEXT_PARAGRAPHS as paragraph}
						<p class="text-justify leading-7 text-foreground">{paragraph}</p>
					{/each}
				</div>
			</div>
		{/if}

		<form method="POST" action="?/consent" use:enhance class="flex w-full flex-col gap-5">
			<label
				class="flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 bg-[#eaf3fe] px-6 py-5"
				style="border-color: {$formData.consent ? '#3a96f7' : '#bcd8fb'}"
			>
				<input
					type="checkbox"
					name="consent"
					class="m-0 h-7 w-7 shrink-0 cursor-pointer accent-[#3a96f7]"
					bind:checked={$formData.consent}
				/>
				<span class="text-[17px] font-medium leading-[1.5] text-[#1f2330]"
					>Li e compreendi a informação acima e autorizo a gravação de vídeos para fins de
					investigação científica e para a construção do conjunto de dados.</span
				>
			</label>

			<div class="flex flex-wrap items-center gap-3">
				<Button
					type="submit"
					disabled={!$formData.consent || $submitting}
					class="h-14 w-auto whitespace-nowrap bg-[#3a96f7] px-10 py-0 text-[17px] font-bold text-white hover:bg-[#3a96f7]/90 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Aceitar e começar →
				</Button>
				<Button
					type="button"
					variant="outline"
					class="h-14 w-auto whitespace-nowrap border-[#bcd8fb] bg-white px-10 py-0 text-[17px] font-semibold text-[#2b2b9c] hover:bg-[#eaf3fe]"
					on:click={() => (declineOpen = true)}
				>
					Não quero participar
				</Button>
			</div>
		</form>

		<p class="text-[13px] text-[#555]">
			Dúvidas: <a href="mailto:joana.peixinho@tecnico.ulisboa.pt" class="text-[#3a96f7]"
				>joana.peixinho@tecnico.ulisboa.pt</a
			>
			·
			<a href="mailto:hugo.nicolau@tecnico.ulisboa.pt" class="text-[#3a96f7]"
				>hugo.nicolau@tecnico.ulisboa.pt</a
			>
		</p>
	</div>
</div>

<AlertDialog.Root bind:open={declineOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Tens a certeza?</AlertDialog.Title>
			<AlertDialog.Description>A tua ajuda seria valiosa.</AlertDialog.Description>
			<img src="/img/sad-hand-icon.png" alt="" aria-hidden="true" class="mx-auto h-40 w-40" />
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => goto('/')}>Sair mesmo assim</AlertDialog.Cancel>
			<AlertDialog.Action>Continuar a ajudar</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
