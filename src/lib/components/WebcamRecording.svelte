<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { onDestroy } from 'svelte';
	let videoElement: HTMLVideoElement | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let stream: MediaStream | null = null;
	let chunks: Blob[] = [];
	let loading = false;
	let isRecording = false;
	let activateCamera = false;
	let recordedBlobUrl: string | null = null;
	let isPreview = false;

	const dispatch = createEventDispatcher();

	const getCamera = async () => {
		try {
			loading = true;
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			if (videoElement) {
				videoElement.srcObject = stream;
				videoElement.muted = true;
				videoElement.play();
			}
			isPreview = false;
			activateCamera = true;
		} catch (error) {
			console.error('Error accessing camera:', error);
		} finally {
			loading = false;
		}
	};

	const startRecording = () => {
		if (!stream) return;

		chunks = [];
		// Use mp4 container with h264 codec if supported, fallback to webm
		const options = { mimeType: 'video/mp4; codecs=h264' };

		try {
			mediaRecorder = new MediaRecorder(stream, options);
		} catch (e) {
			// Fallback to webm if mp4 not supported
			mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
		}

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunks.push(e.data);
			}
		};

		mediaRecorder.onstop = () => {
			// Create blob with proper MIME type
			const mimeType = mediaRecorder?.mimeType || 'video/webm';
			const blob = new Blob(chunks, { type: mimeType });

			// Create a proper File object with timestamp for uniqueness
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
			const fileName = `webcam-recording-${timestamp}.${extension}`;

			const file = new File([blob], fileName, {
				type: mimeType,
				lastModified: Date.now(),
			});

			recordedBlobUrl = URL.createObjectURL(blob);

			if (videoElement) {
				videoElement.srcObject = null;
				videoElement.src = recordedBlobUrl;
				videoElement.muted = false;
				videoElement.controls = true;
				videoElement.play();
			}

			isPreview = true;

			// Dispatch both blob and file for flexibility
			dispatch('recorded', {
				blob,
				file,
				fileName,
				mimeType,
			});
		};

		mediaRecorder.start();
		isRecording = true;
	};

	const stopRecording = () => {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;
		}
	};

	const reRecord = async () => {
		// Clean up previous recording
		if (recordedBlobUrl) {
			URL.revokeObjectURL(recordedBlobUrl);
			recordedBlobUrl = null;
		}

		isPreview = false;
		chunks = [];

		// Reset and request webcam again
		await getCamera();
	};

	onDestroy(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		if (recordedBlobUrl) {
			URL.revokeObjectURL(recordedBlobUrl);
		}
	});
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div>
	{#if loading}
		<h1>Loading camera...</h1>
	{/if}

	<video
		class="rounded-2xl"
		bind:this={videoElement}
		width="640"
		height="480"
		style="max-width: 100%; height: auto;"
	/>

	<div class="mt-4 flex gap-2">
		<Button
			on:click={getCamera}
			disabled={loading || activateCamera || isRecording}
			variant={activateCamera ? 'secondary' : 'default'}
		>
			{#if loading}
				Ativando...
			{:else if activateCamera}
				Câmera Ativa
			{:else}
				Ativar Câmera
			{/if}
		</Button>

		<Button
			on:click={startRecording}
			disabled={isRecording || isPreview || !stream}
			variant="default"
		>
			{#if isRecording}
				Gravando...
			{:else}
				Gravar
			{/if}
		</Button>

		<Button on:click={stopRecording} disabled={!isRecording} variant="destructive">
			Parar Gravação
		</Button>

		<Button on:click={reRecord} disabled={!isPreview} variant="outline">Voltar A Gravar</Button>
	</div>

	{#if isPreview}
		<p class="mt-2 text-sm text-green-600">
			✓ Gravação concluída. O vídeo será enviado quando submeter o formulário.
		</p>
	{/if}
</div>
