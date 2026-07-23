<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '@/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '@/components/ui/textarea';
	import { Video, TextCursor, Send, X } from 'lucide-svelte';
	import WebcamRecording from '@/components/WebcamRecording.svelte';
	import { invalidateAll } from '$app/navigation';

	export let parentCommentId: string | null = null; // New prop for reply functionality
	export let onCancel: (() => void) | null = null; // Callback for canceling reply

	let showVideoRecorder = false;
	let showTextInput = true;
	let recordedVideoFile: File | null = null;
	let isSubmitting = false;
	let contentText = '';
	let errors: Record<string, string[]> = {};

	function handleVideoRecorded(event: CustomEvent) {
		recordedVideoFile = event.detail.file;
		showVideoRecorder = false;
	}

	function toggleVideoMode() {
		showVideoRecorder = true;
		showTextInput = false;
	}

	function toggleTextMode() {
		showTextInput = true;
		showVideoRecorder = false;
		recordedVideoFile = null;
	}

	function handleCancel() {
		// Reset form state
		contentText = '';
		recordedVideoFile = null;
		showVideoRecorder = false;
		showTextInput = false;
		errors = {};

		// Call parent cancel callback if it exists
		if (onCancel) {
			onCancel();
		}
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
			// Add parent_id if this is a reply
			if (parentCommentId) {
				formData.append('parent_id', parentCommentId);
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
				showTextInput = true;

				// If this was a reply, call the cancel callback to hide the form
				if (parentCommentId && onCancel) {
					onCancel();
				}

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

<Card.Root class="w-full rounded-2xl border-brand-yellow/70 bg-brand-yellow/30 dark:bg-transparent shadow-none">
	<Card.Header class="space-y-1 pb-3">
		<Card.Title class="text-base font-medium font-sans">
			{parentCommentId ? 'Responder ao Comentário' : 'Adicionar Comentário'}
		</Card.Title>
		<Card.Description class="text-base text-foreground/60">
			{parentCommentId
				? 'Responda a este comentário'
				: 'Partilhe a sua opinião através de texto ou vídeo'}
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<div class="space-y-4">
			<!-- Mode Selection Buttons -->
			<div class="flex">
				<Tabs.Root value="texto">
					<Tabs.List class="flex p-0 rounded-lg">
						<Tabs.Trigger
							class={`h-10 rounded-l-lg rounded-r-none px-4 transition duration-300 border border-brand-yellow/70 ${
								showVideoRecorder || recordedVideoFile ? 'text-brand-white' : ''
							}`}
							value="video"
							on:click={toggleVideoMode}
						>
							<Video />&nbsp;Vídeo
						</Tabs.Trigger>

						<Tabs.Trigger
							class={`h-10 rounded-l-none rounded-r-lg px-4 transition duration-300 border border-brand-yellow/70 ${
								showTextInput ? 'text-brand-white' : ''
							}`}
							value="texto"
							on:click={toggleTextMode}
						>
							<TextCursor /> &nbsp;Texto
						</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
				
				<!-- Cancel button for replies -->
				{#if parentCommentId && onCancel}
					<Button type="button" variant="ghost" size="sm" on:click={handleCancel} class="ml-auto p-2 text-red-500 bg-red-100 hover:bg-red-200 hover:text-red-500">
						<X class="mr-2 h-4 w-4" />
						Cancelar
					</Button>
				{/if}
			</div>

			<!-- Text Input -->
			{#if showTextInput}
				<div class="space-y-2">
					<div class="flex flex-col gap-3 lg:flex-row">
						<Textarea
							bind:value={contentText}
							placeholder={parentCommentId
								? 'Escreva a sua resposta...'
								: 'Escreva um comentário...'}
							class="min-h-10 h-10 resize-y rounded-lg border-brand-yellow bg-brand-white dark:bg-brand-surface text-brand-foreground placeholder:text-brand-foreground/60"
							maxlength={5000}
						/>
					</div>
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
					<Button type="button" variant="outline" size="sm" on:click={toggleVideoMode}>
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
					class="shrink-0 rounded-lg bg-brand-blue px-6 text-brand-white hover:bg-brand-blue/90"
					on:click={submitComment}
					disabled={isSubmitting || (!contentText.trim() && !recordedVideoFile)}
				>
					{#if isSubmitting}
						<div
							class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Enviando...
					{:else}
						<Send class="mr-2 h-4 w-4" />
						{parentCommentId ? 'Enviar Resposta' : 'Enviar Comentário'}
					{/if}
				</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>
