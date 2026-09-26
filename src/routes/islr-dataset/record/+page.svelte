<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import WebcamRecording from '@/components/WebcamAutoRecording.svelte';
	import { PERSONAL_MILESTONES, PERSONAL_MILESTONE_LABELS } from '@/islr-milestones';
	import { submitIslrVideoSchema, type SubmitIslrVideoSchema } from '@/schemas/islr-submission';
	import { browser } from '$app/environment';
	import { beforeNavigate, goto } from '$app/navigation';
	import { AlertTriangle, Check, SkipForward } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { Confetti } from 'svelte-confetti';
	import { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: {
		currentSign: { id: number; name: string; video: string };
		nextSignId: number | null;
		nextSignName: string | null;
		queueLength: number;
		myVideoCount: number;
		nextMilestoneIndex: number;
		milestoneFloor: 0 | (typeof PERSONAL_MILESTONES)[number];
		milestoneCeiling: (typeof PERSONAL_MILESTONES)[number];
		submitForm: SuperValidated<Infer<SubmitIslrVideoSchema>>;
	};

	$: ({
		currentSign,
		nextSignId,
		nextSignName,
		queueLength,
		myVideoCount,
		nextMilestoneIndex,
		milestoneFloor,
		milestoneCeiling,
	} = data);

	function formatNumber(value: number) {
		return value.toLocaleString('pt-PT');
	}

	$: milestonesMaxed = nextMilestoneIndex >= PERSONAL_MILESTONES.length;
	$: videosUntilNextMilestone = milestonesMaxed ? 0 : milestoneCeiling - myVideoCount;
	$: segmentSpan = milestoneCeiling - milestoneFloor;
	$: segmentProgressPercent = milestonesMaxed
		? 100
		: Math.min(100, Math.max(0, ((myVideoCount - milestoneFloor) / segmentSpan) * 100));

	// Confirms internal navigations away from the recording flow (link clicks,
	// goto, back/forward). Navigations that unload the whole app (closing the
	// tab, an external link) are left alone - browsers don't allow customizing
	// that prompt, so there's no point trying.
	let showLeaveConfirm = false;
	let pendingUrl: URL | null = null;
	let leaveConfirmed = false;

	beforeNavigate((navigation) => {
		if (leaveConfirmed || navigation.willUnload) return;
		if (navigation.to?.url.pathname === '/islr-dataset/record') return;

		navigation.cancel();
		pendingUrl = navigation.to?.url ?? null;
		showLeaveConfirm = true;
	});

	function confirmLeave() {
		leaveConfirmed = true;
		showLeaveConfirm = false;
		if (pendingUrl) goto(pendingUrl);
	}

	let confettiTrigger = 0;

	const form = superForm(data.submitForm, {
		validators: zodClient(submitIslrVideoSchema),
		taintedMessage: null,
		// The submit action returns normally instead of redirecting (see
		// +page.server.ts), so this reloads `load` to advance to the next sign.
		invalidateAll: 'force',
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
	title="Gravar gesto - Dataset ISLR"
	description={`Grave um vídeo de referência para o gesto "${currentSign.name}".`}
/>

{#if confettiTrigger > 0}
	{#key confettiTrigger}
	<div
		style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; pointer-events: none;"
		aria-hidden="true"
	>
		<Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} duration={1200} amount={200} fallDistance="100vh" />
	</div>
	{/key}
{/if}

<form
	method="POST"
	action="?/submit"
	enctype="multipart/form-data"
	use:enhance
	class="flex flex-col gap-y-4"
>
	<input type="hidden" name="signId" value={$formData.signId} />
	<input type="file" name="video" bind:files={$video} bind:this={videoInput} class="hidden" />

	<section class="rounded-[2rem] bg-brand-surface shadow-md">
		<div class="container mx-auto space-y-6 p-4">
			<h2 class="text-center text-2xl font-black text-brand-dark sm:text-3xl">{currentSign.name}</h2>
			<div class="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-10">
				<Card.Root
					class="h-full w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none dark:bg-muted-foreground"
				>
					<div class="flex h-full w-full flex-col items-start gap-4">
						<h3 class="text-xl font-extrabold text-brand-dark sm:text-2xl">Vídeo de referência</h3>
						{#key currentSign.id}
							<!-- svelte-ignore a11y-media-has-caption -->
							<video
								class="aspect-video w-full rounded-2xl bg-black object-cover"
								controls
								playsinline
							>
								<source src={currentSign.video} type="video/mp4" />
								O seu navegador não suporta a reprodução deste vídeo.
							</video>
						{/key}
						<div class="flex-1"></div>
					</div>
				</Card.Root>

				<Card.Root
					class="h-full w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none dark:bg-muted-foreground"
				>
					<div class="flex h-full w-full flex-col items-start gap-4">
						<h3 class="text-xl font-extrabold text-brand-dark sm:text-2xl">Repita o gesto</h3>
						{#key currentSign.id}
							{#if cameraError}
								<div class="w-full rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
									<p class="flex items-center justify-center gap-2 text-sm text-destructive">
										<AlertTriangle class="h-4 w-4" />
										Não foi possível aceder à câmara.
									</p>
									<input
										type="file"
										accept="video/*"
										class="mt-3 w-full text-sm text-brand-dark"
										on:change={handleFallbackFile}
									/>
									{#if hasRecording}
										<Button type="submit" disabled={$submitting} class="mt-3 h-12 w-full gap-2 font-bold">
											<Check class="h-4 w-4" />
											Submeter
										</Button>
									{/if}
								</div>
							{:else}
								<WebcamRecording
									submitting={$submitting}
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

	<div
		class="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container mx-auto max-w-3xl px-4 py-3">
			<div class="flex items-center justify-between gap-2">
				<p class="text-sm font-semibold text-brand-dark">O seu progresso pessoal</p>
				<p class="text-sm font-semibold text-brand-dark">
					{formatNumber(myVideoCount)} / {formatNumber(milestoneCeiling)} vídeos
				</p>
			</div>
			<div class="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-brand-border/40">
				<div
					class="h-full rounded-full bg-brand-yellow transition-all"
					style="width: {segmentProgressPercent}%"
				></div>
			</div>
			<p class="mt-1 text-center text-xs font-medium text-foreground">
				{#if milestonesMaxed}
					Atingiu todas as conquistas pessoais. Obrigado pelo seu esforço!
				{:else}
					Faltam <strong>{formatNumber(videosUntilNextMilestone)}</strong> vídeos para a conquista "{PERSONAL_MILESTONE_LABELS[
						milestoneCeiling
					]}"
				{/if}
			</p>

			{#if nextSignName}
				<p class="mt-2 text-center text-sm font-medium text-foreground">
					Próximo gesto: <strong class="text-brand-dark">{nextSignName}</strong>
				</p>
			{/if}

			<div class="mt-4 flex w-full items-center justify-center">
				<Button type="button" on:click={skip} disabled={nextSignId === null} variant="outline">
					<SkipForward class="h-4 w-4" />
					Saltar
				</Button>
			</div>
		</div>
	</div>
</form>

<AlertDialog.Root bind:open={showLeaveConfirm}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Tem a certeza que quer sair?</AlertDialog.Title>
			<AlertDialog.Description>
				{#if milestonesMaxed}
					Já gravou {formatNumber(myVideoCount)} vídeos. Atingiu todas as conquistas pessoais!
				{:else}
					Já gravou {formatNumber(myVideoCount)} vídeos, faltam {formatNumber(
						videosUntilNextMilestone
					)} para "{PERSONAL_MILESTONE_LABELS[milestoneCeiling]}".
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Continuar a gravar</AlertDialog.Cancel>
			<AlertDialog.Action on:click={confirmLeave}>Sair</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
