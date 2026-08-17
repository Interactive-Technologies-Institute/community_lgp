<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '@/components/ui/input';
	import { TagInput } from '@/components/ui/tag-input';
	import { Textarea } from '@/components/ui/textarea';
	import { createSignSchema, type CreateSignSchema } from '@/schemas/sign';
	import { Camera, Loader2, Upload } from 'lucide-svelte';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import { goto } from '$app/navigation';
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';
	import WebcamRecording from '@/components/WebcamRecording.svelte';
	import { onMount } from 'svelte';

	export let data: SuperValidated<Infer<CreateSignSchema>>;
	export let user;
	export let parameter: Parameter[];
	export let mainSign: Sign;

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
	const video3 = fileProxy(form, 'context_video_2');
	let videoUrl: string | null | undefined = null;
	let context_video_url: string | null | undefined = null;
	let context_video_url_2: string | null | undefined = null;

	// Handle file uploads
	let fileInputRef1: HTMLInputElement | null = null;

	const handleFileUpload1 = () => {
		if (fileInputRef1) {
			fileInputRef1.click();
		}
	};

	function handleCancel() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		goto('/');
	}

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

	$: {
		if ($video3.length > 0) {
			const file = $video3.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				context_video_url_2 = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(file!);
		}
	}

	$: district = $formData.district
		? {
				label: {
					Geral: 'Geral',
					Açores: 'Açores',
					Aveiro: 'Aveiro',
					Beja: 'Beja',
					Braga: 'Braga',
					Braganca: 'Bragança',
					'Castelo Branco': 'Castelo Branco',
					Coimbra: 'Coimbra',
					Évora: 'Évora',
					Faro: 'Faro',
					Guarda: 'Guarda',
					Leiria: 'Leiria',
					Lisboa: 'Lisboa',
					Madeira: 'Madeira',
					Portalegre: 'Portalegre',
					Porto: 'Porto',
					Santarém: 'Santarém',
					Setúbal: 'Setúbal',
					'Viana do Castelo': 'Viana do Castelo',
					'Vila Real': 'Vila Real',
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

	$: if (!$video3.length && $formData.context_video_url_2) {
		context_video_url_2 = $formData.context_video_url_2;
	}

	let useWebcam = false;
	let recordedVideoFile: File | null = null;

	function handleRecorded(event: {
		detail: { blob: Blob; file: File; fileName: string; mimeType: string };
	}) {
		const { file, blob, fileName, mimeType } = event.detail;

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

	onMount(() => {
		$formData.name = mainSign.name;
		$formData.theme = ['Proposta - Em Discussão'];
		$formData.is_anotated = 0;
	});
</script>

<form
	method="POST"
	action="?/update"
	enctype="multipart/form-data"
	use:enhance
	class="flex flex-col gap-y-10"
>
	<!-- General Information -->
	<section class="rounded-[2rem] bg-brand-surface shadow-md">
		<div class="container mx-auto p-4">
			<div class="mt-2 flex flex-col gap-5 lg:mt-6 lg:flex-row-reverse lg:gap-10">
				<!-- Sign Card -->
				<Card.Root
					class="w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none dark:bg-muted-foreground"
				>
					<div class="flex h-full w-full flex-col items-start gap-5">
						<h2 class="text-xl font-extrabold text-brand-dark sm:text-2xl">2. Informação Geral</h2>
						<!-- Sign Name -->
						<Form.Field {form} name="name" class="flex w-full flex-col">
							<Form.Control let:attrs>
								<Form.Label class="text-base font-semibold text-brand-grey">Nome</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.name}
									placeholder="Escreva o nome da entrada..."
								/>
								<Form.FieldErrors />
							</Form.Control>
						</Form.Field>

						<input hidden bind:value={$formData.theme} name="theme" />
						<input hidden value={$formData.theme_flattened} name="theme_flattened" />

						<!-- District -->
						<Form.Field {form} name="district" class="flex w-full flex-col">
							<Form.Control let:attrs>
								<Form.Label class="text-base font-semibold text-brand-grey"
									>Este gesto é usado em</Form.Label
								>
								<Select.Root
									selected={district}
									onSelectedChange={(v) => {
										v && ($formData.district = v.value);
									}}
								>
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="Selecione o Distrito ou Região Autónoma..." />
									</Select.Trigger>
									<Select.Content class="max-h-[300px] overflow-y-visible">
										<Select.Item value="Geral" label="Geral" />
										<Select.Item value="Açores" label="Açores" />
										<Select.Item value="Aveiro" label="Aveiro" />
										<Select.Item value="Beja" label="Beja" />
										<Select.Item value="Braga" label="Braga" />
										<Select.Item value="Braganca" label="Bragança" />
										<Select.Item value="Castelo Branco" label="Castelo Branco" />
										<Select.Item value="Coimbra" label="Coimbra" />
										<Select.Item value="Évora" label="Évora" />
										<Select.Item value="Faro" label="Faro" />
										<Select.Item value="Guarda" label="Guarda" />
										<Select.Item value="Leiria" label="Leiria" />
										<Select.Item value="Lisboa" label="Lisboa" />
										<Select.Item value="Madeira" label="Madeira" />
										<Select.Item value="Portalegre" label="Portalegre" />
										<Select.Item value="Porto" label="Porto" />
										<Select.Item value="Santarém" label="Santarém" />
										<Select.Item value="Setúbal" label="Setúbal" />
										<Select.Item value="Viana Do Castelo" label="Viana do Castelo" />
										<Select.Item value="Vila Real" label="Vila Real" />
										<Select.Item value="Viseu" label="Viseu" />
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.frequency} name={attrs.name} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</Card.Root>

				<!-- Video -->
				<Card.Root
					class="w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none dark:bg-muted-foreground"
				>
					<div class="flex h-full w-full flex-col items-start gap-4">
						<h2 class="text-xl font-extrabold text-brand-dark sm:text-2xl">1. Vídeo do gesto</h2>
						<Form.Field {form} name="video" class="w-full">
							<Form.Control>
								<Form.Label class="text-base font-normal leading-7 text-brand-grey">
									Carregar vídeo em LGP do gesto.
								</Form.Label>

								<Tabs.Root value={useWebcam ? 'webcam' : 'upload'} class="pt-5 pb-2">
									<Tabs.List
										class="border border-brand-border p-0 rounded-lg w-full h-8"
										aria-label="Origem do vídeo"
									>
										<Tabs.Trigger
											value="upload"
											class="h-8 rounded-l-lg rounded-r-none px-4 gap-2 transition duration-300"
											on:click={() => (useWebcam = false)}
										>
											<Upload class="h-4 w-4 shrink-0" />
											Ficheiro
										</Tabs.Trigger>
										<Tabs.Trigger
											value="webcam"
											class="h-8 rounded-l-none rounded-r-lg px-4 gap-2 transition duration-300"
											on:click={() => (useWebcam = true)}
										>
											<Camera class="h-4 w-4 shrink-0" />
											Webcam
										</Tabs.Trigger>
									</Tabs.List>
								</Tabs.Root>

								{#if !useWebcam}
									<!-- File upload -->
									<div
										class="py-4"
									>
										<Button 
											variant="outline"
											class="flex min-w-10 flex-1 rounded-lg border-brand-border px-4 py-2 gap-2 text-base text-brand-blue"	
											on:click={handleFileUpload1}>
											<Upload class="h-4 w-4" />
											{videoUrl ? 'Substituir vídeo' : 'Carregar vídeo'}
										</Button>
										<input
											type="file"
											accept="video/mp4"
											bind:files={$video}
											bind:this={fileInputRef1}
											class="hidden"
										/>
									</div>
								{:else}
									<!-- Webcam recording -->
									<div
										class="py-4"
									>
										<WebcamRecording on:recorded={handleRecorded} />
									</div>
								{/if}

								<div class="pt-5 w-full space-y-2">
									<p class="text-sm font-semibold text-brand-grey">Pré-visualização</p>
									<Card.Root
										class="w-full overflow-visible border-brand-border bg-brand-surface shadow-none"
									>
										<!-- svelte-ignore a11y-media-has-caption -->
										{#if videoUrl}
											<video
												src={videoUrl}
												controls
												preload="metadata"
												class="aspect-video w-full rounded-lg bg-black object-contain"
											/>
										{:else}
											<div class="flex aspect-video w-full items-center justify-center rounded-lg">
												<span class="text-sm text-muted-foreground">Nenhum vídeo adicionado</span>
											</div>
										{/if}
									</Card.Root>
								</div>
								<input hidden value={$formData.videoUrl} name="videoUrl" />

								<Form.FieldErrors />
							</Form.Control>
						</Form.Field>
					</div>
				</Card.Root>
			</div>
		</div>
	</section>

	{#if user?.role === 'admin'}
		<SuperDebug data={$formData} />
	{/if}
	<div
		class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<Button type="button" variant="outline" on:click={handleCancel}>Cancelar</Button>
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submeter
		</Button>
	</div>
</form>
