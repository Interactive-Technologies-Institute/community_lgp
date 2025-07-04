<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '@/components/ui/input';
	import { TagInput } from '@/components/ui/tag-input';
	import { Textarea } from '@/components/ui/textarea';
	import { createSignSchema, type CreateSignSchema } from '@/schemas/sign';
	import { Loader2 } from 'lucide-svelte';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import { goto } from '$app/navigation';
	import type { AnnotationArray, Parameter } from '@/types/types';
	import WebcamRecording from '@/components/WebcamRecording.svelte';

	export let data: SuperValidated<Infer<CreateSignSchema>>;
	export let user;
	export let parameter: Parameter[];

	function getParameters(annotation: AnnotationArray) {
		const parameterFilter: Parameter[] = [];
		let flatAnnotation = Object.values(annotation || {}).flat();
		parameter.filter((param: Parameter) => {
			if (flatAnnotation.includes(param.id)) {
				parameterFilter.push(param);
			}
		});
		return parameterFilter;
	}

	const form = superForm(data, {
		validators: zodClient(createSignSchema),
		taintedMessage: true,
		dataType: 'json',
	});

	const { form: formData, enhance, submitting } = form;

	const video = fileProxy(form, 'video');
	const video2 = fileProxy(form, 'context_video');
	let videoUrl: string | null | undefined = null;
	let context_video_url: string | null | undefined = null;

	// Handle file uploads
	let fileInputRef1: HTMLInputElement | null = null;

	const handleFileUpload1 = () => {
		if (fileInputRef1) {
			fileInputRef1.click();
		}
	};

	$: $formData.theme_flattened = ($formData.theme ?? []).join(', ');

	$: {
		if ($video.length > 0) {
			const file = $video.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				videoUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(file!);
		}
	}

	$: {
		if ($video2.length > 0) {
			const file = $video2.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				context_video_url = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(file!);
		}
	}

	$: district = $formData.district
		? {
				label: {
					geral: 'Geral',
					açores: 'Açores',
					aveiro: 'Aveiro',
					beja: 'Beja',
					braga: 'Braga',
					braganca: 'Bragança',
					castelo_branco: 'Castelo Branco',
					coimbra: 'Coimbra',
					evora: 'Évora',
					faro: 'Faro',
					guarda: 'Guarda',
					leiria: 'Leiria',
					lisboa: 'Lisboa',
					madeira: 'Madeira',
					portalegre: 'Portalegre',
					porto: 'Porto',
					santarem: 'Santarém',
					setubal: 'Setúbal',
					viana_do_castelo: 'Viana do Castelo',
					vila_real: 'Vila Real',
					viseu: 'Viseu',
				}[$formData.district],
				value: $formData.district,
			}
		: undefined;

	$: if (!$video.length && $formData.videoUrl) {
		videoUrl = $formData.videoUrl;
	}

	$: if (!$video2.length && $formData.context_video_url) {
		context_video_url = $formData.context_video_url;
	}

	let useWebcam = false;
	let recordedVideoFile: File | null = null;

	function handleRecorded(event: {
		detail: { blob: Blob; file: File; fileName: string; mimeType: string };
	}) {
		const { file, blob, fileName, mimeType } = event.detail;

		console.log('Webcam recording received:', { fileName, mimeType, size: file.size });

		// Store the recorded file
		recordedVideoFile = file;

		// Create a FileList-like object for the video proxy
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		// Set the file in the form
		video.set(dataTransfer.files);

		// Generate preview URL
		const reader = new FileReader();
		reader.onload = (e) => {
			videoUrl = e.target?.result as string | null | undefined;
		};
		reader.readAsDataURL(file);

		// Optional: Clear any existing videoUrl from form data to ensure the file takes precedence
		$formData.videoUrl = '';
	}
</script>

