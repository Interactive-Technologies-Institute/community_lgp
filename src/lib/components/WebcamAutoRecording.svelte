<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Check, Circle, RotateCcw, Square } from 'lucide-svelte';

	export let submitting = false;

	let videoElement: HTMLVideoElement | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let stream: MediaStream | null = null;
	let chunks: Blob[] = [];
	let cameraReady = false;
	let isRecording = false;
	let recordedBlobUrl: string | null = null;
	let isPreview = false;

	let elapsedSeconds = 0;
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	function formatElapsed(totalSeconds: number) {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	const dispatch = createEventDispatcher();

	const startCamera = async () => {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
			if (timerInterval) {
				clearInterval(timerInterval);
				timerInterval = null;
			}

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
		elapsedSeconds = 0;
		timerInterval = setInterval(() => {
			elapsedSeconds += 1;
		}, 1000);
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

	const handleMainButtonClick = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	onMount(() => {
		startCamera();
	});

	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		if (recordedBlobUrl) {
			URL.revokeObjectURL(recordedBlobUrl);
		}
	});
</script>

<div class="flex w-full flex-col">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		class="aspect-video w-full rounded-2xl bg-black object-cover {isPreview ? '' : '-scale-x-100'}"
		bind:this={videoElement}
	/>

	{#if isPreview}
		<div class="mt-4 flex gap-3">
			<Button
				type="button"
				on:click={reRecord}
				variant="outline"
				class="h-14 flex-1 gap-2 text-base font-bold"
			>
				<RotateCcw class="h-5 w-5" />
				Repetir
			</Button>
			<Button
				type="submit"
				disabled={submitting}
				class="h-14 flex-[2] gap-2 bg-brand-blue text-base font-bold text-brand-white hover:bg-brand-blue/90"
			>
				<Check class="h-5 w-5" />
				Guardar e seguinte
			</Button>
		</div>
	{:else}
		<Button
			on:click={handleMainButtonClick}
			disabled={!cameraReady}
			variant={isRecording ? 'destructive' : 'default'}
			class="mt-4 h-14 w-full gap-2 text-base font-bold {isRecording
				? ''
				: 'bg-brand-blue text-brand-white hover:bg-brand-blue/90'}"
		>
			{#if isRecording}
				<Square class="h-4 w-4 fill-current" />
				A gravar {formatElapsed(elapsedSeconds)}
			{:else}
				<Circle class="h-4 w-4 fill-current" />
				Gravar
			{/if}
		</Button>
	{/if}
</div>
