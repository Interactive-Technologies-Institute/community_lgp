<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
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
	import WebcamRecording from '@/components/WebcamRecording.svelte';
	import { onMount, tick } from 'svelte';
	import DistrictMap from '@/components/dictionary/sign/DistrictMap.svelte';

	export let data: SuperValidated<Infer<CreateSignSchema>>;
	export let user;

	const form = superForm(data, {
		validators: zodClient(createSignSchema),
		taintedMessage: true,
		dataType: 'json',
	});

	const { form: formData, enhance, submitting } = form;

	const video = fileProxy(form, 'video');
	const descriptionVideo = fileProxy(form, 'description');

	let videoUrl: string | null | undefined = null;
	let descriptionVideoUrl: string | null | undefined = null;

	// Handle file uploads
	let fileInputRef1: HTMLInputElement | null = null;
	let fileInputRef2: HTMLInputElement | null = null;

	// Confirmation dialog state
	let confirmationOpen = false;
	let formElement: HTMLFormElement;

	const handleFileUpload1 = () => {
		if (fileInputRef1) {
			fileInputRef1.click();
		}
	};

	const handleFileUpload2 = () => {
		if (fileInputRef2) {
			fileInputRef2.click();
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
		if ($descriptionVideo.length > 0) {
			const file = $descriptionVideo.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				descriptionVideoUrl = e.target?.result as string | null | undefined;
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

	$: if (!$descriptionVideo.length && $formData.descriptionVideoUrl) {
		descriptionVideoUrl = $formData.descriptionVideoUrl;
	}

	$: if (!$descriptionVideo.length && $formData.description) {
		descriptionVideoUrl = $formData.description;
	}

	let useWebcam = false;
	let useWebcamForDescription = false;
	let recordedVideoFile: File | null = null;
	let recordedDescriptionVideoFile: File | null = null;

	function handleRecorded(event: {
		detail: { blob: Blob; file: File; fileName: string; mimeType: string };
	}) {
		const { file, blob, fileName, mimeType } = event.detail;

		recordedVideoFile = file;

		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		video.set(dataTransfer.files);

		const reader = new FileReader();
		reader.onload = (e) => {
			videoUrl = e.target?.result as string | null | undefined;
		};
		reader.readAsDataURL(file);

		$formData.videoUrl = '';
	}

	function handleDescriptionRecorded(event: {
		detail: { blob: Blob; file: File; fileName: string; mimeType: string };
	}) {
		const { file, blob, fileName, mimeType } = event.detail;

		recordedDescriptionVideoFile = file;

		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(file);

		descriptionVideo.set(dataTransfer.files);

		const reader = new FileReader();
		reader.onload = (e) => {
			descriptionVideoUrl = e.target?.result as string | null | undefined;
		};
		reader.readAsDataURL(file);

		$formData.descriptionVideoUrl = '';
	}

	async function handleSubmitClick(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		
		// Scroll to top
		window.scrollTo({ top: 0, behavior: 'smooth' });
		
		// Wait a bit for scroll to complete
		await tick();
		
		confirmationOpen = true;
	}

	function confirmSubmit() {
		confirmationOpen = false;
		if (formElement) {
			formElement.requestSubmit();
		}
	}

	onMount(() => {
		$formData.theme = ['Proposta - Em Discussão'];
		$formData.is_anotated = 0;
	});
</script>

<form
	bind:this={formElement}
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
											<div class="flex p-2 w-full items-center justify-center rounded-lg">
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

	<!-- Description Video -->
	<section class="container mx-auto px-4 p-10">
		<div class="relative space-y-2">
			<img src="/branding/curve-yellow.svg" alt="Curve Yellow" class="absolute -top-10 h-12 w-12" />
			<h2 class="text-xl font-extrabold text-brand-dark dark:text-foreground sm:text-2xl">
				3. Vídeo de Descrição
			</h2>
		</div>
		<div class="flex w-1/2">
			<Form.Field {form} name="description" class="flex w-full flex-col">
				<Form.Control>
					<Form.Label class="mt-1 pt-4 leading-7 text-foreground text-base font-normal">Carregar vídeo de descrição em LGP do gesto (opcional).</Form.Label>
						<Tabs.Root value={useWebcamForDescription ? 'webcam' : 'upload'} class="pt-5 pb-2">
							<Tabs.List
								class="border border-brand-border p-0 rounded-lg w-full h-8"
								aria-label="Origem do vídeo"
							>
								<Tabs.Trigger
									value="upload"
									class="h-8 rounded-l-lg rounded-r-none px-4 gap-2 transition duration-300"
									on:click={() => (useWebcamForDescription = false)}
								>
									<Upload class="h-4 w-4 shrink-0" />
									Ficheiro
								</Tabs.Trigger>
								<Tabs.Trigger
									value="webcam"
									class="h-8 rounded-l-none rounded-r-lg px-4 gap-2 transition duration-300"
									on:click={() => (useWebcamForDescription = true)}
								>
									<Camera class="h-4 w-4 shrink-0" />
									Webcam
								</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
		
						{#if !useWebcamForDescription}
							<!-- File upload -->
							<div
								class="py-4"
							>
								<Button 
									variant="outline"
									class="flex min-w-10 flex-1 rounded-lg border-brand-border px-4 py-2 gap-2 text-base text-brand-blue"	
									on:click={handleFileUpload2}>
									<Upload class="h-4 w-4" />
									{descriptionVideoUrl ? 'Substituir vídeo' : 'Carregar vídeo'}
								</Button>
								<input
									type="file"
									accept="video/mp4"
									bind:files={$descriptionVideo}
									bind:this={fileInputRef2}
									class="hidden"
								/>
							</div>
						{:else}
							<!-- Webcam recording -->
							<div
								class="py-4"
							>
								<WebcamRecording on:recorded={handleDescriptionRecorded} />
							</div>
						{/if}
		
						<div class="pt-5 w-full space-y-2">
							<p class="text-sm font-semibold text-brand-grey">Pré-visualização</p>
							<Card.Root
								class="w-full overflow-visible border-brand-border bg-brand-surface shadow-none"
							>
								<!-- svelte-ignore a11y-media-has-caption -->
								{#if descriptionVideoUrl}
									<video
										src={descriptionVideoUrl}
										controls
										preload="metadata"
										class="aspect-video w-full rounded-lg bg-black object-contain"
									/>
								{:else}
									<div class="flex w-full p-2 items-center justify-center rounded-lg">
										<span class="text-sm text-muted-foreground">Nenhum vídeo adicionado</span>
									</div>
								{/if}
							</Card.Root>
						</div>
						<input hidden value={$formData.descriptionVideoUrl} name="description" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
		</div>

	</section>

	{#if user?.role === 'admin'}
		<SuperDebug data={$formData} />
	{/if}
	<div
		class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<Button variant="outline" type="button" on:click={() => goto('/crowdsource/')}>Cancelar</Button>
		
		<Button 
			type="button" 
			disabled={$submitting}
			on:click={handleSubmitClick}
		>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submeter
		</Button>
	</div>
</form>

<!-- Confirmation Dialog -->
<Dialog.Root bind:open={confirmationOpen}>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Confirmar Submissão</Dialog.Title>
			<Dialog.Description>
				Por favor, reveja os detalhes antes de submeter o gesto.
			</Dialog.Description>
		</Dialog.Header>
		
		<div class="space-y-6 py-4">
			<div class="space-y-4">
				<div class="rounded-lg border p-4">
					<h4 class="mb-2 font-semibold text-foreground">Nome do Gesto</h4>
					<p class="text-sm text-muted-foreground">{$formData.name || 'Não especificado'}</p>
				</div>

				<div class="rounded-lg border p-4">
					<h4 class="mb-2 font-semibold text-foreground">Distrito / Região</h4>
					<p class="text-sm text-muted-foreground">{district?.label || 'Geral'}</p> <DistrictMap district={district?.label ?? 'Geral'} />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="rounded-lg border p-4">
						<h4 class="mb-2 font-semibold text-foreground">Vídeo Principal</h4>
						{#if videoUrl}
							<div class="relative aspect-video overflow-hidden rounded-md bg-muted">
								<video src={videoUrl} controls class="h-full w-full object-contain" />
							</div>
							<p class="mt-2 text-xs text-green-600">✓ Gravado</p>
						{:else}
							<p class="text-sm text-red-600">✗ Não Gravado</p>
						{/if}
					</div>

					<div class="rounded-lg border p-4">
						<h4 class="mb-2 font-semibold text-foreground">Vídeo de Descrição</h4>
						{#if descriptionVideoUrl}
							<div class="relative aspect-video overflow-hidden rounded-md bg-muted">
								<video src={descriptionVideoUrl} controls class="h-full w-full object-contain" />
							</div>
							<p class="mt-2 text-xs text-green-600">✓ Gravado</p>
						{:else}
							<p class="text-sm text-muted-foreground">Opcional - Não Gravado</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer class="gap-2">
			<Button 
				variant="outline"
				type="button"
				on:click={() => confirmationOpen = false}
			>
				Voltar e Editar
			</Button>
			<Button 
				type="button"
				on:click={confirmSubmit}
				disabled={$submitting}
			>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Confirmar e Submeter
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>