<form
	method="POST"
	action="?/update"
	enctype="multipart/form-data"
	use:enhance
	class="flex flex-col gap-y-10"
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Entrada</Card.Title>
			<Card.Description>
				Para criar uma nova entrada de gesto, adicione o nome da entrada, adicione temas e carregue
				um vídeo do gesto. Para carregar o vídeo, deve ser via carregamento de ficheiro.
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Nome</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="theme">
				<Form.Control let:attrs>
					<Form.Label>Temas</Form.Label>
					<TagInput {...attrs} bind:value={$formData.theme} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<input hidden value={$formData.theme_flattened} name="theme_flattened" />
			<div class="flex">
				<Form.Field {form} name="video">
					<Form.Control>
						<Form.Label>Video</Form.Label>
						<br />
						<!-- Button to upload a video -->
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<div class="flex flex-col gap-2">
							<label class="text-sm font-medium">Modo de Vídeo</label>
							<div class="flex gap-2">
								<Button
									type="button"
									variant={useWebcam ? 'outline' : 'default'}
									on:click={() => (useWebcam = false)}>Upload</Button
								>
								<Button
									type="button"
									variant={useWebcam ? 'default' : 'outline'}
									on:click={() => (useWebcam = true)}>Webcam</Button
								>
							</div>
						</div>

						{#if !useWebcam}
							<!-- File upload -->
							<Button on:click={handleFileUpload1}>Carregar vídeo</Button>
							<input
								type="file"
								accept="video/mp4"
								bind:files={$video}
								bind:this={fileInputRef1}
								class="hidden"
							/>
						{:else}
							<!-- Webcam recording -->
							<WebcamRecording on:recorded={handleRecorded} />
						{/if}
						<Card.Root class="aspect-video overflow-hidden">
							<div class="flex h-[400px] w-full items-center justify-center bg-muted">
								<!-- svelte-ignore a11y-media-has-caption -->
								{#if videoUrl}
									<video src={videoUrl} controls class="h-full w-full object-contain" />
								{:else}
									<span class="text-sm text-muted-foreground">Nenhum vídeo carregado</span>
								{/if}
							</div>
						</Card.Root>
						<input hidden value={$formData.videoUrl} name="videoUrl" />

						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>

			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Descrição</Form.Label>
					<Textarea {...attrs} bind:value={$formData.description} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="district">
				<Form.Control let:attrs>
					<Form.Label>Distritos e Regiões Autónomas</Form.Label>
					<Select.Root
						selected={district}
						onSelectedChange={(v) => {
							v && ($formData.district = v.value);
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value
								placeholder="Selecione o distrito ou região autónoma a que esta entrada pertence."
							/>
						</Select.Trigger>
						<Select.Content>
							<ScrollArea class="h-[600px] overflow-auto">
								<Select.Item value="geral" label="Geral" />
								<Select.Item value="açores" label="Açores" />
								<Select.Item value="aveiro" label="Aveiro" />
								<Select.Item value="beja" label="Beja" />
								<Select.Item value="braga" label="Braga" />
								<Select.Item value="braganca" label="Bragança" />
								<Select.Item value="castelo_branco" label="Castelo Branco" />
								<Select.Item value="coimbra" label="Coimbra" />
								<Select.Item value="evora" label="Évora" />
								<Select.Item value="faro" label="Faro" />
								<Select.Item value="guarda" label="Guarda" />
								<Select.Item value="leiria" label="Leiria" />
								<Select.Item value="lisboa" label="Lisboa" />
								<Select.Item value="madeira" label="Madeira" />
								<Select.Item value="portalegre" label="Portalegre" />
								<Select.Item value="porto" label="Porto" />
								<Select.Item value="santarem" label="Santarém" />
								<Select.Item value="setubal" label="Setúbal" />
								<Select.Item value="viana_do_castelo" label="Viana do Castelo" />
								<Select.Item value="vila_real" label="Vila Real" />
								<Select.Item value="viseu" label="Viseu" />
							</ScrollArea>
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.frequency} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
	</Card.Root>
	{#if user?.role === 'admin'}
		<SuperDebug data={$formData} />
	{/if}
	<div
		class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<Button variant="outline" on:click={() => goto('/annotate/')}>Cancelar</Button>
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submeter
		</Button>
	</div>
</form>
