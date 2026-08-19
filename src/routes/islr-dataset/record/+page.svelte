<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import PageHeader from '@/components/page-header.svelte';
	import WebcamRecording from '@/components/WebcamRecording.svelte';
	import { submitIslrVideoSchema, type SubmitIslrVideoSchema } from '@/schemas/islr-submission';
	import { goto } from '$app/navigation';
	import { AlertTriangle, Check, SkipForward } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: {
		currentSign: { id: number; name: string; video: string };
		nextSignId: number | null;
		queueLength: number;
		submitForm: SuperValidated<Infer<SubmitIslrVideoSchema>>;
	};

	$: ({ currentSign, nextSignId, queueLength } = data);

	const form = superForm(data.submitForm, {
		validators: zodClient(submitIslrVideoSchema),
		taintedMessage: null,
	});

	const { form: formData, enhance, submitting, message } = form;

	$: if (currentSign && $formData.signId !== currentSign.id) {
		$formData.signId = currentSign.id;
	}

	// TODO: The recorded/selected video is not uploaded or persisted yet because the
	// storage destination and upload flow have not been decided. This state only enables
	// the submit action; it does not send the video file to the server.
	let hasRecording = false;
	let cameraError = false;

	// Reset per-sign state whenever we move to a different sign (skip or after a
	// submit) - {#key currentSign.id} only remounts the recorder, not these variables.
	let lastSignId: number | null = null;
	$: if (currentSign.id !== lastSignId) {
		lastSignId = currentSign.id;
		hasRecording = false;
		cameraError = false;
	}

	function handleRecorded() {
		hasRecording = true;
	}

	function handleRecordingStarted() {
		hasRecording = false;
	}

	function handleCameraError() {
		cameraError = true;
	}

	function handleFallbackFile(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		// The file is intentionally not retained or uploaded until storage is decided.
		hasRecording = true;
	}

	function skip() {
		if (nextSignId === null) return;
		goto(`/islr-dataset/record?sign=${nextSignId}`);
	}
</script>

<MetaTags
	title="Gravar sinal - Dataset ISLR"
	description={`Grave um vídeo de referência para o sinal "${currentSign.name}".`}
/>

<PageHeader title="Gravar Sinal" subtitle={`${queueLength} sinais por gravar.`} />

<form method="POST" action="?/submit" use:enhance class="flex flex-col gap-y-6">
<section class="rounded-[2rem] bg-brand-surface shadow-md">
	<div class="container mx-auto space-y-6 p-4">
		<h2 class="text-center text-2xl font-bold text-brand-dark dark:text-foreground">{currentSign.name}</h2>

		<div class="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-10">
			<Card.Root
				class="h-full w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none dark:bg-muted-foreground"
			>
				<div class="flex h-full w-full flex-col items-start gap-4">
					<h2 class="text-xl font-extrabold text-brand-dark sm:text-2xl">Vídeo de referência</h2>
					<!-- svelte-ignore a11y-media-has-caption -->
					<video class="aspect-video w-full rounded-lg bg-black object-contain" controls playsinline>
						<source src={currentSign.video} type="video/mp4" />
						O seu navegador não suporta a reprodução deste vídeo.
					</video>
				</div>
			</Card.Root>

			<Card.Root
				class="h-full w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none dark:bg-muted-foreground"
			>
				<div class="flex h-full w-full flex-col items-start gap-4">
					<h2 class="text-xl font-extrabold text-brand-dark sm:text-2xl">Gravar sinal</h2>
					{#key currentSign.id}
						{#if cameraError}
							<div class="w-full rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
								<p class="flex items-center justify-center gap-2 text-sm text-destructive">
									<AlertTriangle class="h-4 w-4" />
									Não foi possível aceder à câmara. Pode enviar um vídeo já gravado.
								</p>
								<input
									type="file"
									accept="video/*"
									class="mt-3 w-full text-sm text-brand-dark"
									on:change={handleFallbackFile}
								/>
							</div>
						{:else}
							<WebcamRecording
								on:recorded={handleRecorded}
								on:recording-started={handleRecordingStarted}
								on:error={handleCameraError}
							/>
						{/if}
					{/key}
				</div>
			</Card.Root>
		</div>
	</div>
</section>

	{#if $message}
		<div class="container mx-auto pb-4">
			<p class="text-center text-sm text-destructive">{$message}</p>
		</div>
	{/if}

	<div class="sticky bottom-0 z-50 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<input type="hidden" name="signId" value={$formData.signId} />

		<Button
			type="button"
			on:click={skip}
			disabled={nextSignId === null}
			variant="outline"
		>
			<SkipForward class="h-4 w-4" />
			Saltar
		</Button>

		{#if hasRecording}
			<Button type="submit" disabled={$submitting}>
				<Check class="h-4 w-4" />
				Submeter
			</Button>
		{/if}
	</div>
</form>
