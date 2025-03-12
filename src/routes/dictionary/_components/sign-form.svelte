<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { Calendar } from '@/components/ui/calendar';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { TagInput } from '@/components/ui/tag-input';
	import { Textarea } from '@/components/ui/textarea';
	import { createSignSchema, type CreateSignSchema } from '@/schemas/signs';
	import { cn } from '@/utils';
	import {
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		type DateValue,
	} from '@internationalized/date';
	import { CalendarIcon, Loader2 } from 'lucide-svelte';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';

	import { format } from 'date-fns';

	import { Pause } from 'lucide-svelte';
	import { Video } from 'lucide-svelte';

	import EasyCamera from '@cloudparker/easy-camera-svelte';
	export let data: SuperValidated<Infer<CreateSignSchema>>;

	const form = superForm(data, {
		validators: zodClient(createSignSchema),
		taintedMessage: true,
		dataType: 'json'
	});

	const { form: formData, enhance, submitting } = form;

	const video = fileProxy(form, 'video');
	let videoUrl: string | null | undefined = $formData.videoUrl;
	let isRecording = false;
	let showCamera = false;
	let camera: EasyCamera;
	let useAudio = false;

	// Handle file uploads
	let fileInputRef: HTMLInputElement | null = null;
	let recordedVideoFile: File | null = null;

	const generateUniqueFilename = (name: string) => {
		const formattedDate = format(new Date(), 'dd-MM-yyyy-HH:mm:ss'); // Format the date as YYYYMMDD-HHMMSS
		return `${name}-${formattedDate}.mp4`;
		};

	const handleFileUpload = () => {
		showCamera = false;
		if (fileInputRef) {
			fileInputRef.click();
		}
	};
	
	const handleVideo = async () => {
	isRecording = true;
	let blob = await camera.startVideoRecording();
	if (blob !== undefined && blob !== null) {
		
		const filename = generateUniqueFilename($formData.name || 'video');
    	recordedVideoFile = new File([blob], filename, { type: "video/mp4" });

		// Update video preview
		const url = URL.createObjectURL(blob);
		videoUrl = url;

		// Simulate file input assignment
		video.set(recordedVideoFile);
	}
};

const stopVideoRecording = async () => {
	isRecording = false;
	let blob =  camera.stopVideoRecording();
	if (blob !== undefined && blob !== null) {
		const filename = generateUniqueFilename($formData.name || 'video');
		recordedVideoFile = new File([blob], filename, { type: "video/mp4" });

		// Update video preview
		const url = URL.createObjectURL(blob);
		videoUrl = url;

		// Simulate file input assignment
		video.set(recordedVideoFile);
	}
};

	
	function openCamera() {
    showCamera = true;
  }

 
	$: {
		if ($video.length > 0) {
			const img = $video.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				videoUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(img!);
		}
	}
</script>
<form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col gap-y-10">
	<Card.Root>
		<Card.Header>
			<Card.Title>Introduction</Card.Title>
			<Card.Description>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Title*</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="theme">
				<Form.Control let:attrs>
					<Form.Label>Tags*</Form.Label>
					<TagInput {...attrs} bind:value={$formData.theme} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>

			<div class="flex">
				<Form.Field {form} name="video">
					<Form.Control let:attrs>
						<Form.Label>Video*</Form.Label>
						<br>
						<!-- Button to upload a video -->
						<Button on:click={handleFileUpload}>Carregar gesto</Button>
						<input
							type="file"
							accept="video/mp4"
							bind:files={$video}
							bind:this={fileInputRef}
							class="hidden"
						/>
						
						
						<!-- Button to record a video -->
						<Button on:click={() => openCamera()}>Gravar gesto</Button>
						
						{#if showCamera}
						<div>
							<EasyCamera style="border-radius:5px;" bind:this={camera} bind:useAudio/>
							<Button on:click={handleVideo} disabled={isRecording}> <Video /> </Button>
							<Button class="mt-3"on:click={stopVideoRecording} disabled={!isRecording}><Pause class="flex items-center justify-center"/></Button>
						
						</div>
						{/if}


						<!-- Video preview -->
						<Card.Root class="aspect-video overflow-hidden">
							{#if videoUrl}
								<video src={videoUrl} controls />
							{/if}
						</Card.Root>

						

						<input hidden value={$formData.videoUrl} name="videoUrl" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
		</Card.Content>
	</Card.Root>

	<SuperDebug data={$formData} />

	<div class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<Button variant="outline">Cancel</Button>
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</div>
</form>
