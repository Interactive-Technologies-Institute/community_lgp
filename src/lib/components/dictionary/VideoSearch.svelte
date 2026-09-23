<!--
	MOCK/SCRIPTED FOR PROMO VIDEO: this component is a non-functional demo built
	only for filming a recruitment teaser for the LGP ISLR thesis dataset. The
	webcam recording captured here is never actually processed by any ML model —
	the whole "countdown / recording / processing / results" sequence below is a
	scripted animation on a timer. After the fake "processing" delay, it simply
	triggers the exact same text-search code path used by TextSearch.svelte
	(same `s` query param, same Supabase query in +page.server.ts), with the
	query hardcoded to a fixed value per recording (first "não", then
	"abacate" for every recording after that — see MOCK_QUERIES below). Do
	not integrate this with real video/ML processing without review.
-->
<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { Loader2, Check, RotateCcw } from 'lucide-svelte';
	import { queryParam } from 'sveltekit-search-params';
	import { stringQueryParam } from '@/utils';
	import { videoSearchStage } from './video-search-state';

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});
	const page = queryParam('page', stringQueryParam());

	// MOCK: the recorded sign is never sent anywhere for real recognition — the first
	// recording is always treated as "não", every recording after that as "abacate".
	const MOCK_QUERIES = ['não', 'abacate'];
	let recordingCount = 0;
	const MAX_RECORD_MS = 5000;
	const MIN_LOADING_MS = 700;
	const DONE_MS = 800;
	const PROCESSING_MS = 2500;

	type Stage = 'loading' | 'idle' | 'countdown' | 'rec' | 'done' | 'processing' | 'results';

	let stage: Stage = 'loading';
	let videoEl: HTMLVideoElement;
	let canvasEl: HTMLCanvasElement;
	let stream: MediaStream | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let errorMessage = '';
	let frozenFrame = '';
	let countdownValue = 3;
	let elapsedMs = 0;
	let recordedSeconds = 0;
	let matchedQuery = MOCK_QUERIES[0];

	let timers: ReturnType<typeof setTimeout>[] = [];
	let intervals: ReturnType<typeof setInterval>[] = [];

	function after(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, ms));
	}

	function every(ms: number, fn: () => void) {
		intervals.push(setInterval(fn, ms));
	}

	function clearAllTimers() {
		timers.forEach(clearTimeout);
		intervals.forEach(clearInterval);
		timers = [];
		intervals = [];
	}

	function formatSeconds(totalSeconds: number) {
		return `0:${String(Math.max(0, totalSeconds)).padStart(2, '0')}`;
	}

	$: elapsedSeconds = Math.min(5, Math.floor(elapsedMs / 1000));
	$: progressPercent =
		stage === 'rec'
			? Math.min(100, (elapsedMs / MAX_RECORD_MS) * 100)
			: stage === 'done' || stage === 'processing' || stage === 'results'
				? 100
				: 0;

	$: stepLabel =
		stage === 'results'
			? 'CONCLUÍDO'
			: stage === 'processing'
				? 'PASSO 3 DE 3'
				: stage === 'rec' || stage === 'done'
					? 'PASSO 2 DE 3'
					: 'PASSO 1 DE 3';

	$: title =
		stage === 'countdown'
			? 'Prepare-se…'
			: stage === 'rec'
				? `A gravar · ${formatSeconds(elapsedSeconds)} / 0:05`
				: stage === 'done'
					? 'Gravação concluída'
					: stage === 'results'
						? 'Encontrámos gestos semelhantes'
						: stage === 'processing'
							? ''
							: 'Grave o gesto que procura';

	$: help =
		stage === 'countdown'
			? 'A gravação começa no fim da contagem.'
			: stage === 'rec'
				? 'Carregue em Parar quando terminar. Para automaticamente no limite.'
				: stage === 'done'
					? `${formatSeconds(recordedSeconds)} gravados.`
					: stage === 'processing'
						? 'Estamos a comparar a sua gravação com o dicionário.'
						: stage === 'results'
							? 'Não encontra o que procurava? Grave novamente.'
							: 'Faça o gesto uma vez, com calma. A gravação dura no máximo 5 segundos.';

	async function initCamera() {
		const startedAt = Date.now();
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
		} catch (err) {
			errorMessage = 'Não foi possível aceder à câmara.';
		}

		const remaining = Math.max(0, MIN_LOADING_MS - (Date.now() - startedAt));
		after(remaining, async () => {
			if (stream) {
				await tick();
				if (videoEl) {
					videoEl.srcObject = stream;
					await videoEl.play();
				}
			}
			stage = 'idle';
		});
	}

	function beginCountdown() {
		if (!stream) return;
		stage = 'countdown';
		countdownValue = 3;

		const tickDown = () => {
			countdownValue -= 1;
			if (countdownValue <= 0) {
				beginRecording();
			} else {
				after(1000, tickDown);
			}
		};
		after(1000, tickDown);
	}

	function cancelCountdown() {
		clearAllTimers();
		stage = 'idle';
	}

	function beginRecording() {
		if (!stream) return;
		stage = 'rec';
		elapsedMs = 0;

		try {
			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();
		} catch (err) {
			mediaRecorder = null;
		}

		const startedAt = Date.now();
		every(100, () => {
			elapsedMs = Date.now() - startedAt;
			if (elapsedMs >= MAX_RECORD_MS) {
				stopRecording();
			}
		});
	}

	function captureFrame() {
		if (!videoEl || !canvasEl) return;
		const width = videoEl.videoWidth || 640;
		const height = videoEl.videoHeight || 360;
		canvasEl.width = width;
		canvasEl.height = height;

		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		// Mirror the frame so it matches the mirrored live preview the person just saw.
		ctx.translate(width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(videoEl, 0, 0, width, height);
		frozenFrame = canvasEl.toDataURL('image/jpeg', 0.85);
	}

	function stopRecording() {
		if (stage !== 'rec') return;
		clearAllTimers();
		recordedSeconds = Math.max(1, Math.round(elapsedMs / 1000));
		captureFrame();

		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
		mediaRecorder = null;

		stage = 'done';
		after(DONE_MS, startProcessing);
	}

	function startProcessing() {
		stage = 'processing';
		videoSearchStage.set('processing');

		// MOCK: fake recognition delay only — the query below reuses the real text-search
		// code path (same `s`/`page` query params TextSearch.svelte sets), it is not a new call.
		matchedQuery = MOCK_QUERIES[Math.min(recordingCount, MOCK_QUERIES.length - 1)];
		recordingCount += 1;
		search.set(matchedQuery);
		page.set('1');

		after(PROCESSING_MS, () => {
			stage = 'results';
			videoSearchStage.set('results');
		});
	}

	async function recordAgain() {
		clearAllTimers();
		frozenFrame = '';
		videoSearchStage.set('idle');
		stage = 'idle';

		await tick();
		if (stream && videoEl) {
			videoEl.srcObject = stream;
			await videoEl.play();
		}
	}

	function handleButtonClick() {
		if (stage === 'idle') beginCountdown();
		else if (stage === 'countdown') cancelCountdown();
		else if (stage === 'rec') stopRecording();
		else if (stage === 'results') recordAgain();
	}

	onMount(() => {
		videoSearchStage.set('idle');
		initCamera();
	});

	onDestroy(() => {
		clearAllTimers();
		stream?.getTracks().forEach((track) => track.stop());
		videoSearchStage.set('idle');
	});
</script>

<div class="video-panel-wrapper">
	<div class="video-search-panel">
		<div class="video-col">
			<div class="video-frame" class:is-rec={stage === 'rec'} class:is-done={stage === 'done'}>
				{#if stage === 'loading' || stage === 'idle' || stage === 'countdown' || stage === 'rec'}
					<!-- svelte-ignore a11y-media-has-caption -->
					<video bind:this={videoEl} class="video-feed" muted playsinline></video>
				{/if}

				{#if stage === 'done' || stage === 'processing' || stage === 'results'}
					<img src={frozenFrame} alt="" class="video-frozen" />
				{/if}

				{#if stage === 'loading'}
					<div class="frame-overlay" role="status" aria-live="polite">
						<Loader2 class="h-8 w-8 animate-spin text-white" aria-hidden="true" />
						<p class="overlay-text">A ligar a câmara…</p>
					</div>
				{/if}

				{#if stage === 'countdown'}
					<div class="frame-overlay overlay-dim">
						{#key countdownValue}
							<span class="countdown-number">{countdownValue}</span>
						{/key}
					</div>
				{/if}

				{#if stage === 'rec'}
					<div class="rec-pill">
						<span class="rec-dot" aria-hidden="true"></span>
						REC {formatSeconds(elapsedSeconds)}
					</div>
				{/if}

				{#if stage === 'done'}
					<div class="frame-overlay">
						<div class="done-check">
							<Check class="h-9 w-9 text-white" aria-hidden="true" />
						</div>
					</div>
				{/if}

				{#if stage === 'processing'}
					<div class="frame-overlay overlay-dark" role="status" aria-live="polite">
						<Loader2 class="h-8 w-8 animate-spin text-white" aria-hidden="true" />
						<p class="overlay-text">A reconhecer o gesto…</p>
					</div>
				{/if}

				{#if stage === 'results'}
					<div class="frame-overlay overlay-light"></div>
					<div class="rec-pill results-pill">
						A sua gravação · {formatSeconds(recordedSeconds)}
					</div>
				{/if}
			</div>

			<div class="progress-track">
				<div
					class="progress-fill"
					class:progress-red={stage === 'rec'}
					class:progress-green={stage === 'done' || stage === 'processing' || stage === 'results'}
					style="width: {progressPercent}%"
				></div>
			</div>
		</div>

		<div class="info-col">
			<span class="step-label">{stepLabel}</span>
			{#if title}
				<h3 class="step-title">{title}</h3>
			{/if}
			{#if help}
				<p class="step-help">{help}</p>
			{/if}

			{#if stage === 'results'}
				<div class="match-box">
					<p class="match-label">Melhor correspondência</p>
					<p class="match-value">{matchedQuery.toUpperCase()}</p>
				</div>
			{/if}

			{#if errorMessage}
				<p class="error-text">{errorMessage}</p>
			{/if}

			{#if stage !== 'processing'}
				<button
					type="button"
					class="video-btn"
					class:btn-primary={stage === 'loading' || stage === 'idle'}
					class:btn-secondary={stage === 'countdown'}
					class:btn-stop={stage === 'rec'}
					class:btn-outline={stage === 'results'}
					disabled={stage === 'loading' || stage === 'done' || (stage === 'idle' && !stream)}
					on:click={handleButtonClick}
				>
					{#if stage === 'loading' || stage === 'idle'}
						<span class="dot" aria-hidden="true"></span>Gravar
					{:else if stage === 'countdown'}
						Cancelar
					{:else if stage === 'rec'}
						<span class="square" aria-hidden="true"></span>Parar
					{:else if stage === 'done'}
						A processar…
					{:else if stage === 'results'}
						<RotateCcw class="h-4 w-4" aria-hidden="true" />Gravar novamente
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>

<canvas bind:this={canvasEl} class="hidden-canvas" aria-hidden="true"></canvas>

<style>
	.video-panel-wrapper {
		width: 100%;
		background: #eaf3fd;
		border: 1px solid #d6e6f8;
		border-radius: 12px;
		padding: 24px;
	}

	.video-search-panel {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		width: 100%;
	}

	.video-col {
		flex: 1 1 480px;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.video-frame {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 8px;
		background: #0f1b2d;
		overflow: hidden;
	}

	.video-frame.is-rec {
		box-shadow: 0 0 0 3px #ef4444;
	}

	.video-frame.is-done {
		box-shadow: 0 0 0 3px #22c55e;
	}

	.video-feed,
	.video-frozen {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.video-feed {
		transform: scaleX(-1);
	}

	.frame-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		text-align: center;
	}

	.overlay-dark {
		background: rgba(15, 27, 45, 0.62);
	}

	.overlay-dim {
		background: rgba(15, 27, 45, 0.35);
	}

	.overlay-light {
		background: rgba(15, 27, 45, 0.25);
	}

	.overlay-text {
		margin: 0;
		color: #fff;
		font-size: 14px;
	}

	.countdown-number {
		font-size: 120px;
		font-weight: 800;
		color: #fff;
		line-height: 1;
		animation: vsPop 0.4s ease;
	}

	.rec-pill {
		position: absolute;
		top: 12px;
		left: 12px;
		display: flex;
		align-items: center;
		gap: 6px;
		background: rgba(15, 27, 45, 0.72);
		color: #fff;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		padding: 4px 10px;
		border-radius: 999px;
	}

	.results-pill {
		font-family: inherit;
	}

	.rec-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ef4444;
		animation: vsBlink 1s steps(1) infinite;
	}

	.done-check {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #22c55e;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: vsPop 0.3s ease;
	}

	.progress-track {
		height: 4px;
		background: #d6e6f8;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		width: 0%;
		transition: width 0.1s linear;
	}

	.progress-fill.progress-red {
		background: #ef4444;
	}

	.progress-fill.progress-green {
		background: #22c55e;
	}

	.info-col {
		flex: 1 1 280px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;
	}

	.step-label {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		color: #5b7aa3;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.step-title {
		margin: 0;
		font-weight: 700;
		font-size: 22px;
		color: #1f2937;
	}

	.step-help {
		margin: 0;
		font-size: 15px;
		color: #4b5563;
	}

	.match-box {
		background: #fff;
		border: 1px solid #cfe3fb;
		border-radius: 8px;
		padding: 12px 16px;
	}

	.match-label {
		margin: 0 0 4px;
		font-size: 13px;
		color: #6b7280;
	}

	.match-value {
		margin: 0;
		font-size: 20px;
		font-weight: 700;
		color: #2a2593;
	}

	.error-text {
		margin: 0;
		font-size: 14px;
		color: #b91c1c;
	}

	.video-btn {
		height: 42px;
		padding: 0 20px;
		border-radius: 6px;
		font-weight: 600;
		font-size: 15px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid transparent;
		cursor: pointer;
		width: fit-content;
		transition: background-color 0.15s ease;
	}

	.video-btn:disabled {
		background: #bcd8f7;
		color: #fff;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #3b96f5;
		color: #fff;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2f8ae8;
	}

	.btn-secondary {
		background: #fff;
		border-color: #cfe3fb;
		color: #1f2937;
	}

	.btn-secondary:hover {
		background: #f5f9fe;
	}

	.btn-stop {
		background: #fff;
		border-color: #fca5a5;
		color: #b91c1c;
	}

	.btn-stop:hover {
		background: #fef2f2;
	}

	.btn-outline {
		background: #fff;
		border-color: #3b96f5;
		color: #3b96f5;
	}

	.btn-outline:hover {
		background: #f5f9fe;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #ef4444;
		box-shadow: 0 0 0 2px #fff;
		display: inline-block;
	}

	.square {
		width: 11px;
		height: 11px;
		border-radius: 2px;
		background: #dc2626;
		display: inline-block;
	}

	.hidden-canvas {
		display: none;
	}

	@keyframes vsPop {
		0% {
			transform: scale(0.6);
		}
		60% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes vsBlink {
		50% {
			opacity: 0;
		}
	}
</style>
