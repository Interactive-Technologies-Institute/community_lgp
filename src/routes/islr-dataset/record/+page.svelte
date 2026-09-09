<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import PageHeader from '@/components/page-header.svelte';
	import WebcamRecording from '@/components/WebcamAutoRecording.svelte';
	import { submitIslrVideoSchema, type SubmitIslrVideoSchema } from '@/schemas/islr-submission';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { AlertTriangle, Check, SkipForward } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { Confetti } from 'svelte-confetti';
	import { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: {
		currentSign: { id: number; name: string; video: string };
		nextSignId: number | null;
		queueLength: number;
		submitForm: SuperValidated<Infer<SubmitIslrVideoSchema>>;
	};

	$: ({ currentSign, nextSignId, queueLength } = data);

	let confettiTrigger = 0;

	const form = superForm(data.submitForm, {
		validators: zodClient(submitIslrVideoSchema),
		taintedMessage: null,
		// Fires as soon as the user submits, before the upload/server round-trip,
		// so the celebration feels instant rather than lagging behind the request.
		onSubmit() {
			confettiTrigger += 1;
		},
	});

	const { form: formData, enhance, submitting, message } = form;

	// Backs a hidden file input so the recorded/selected video rides along in the
	// native form submission (use:enhance builds FormData from the form's real
	// inputs, so a plain $formData.video assignment alone would not be sent).
	const video = fileProxy(form, 'video');

	$: if (currentSign && $formData.signId !== currentSign.id) {
		$formData.signId = currentSign.id;
	}

	let hasRecording = false;
	let cameraError = false;
	let videoInput: HTMLInputElement;

	function setVideoFile(file: File) {
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);
		// bind:files only reflects the native input -> store direction; Svelte
		// does not write the store back onto the DOM element, so the real input
		// (what use:enhance actually reads into FormData) has to be set directly.
		videoInput.files = dataTransfer.files;
		$video = dataTransfer.files;
	}

	// Reset per-sign state whenever we move to a different sign (skip or after a
	// submit) - {#key currentSign.id} only remounts the recorder, not these variables.
	let lastSignId: number | null = null;
	$: if (currentSign.id !== lastSignId) {
		lastSignId = currentSign.id;
		hasRecording = false;
		cameraError = false;
		if (browser) {
			if (videoInput) videoInput.files = new DataTransfer().files;
			$video = new DataTransfer().files;
		}
	}

	function handleRecorded(event: CustomEvent<{ file: File }>) {
		setVideoFile(event.detail.file);
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
		setVideoFile(file);
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

{#if confettiTrigger > 0}
	{#key confettiTrigger}
	<div style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden;">
		<Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} duration={1200} amount={200} fallDistance="100vh" />
	</div>
	{/key}
{/if}

<form
	method="POST"
	action="?/submit"
	enctype="multipart/form-data"
	use:enhance
	class="flex flex-col gap-y-6"
>
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
		<input type="file" name="video" bind:files={$video} bind:this={videoInput} class="hidden" />

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
