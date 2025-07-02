<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '@/components/ui/card';
	import { Textarea } from '@/components/ui/textarea';
	import { Video, Type, Send } from 'lucide-svelte';
	import { tick } from 'svelte';
	import WebcamRecording from '@/components/WebcamRecording.svelte';// Your webcam component
	import { goto, invalidateAll } from '$app/navigation';
	
	export let signId: string;

	let showVideoRecorder = false;
	let showTextInput = false;
	let recordedVideoFile: File | null = null;
	let isSubmitting = false;
	let contentText = '';
	let errors: Record<string, string[]> = {};

	function handleVideoRecorded(event: CustomEvent) {
		recordedVideoFile = event.detail.file;
		showVideoRecorder = false;
	}

	function toggleVideoMode() {
		showVideoRecorder = !showVideoRecorder;
		showTextInput = false;
		if (!showVideoRecorder) {
			recordedVideoFile = null;
		}
	}

	function toggleTextMode() {
		showTextInput = !showTextInput;
		showVideoRecorder = false;
		recordedVideoFile = null;
	}

	async function submitComment() {
		if (!contentText.trim() && !recordedVideoFile) {
			errors = { content_text: ['O comentário precisa de ter ou um vídeo ou texto.'] };
			return;
		}

		isSubmitting = true;
		errors = {};

		try {
			const formData = new FormData();
			formData.append('content_text', contentText);
			if (recordedVideoFile) {
				formData.append('content_video', recordedVideoFile);
			}

			const response = await fetch('?/createComment', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();
			
			if (response.ok && result.type === 'success') {
				// Reset form
				contentText = '';
				recordedVideoFile = null;
				showVideoRecorder = false;
				showTextInput = false;
				
				// Refresh the page data
				await invalidateAll();
			} else {
				errors = result.errors || {};
			}
		} catch (error) {
			console.error('Submit error:', error);
			errors = { _form: ['Erro ao submeter comentário'] };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Card.Root class="w-full max-w-2xl">
	<Card.Header>
		<Card.Title class="text-lg">Adicionar Comentário</Card.Title>
		<Card.Description>
			Partilhe a sua opinião através de texto ou vídeo
		</Card.Description>
	</Card.Header>
	
	<Card.Content>
		<div class="space-y-4">
			<!-- Mode Selection Buttons -->
			<div class="flex gap-2">
				<Button
					type="button"
					variant={showTextInput ? "default" : "outline"}
					size="sm"
					on:click={toggleTextMode}
				>
					<Type class="w-4 h-4 mr-2" />
					Texto
				</Button>
				
				<Button
					type="button"
					variant={showVideoRecorder || recordedVideoFile ? "default" : "outline"}
					size="sm"
					on:click={toggleVideoMode}
				>
					<Video class="w-4 h-4 mr-2" />
					Vídeo
				</Button>
			</div>

			<!-- Text Input -->
			{#if showTextInput}
				<div class="space-y-2">
					<Textarea
						bind:value={contentText}
						placeholder="Escreva o seu comentário aqui..."
						class="min-h-24 resize-none"
						maxlength={5000}
					/>
					{#if errors.content_text}
						<p class="text-sm text-red-500">{errors.content_text[0]}</p>
					{/if}
					<div class="text-right text-xs text-gray-500">
						{contentText.length} / 5000
					</div>
				</div>
			{/if}

			<!-- Video Recorder -->
			{#if showVideoRecorder}
				<div class="space-y-2">
					<WebcamRecording on:recorded={handleVideoRecorded} />
					{#if errors.content_video}
						<p class="text-sm text-red-500">{errors.content_video[0]}</p>
					{/if}
				</div>
			{/if}

			<!-- Show recorded video preview -->
			{#if recordedVideoFile && !showVideoRecorder}
				<div class="space-y-2">
					<p class="text-sm text-green-600">
						✓ Vídeo gravado: {recordedVideoFile.name}
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						on:click={toggleVideoMode}
					>
						Gravar novamente
					</Button>
				</div>
			{/if}

			<!-- Global form errors -->
			{#if errors._form}
				<div class="text-sm text-red-500">
					{#each errors._form as error}
						<p>{error}</p>
					{/each}
				</div>
			{/if}

			<!-- Submit Button -->
			<div class="flex justify-end">
				<Button
					type="button"
					on:click={submitComment}
					disabled={isSubmitting || (!contentText.trim() && !recordedVideoFile)}
				>
					{#if isSubmitting}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
						Enviando...
					{:else}
						<Send class="w-4 h-4 mr-2" />
						Enviar Comentário
					{/if}
				</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>