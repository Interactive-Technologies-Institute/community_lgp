<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { FileInput } from '@/components/ui/file-input';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label';
	import { updateUserProfileSchema, type UpdateUserProfileSchema } from '@/schemas/user-profile';
	import { firstAndLastInitials } from '@/utils';
	import { Loader2 } from 'lucide-svelte';
	import { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import WebcamRecording from '@/components/WebcamRecording.svelte';

	export let data: SuperValidated<Infer<UpdateUserProfileSchema>>;

	const form = superForm(data, {
		validators: zodClient(updateUserProfileSchema),
		taintedMessage: true,
		dataType: 'json',
		onSubmit: ({ formData, cancel }) => {
			console.log('Form submitting with data:', Object.fromEntries(formData.entries()));

			// Ensure the file is properly attached before submission
			if (currentVideoFile && !formData.has('sign_name')) {
				console.log('Re-adding video file to form data');
				formData.append('sign_name', currentVideoFile);
			}

			// Debug what's actually being sent
			console.log('FormData entries:', [...formData.entries()]);
		},
		onUpdated: ({ form }) => {
			console.log('Form submission result:', form);
		},
		onError: ({ result }) => {
			console.error('Form submission error:', result);
		},
	});

	const { form: formData, enhance, submitting, isTainted, tainted } = form;

	// Avatar handling
	const avatar = fileProxy(form, 'avatar');
	let avatarUrl: string | null | undefined = $formData.avatarUrl;
	$: {
		if ($avatar.length > 0) {
			const img = $avatar.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				avatarUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(img!);
		} else {
			avatarUrl = $formData.avatarUrl;
		}
	}

	// Phone number consent
	let accept = !!(data.data.cnum && data.data.cnum.trim());
	$: if (!accept) {
		$formData.cnum = '';
	}

	// Video handling
	const sign_name = fileProxy(form, 'sign_name');
	let signNameUrl: string | null | undefined = $formData.signNameUrl;
	let fileInputRef1: HTMLInputElement | null = null;
	let currentVideoFile: File | null = null;

	const handleFileUpload1 = () => {
		if (fileInputRef1) {
			fileInputRef1.click();
		}
	};

	// Handle file selection from input
	$: {
		if ($sign_name.length > 0) {
			const file = $sign_name.item(0);
			if (file) {
				console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
				currentVideoFile = file;
				const reader = new FileReader();
				reader.onload = (e) => {
					signNameUrl = e.target?.result as string | null | undefined;
				};
				reader.readAsDataURL(file);
			}
		}
	}

	// Show existing video URL if no new file is selected
	$: if (!$sign_name.length && $formData.signNameUrl) {
		signNameUrl = $formData.signNameUrl;
	}

	let useWebcam = false;

	function handleRecorded(event: {
		detail: { blob: Blob; file: File; fileName: string; mimeType: string };
	}) {
		const { file, blob, fileName, mimeType } = event.detail;

		console.log('Recorded video:', fileName, 'Size:', file.size, 'Type:', mimeType);

		// Store the file reference
		currentVideoFile = file;

		// Create a FileList-like object for the video proxy
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		// Set the file in the form
		sign_name.set(dataTransfer.files);

		// Generate preview URL
		const reader = new FileReader();
		reader.onload = (e) => {
			signNameUrl = e.target?.result as string | null | undefined;
		};
		reader.readAsDataURL(file);

		// Clear any existing signNameUrl to ensure the file takes precedence
		$formData.signNameUrl = '';
	}

	// Clear video when switching modes
	const clearVideo = () => {
		currentVideoFile = null;
		sign_name.set(new DataTransfer().files);
		signNameUrl = null;
		$formData.signNameUrl = '';
	};

	// Debug form data
	$: console.log('Form data:', $formData);
	$: console.log('Sign name files:', $sign_name);
</script>

<form method="POST" enctype="multipart/form-data" action="?/updateProfile" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Editar Perfil</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="max-w-2xl space-y-4">
				<Form.Field {form} name="display_name">
					<Form.Control let:attrs>
						<Form.Label>Nome de exposição</Form.Label>
						<Input {...attrs} bind:value={$formData.display_name} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Descrição</Form.Label>
						<Input
							{...attrs}
							bind:value={$formData.description}
							placeholder="Escreva algo sobre si!"
						/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="avatar">
					<Form.Control let:attrs>
						<Form.Label>Avatar</Form.Label>
						<Card.Root class="flex aspect-[3/2] items-center justify-center p-4">
							<Avatar.Root class="h-20 w-20 md:h-40 md:w-40">
								<Avatar.Image src={avatarUrl} alt="User avatar" />
								<Avatar.Fallback>{firstAndLastInitials($formData.display_name)}</Avatar.Fallback>
							</Avatar.Root>
						</Card.Root>
						<FileInput {...attrs} bind:files={$avatar} accept="image/*" />
						<input type="hidden" value={$formData.avatarUrl || ''} name="avatarUrl" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="sign_name">
					<Form.Control>
						<Form.Label>Video</Form.Label>
						<br />

						<div class="flex flex-col gap-2">
							<div class="flex gap-2">
								<Button
									type="button"
									variant={useWebcam ? 'outline' : 'default'}
									on:click={() => {
										useWebcam = false;
										clearVideo();
									}}
								>
									Upload
								</Button>
								<Button
									type="button"
									variant={useWebcam ? 'default' : 'outline'}
									on:click={() => {
										useWebcam = true;
										clearVideo();
									}}
								>
									Webcam
								</Button>
							</div>
						</div>

						{#if !useWebcam}
							<!-- File upload -->
							<Button type="button" on:click={handleFileUpload1}>Carregar vídeo</Button>
							<input
								type="file"
								accept="video/*"
								bind:files={$sign_name}
								bind:this={fileInputRef1}
								class="hidden"
								name="sign_name"
							/>
						{:else}
							<!-- Webcam recording -->
							<WebcamRecording on:recorded={handleRecorded} />
							<!-- Hidden input for webcam recorded file -->
							{#if currentVideoFile}
								<input type="file" class="hidden" name="sign_name" bind:files={$sign_name} />
							{/if}
						{/if}

						<Card.Root class="aspect-video overflow-hidden">
							<div class="flex h-[400px] w-full items-center justify-center bg-muted">
								{#if signNameUrl}
									<!-- svelte-ignore a11y-media-has-caption -->
									<video src={signNameUrl} controls class="h-full w-full object-contain" />
								{:else}
									<span class="text-sm text-muted-foreground">Nenhum vídeo carregado</span>
								{/if}
							</div>
						</Card.Root>

						<input type="hidden" value={$formData.signNameUrl || ''} name="signNameUrl" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="age">
					<Form.Control let:attrs>
						<Form.Label>Idade</Form.Label>
						<Input {...attrs} bind:value={$formData.age} placeholder="Insira a sua idade!" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="gender">
					<Form.Control let:attrs>
						<Form.Label>Género</Form.Label>
						<Input {...attrs} bind:value={$formData.gender} placeholder="Qual é o seu género?" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="language">
					<Form.Control let:attrs>
						<Form.Label>Língua de Comunicação</Form.Label>
						<Input
							{...attrs}
							bind:value={$formData.language}
							placeholder="Qual/Quais as línguas que usa para comunicar?"
						/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="profession">
					<Form.Control let:attrs>
						<Form.Label>Profissão</Form.Label>
						<Input
							{...attrs}
							bind:value={$formData.profession}
							placeholder="Que profissão exerce?"
						/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="cnum">
					<Form.Control let:attrs>
						<Form.Label>Número de telemóvel</Form.Label>
						<Input
							{...attrs}
							bind:value={$formData.cnum}
							placeholder="Qual é o seu número de telemóvel?"
							disabled={!accept}
						/>
						<div class="mt-4">
							<div class="flex items-center space-x-2">
								<Checkbox id="terms" bind:checked={accept} />
								<Label for="terms"
									>Partilhar número de telemóvel com moderadores e administradores</Label
								>
							</div>
							<p class="mt-2 text-sm text-muted-foreground">
								Ao clicar nesta caixa, concorda em partilhar o seu número de telemóvel com
								moderadores e administradores.
							</p>
						</div>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" disabled={$submitting || !isTainted($tainted)}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Guardar Alterações
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
