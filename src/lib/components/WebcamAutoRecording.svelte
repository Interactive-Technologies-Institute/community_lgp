<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	let videoElement: HTMLVideoElement | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let stream: MediaStream | null = null;
	let chunks: Blob[] = [];
	let cameraReady = false;
	let isRecording = false;
	let recordedBlobUrl: string | null = null;
	let isPreview = false;

	const dispatch = createEventDispatcher();

	const startCamera = async () => {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			if (videoElement) {
				videoElement.srcObject = stream;
				videoElement.muted = true;
				videoElement.play();
			}
			isPreview = false;
			cameraReady = true;
		} catch (error) {
			console.error('Error accessing camera:', error);
			dispatch('error', { error });
		}
	};

	const startRecording = () => {
		if (!stream) return;

		dispatch('recording-started');

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

		// Camera stream stays live between recordings, so just clear the preview
		if (videoElement && stream) {
			videoElement.srcObject = stream;
			videoElement.muted = true;
			videoElement.controls = false;
			videoElement.play();
		}
	};

	onMount(() => {
		startCamera();
	});

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
	<video
		class="w-full rounded-2xl bg-black"
		bind:this={videoElement}
		width="640"
		height="480"
		style="max-width: 100%; height: auto;"
	/>

	<div class="flex flex-wrap justify-start gap-4 pb-4 pt-4">
		<Button
			on:click={startRecording}
			disabled={isRecording || isPreview || !cameraReady}
			variant="default"
			class="h-8 bg-brand-blue"
		>
			{#if isRecording}
				Gravando...
			{:else}
				Gravar
			{/if}
		</Button>

		<Button on:click={stopRecording} disabled={!isRecording} variant="destructive" class="h-8">
			Parar Gravação
		</Button>

		<Button on:click={reRecord} disabled={!isPreview} variant="outline" class="h-8">Voltar A Gravar</Button>
	</div>

	{#if isPreview}
		<p class="mt-2 text-sm text-green-600">
			✓ Gravação concluída. O vídeo será enviado quando submeter o formulário.
		</p>
	{/if}
</div>
