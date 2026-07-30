<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import * as Command from '@/components/ui/command';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import { createSignSchema, type CreateSignSchema } from '@/schemas/sign';
	import { Check, Loader2, X, FileVideo, Upload } from 'lucide-svelte';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';
	import type { AnnotationArray, Parameter } from '@/types/types';
	import Badge from '@/components/ui/badge/badge.svelte';
	import AnnotateParameterSelector from './AnnotateParameterSelector.svelte';

	export let data: SuperValidated<Infer<CreateSignSchema>>;
	export let user;
	export let parameter: Parameter[];
	export let themes;

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

	let selectedAnnotation: AnnotationArray = {
		configuration: [...(data.data.annotation?.configuration ?? [])],
		movement: [...(data.data.annotation?.movement ?? [])],
		location: [...(data.data.annotation?.location ?? [])],
		orientation: [...(data.data.annotation?.orientation ?? [])],
		expression: [...(data.data.annotation?.expression ?? [])],
	};

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
	let fileInputRef2: HTMLInputElement | null = null;
	let fileInputRef3: HTMLInputElement | null = null;

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

	const handleFileUpload3 = () => {
		if (fileInputRef3) {
			fileInputRef3.click();
		}
	};

	$: selectedThemes = $formData.theme ?? [];

	let themeSearch = '';
	const toggleTheme = (value: string) => {
		const selected = $formData.theme ?? [];
		if (selected.includes(value)) {
			$formData.theme = selected.filter((theme: string) => theme !== value);
			return;
		}

		$formData.theme = [...selected, value];
	};

	const addThemeFromSearch = () => {
		const newTheme = themeSearch.trim();
		if (!newTheme) {
			return;
		}

		$formData.theme = [...($formData.theme ?? []), newTheme];
		themeSearch = '';
	};

	const handleThemeInputKeydown = (event: Event) => {
		const keyboardEvent = event as KeyboardEvent;
		if (keyboardEvent.key === 'Enter') {
			event.preventDefault();
			addThemeFromSearch();
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

	$: frequency =
		$formData.frequency != null
			? {
					label: {
						2: 'Usado frequentemente',
						1: 'Usado',
						0: 'Usado raramente',
					}[$formData.frequency],
					value: $formData.frequency,
				}
			: undefined;

	$: is_anotated = $formData.is_anotated
		? {
				label: {
					2: 'Totalmente anotada',
					1: 'Parcialmente anotada',
					0: 'Não anotada',
				}[$formData.is_anotated],
				value: $formData.is_anotated,
			}
		: undefined;

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
					'Viana Do Castelo': 'Viana do Castelo',
					'Vila Real': 'Vila Real',
					Viseu: 'Viseu',
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

	function customFilter(
    commandValue: string,
    search: string,
    commandKeywords?: string[]
  ): number {
		commandValue = commandValue.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
		search = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
		return commandValue.includes(search) ? 1 : 0;
  }

	const parameterGroups: {
		tipo: string;
		label: string;
		annotationKey: keyof AnnotationArray;
	}[] = [
		{ tipo: 'configuracao', label: 'Configuração', annotationKey: 'configuration' },
		{ tipo: 'localizacao', label: 'Localização', annotationKey: 'location' },
		{ tipo: 'orientacao', label: 'Orientação', annotationKey: 'orientation' },
		{ tipo: 'movimento', label: 'Movimento', annotationKey: 'movement' },
		{ tipo: 'expressao facial', label: 'Expressão Facial', annotationKey: 'expression' },
	];

	$: signParameters = getParameters(selectedAnnotation);

	$: parameterCards = parameterGroups.map((group) => ({
		...group,
		parameters: ((signParameters ?? []) as Parameter[]).filter(
			(parameter) => parameter.tipo === group.tipo && parameter.code !== 'F000'
		),
	}));

	$: {
		const annotationArray = Array(300).fill(0);
		Object.values(selectedAnnotation)
			.flat()
			.forEach((id) => {
				if (id > 0 && id <= annotationArray.length) {
					annotationArray[id - 1] = 1;
				}
			});

		$formData.annotation = selectedAnnotation;
		$formData.annotation_array = annotationArray;
	}

	function removeParameter(annotationKey: keyof AnnotationArray, id: number) {
		selectedAnnotation = {
			...selectedAnnotation,
			[annotationKey]: selectedAnnotation[annotationKey].filter(
				(parameterId) => parameterId !== id
			),
		};
	}
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

						<!-- Themes -->
						<Form.Field {form} name="theme" class="flex w-full flex-col">
							<Form.Control>
								<Form.Label class="text-base font-semibold text-brand-grey">Temas</Form.Label>

								<!-- Selected themes -->
								{#if ($formData.theme ?? []).length > 0}
									<div class="flex flex-wrap gap-2 pb-2">
										{#each $formData.theme ?? [] as selectedTheme}
											<Badge
												variant="outline"
												class="text-brand-foreground flex flex-row gap-2 rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-sm font-semibold dark:bg-brand-border/80"
											>
												{selectedTheme}
												<button
													type="button"
													class="flex h-6 w-6 items-center justify-center rounded-full border bg-red-100 p-1 text-red-500 transition hover:bg-red-200"
													on:click={() => toggleTheme(selectedTheme)}
												>
													<X class="h-4 w-4" />
												</button>
											</Badge>
										{/each}
									</div>
								{/if}

								<!-- Themes List -->
								<Command.Root filter={customFilter} class="h-auto max-h-[200px] rounded-md border">
									<Command.Input
										bind:value={themeSearch}
										placeholder="Pesquisar ou adicionar temas..."
										class="flex w-full flex-1"
										on:keydown={handleThemeInputKeydown}
									/>
									<Command.List>
										<Command.Empty>
											<button
												type="button"
												on:click={addThemeFromSearch}
												class="w-full px-2 py-1.5 text-left text-sm"
											>
												Adicionar "{themeSearch.trim()}"
											</button>
										</Command.Empty>
										<Command.Group>
											{#each themes as themeOption}
												<Command.Item
													value={themeOption.theme}
													onSelect={() => {
														toggleTheme(themeOption.theme);
														themeSearch = '';
													}}
												>
													<div
														class={cn(
															'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
															selectedThemes?.includes(themeOption.theme)
																? 'bg-primary text-primary-foreground'
																: 'opacity-50 [&_svg]:invisible'
														)}
													>
														<Check class="h-4 w-4" />
													</div>
													<span>{themeOption.theme}</span>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.List>
								</Command.Root>
								<Form.FieldErrors />
							</Form.Control>
						</Form.Field>
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

						<!-- Frequency -->
						<Form.Field {form} name="frequency" class="flex w-full flex-col">
							<Form.Control let:attrs>
								<Form.Label class="text-base font-semibold text-brand-grey"
									>Frequência de Uso</Form.Label
								>
								<Select.Root
									selected={frequency}
									onSelectedChange={(v) => {
										v && ($formData.frequency = Number(v.value));
									}}
								>
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="Selecione o nível de frequência desta entrada..." />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="2" label="Usado frequentemente" />
										<Select.Item value="1" label="Usado" />
										<Select.Item value="0" label="Usado raramente" />
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
					<div class="flex h-full w-full flex-col items-start gap-2">
						<h2 class="text-xl font-extrabold text-brand-dark sm:text-2xl">1. Vídeo do gesto</h2>
						<Form.Field {form} name="video" class="flex w-full flex-col">
							<Form.Control let:attrs>
								<Form.Label class="mb-10 mt-1 leading-7 text-brand-grey text-base font-normal"
									>Carregar vídeo em LGP do gesto.</Form.Label
								>
								<Card.Root class="aspect-video bg-brand-surface">
									<div class="flex h-full w-full flex-col items-center justify-center gap-5">
										{#if videoUrl}
											<!-- svelte-ignore a11y-media-has-caption -->
											<video
												src={videoUrl}
												class="aspect-video w-full rounded-2xl bg-brand-border object-contain shadow-sm"
												controls
												playsinline
											/>
										{:else}
											<FileVideo class="h-24 w-24 text-brand-blue" />
											<p class="text-sm text-muted-foreground text-center text-wrap px-5">
												Nenhum vídeo carregado. Clique no botão abaixo para carregar.
											</p>
										{/if}
									</div>
								</Card.Root>
								<!-- Button to upload a video -->
								<Button
									variant="outline"
									class="flex min-w-10 flex-1 rounded-lg border-brand-border px-4 py-2 text-base text-brand-blue"
									on:click={handleFileUpload1}
								>
									<div class="relative flex items-center">
										<Upload class="h-4 w-4" /> &nbsp; Carregar vídeo
									</div>
								</Button>
								<input
									type="file"
									accept="video/mp4"
									bind:files={$video}
									bind:this={fileInputRef1}
									class="hidden"
								/>
								<input hidden value={$formData.videoUrl} name="videoUrl" />
								<Form.FieldErrors />
							</Form.Control>
						</Form.Field>
					</div>
				</Card.Root>
			</div>

			<!-- Parameters -->
			<div class="relative mt-20 space-y-2">
				<img
					src="/branding/curve-yellow.svg"
					alt="Curve Yellow"
					class="absolute -top-10 h-12 w-12"
				/>
				<h2 class="text-xl font-extrabold text-brand-dark dark:text-foreground sm:text-2xl">
					3. Parâmetros do gesto
				</h2>

				<Form.Field {form} name="annotation" class="flex w-full flex-col">
					<Form.Control>
						<Form.Label class="mb-10 mt-1 leading-7 text-foreground text-base font-normal"
							>Selecione os parâmetros desta entrada.</Form.Label
						>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
							{#each parameterCards as group}
								<Card.Root
									class="flex flex-col rounded-2xl border-brand-border bg-brand-white p-3 shadow-sm dark:bg-brand-surface"
								>
									<div class="flex items-center justify-center pb-4 text-center">
										<p class="font-semibold text-brand-grey dark:text-foreground">{group.label}</p>
									</div>

									<div
										class="flex flex-1 flex-wrap content-start items-center justify-center gap-3"
										aria-live="polite"
									>
										{#if group.parameters.length > 0}
											{#each group.parameters as selectedParameter}
												<div
													class="relative flex aspect-square h-24 w-24 items-center justify-center rounded-lg border border-brand-border bg-brand-white p-1.5 shadow-sm"
												>
													<button
														type="button"
														class="absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-brand-border bg-red-100 p-1 text-red-500 transition hover:bg-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
														aria-label="Remover parâmetro {selectedParameter.name ??
															selectedParameter.code}"
														on:click={() =>
															removeParameter(group.annotationKey, selectedParameter.id)}
													>
														<X class="h-4 w-4" aria-hidden="true" />
													</button>

													{#if selectedParameter.image}
														<img
															src={selectedParameter.image}
															alt={selectedParameter.name ?? selectedParameter.code}
															class="h-full w-full rounded-lg object-contain"
														/>
													{:else}
														<span
															class="break-words text-center text-xs leading-tight text-brand-grey"
														>
															{selectedParameter.name ?? selectedParameter.code}
														</span>
													{/if}
												</div>
											{/each}
										{:else}
											<p class="px-2 text-center text-sm text-muted-foreground">
												Nenhum parâmetro selecionado.
											</p>
										{/if}
									</div>

									<div class="mt-4 w-full">
										<AnnotateParameterSelector
											parameters={parameter}
											value={group.tipo}
											bind:selectedParameterIds={selectedAnnotation[group.annotationKey]}
										/>
									</div>
								</Card.Root>
							{/each}
						</div>

						<input
							type="hidden"
							name="annotation_array"
							value={JSON.stringify($formData.annotation_array ?? Array(300).fill(0))}
						/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
		</div>
	</section>

	<!-- Context Videos -->
	<section class="container mx-auto px-4 p-10">
		<div class="relative space-y-2 pb-10">
			<img src="/branding/curve-blue.svg" alt="Curve Blue" class="absolute -top-10 h-12 w-12" />
			<h2 class="text-xl font-extrabold text-brand-dark dark:text-foreground sm:text-2xl">
				4. Em contexto
			</h2>
			<p class="mt-1 mb-10 leading-7 text-foreground">Adicione um ou dois exemplos de uso da entrada.</p>
		</div>

		<div class="flex flex-col md:flex-row gap-20 border border-brand-border rounded-2xl p-5">
			<!-- Context Video 1 -->
			<div class="flex w-full flex-col gap-4">
				<Form.Field {form} name="context_video" class="flex w-full flex-col">
					<Form.Control let:attrs>
						<Form.Label class="mt-1 leading-7 text-foreground text-base font-semibold"
							>Vídeo de Utilização em Contexto (1)</Form.Label
						>
						<p class="mt-1 pb-5 leading-7 text-foreground">Carregar vídeo de contexto em LGP do gesto.</p>
						<Card.Root class="aspect-video bg-brand-surface">
							<div class="flex h-full w-full flex-col items-center justify-center gap-5">
								{#if context_video_url}
									<!-- svelte-ignore a11y-media-has-caption -->
									<video
										src={context_video_url}
										class="aspect-video w-full rounded-2xl bg-brand-border object-contain shadow-sm"
										controls
										playsinline
									/>
								{:else}
									<FileVideo class="h-24 w-24 text-brand-blue" />
									<p class="text-sm text-muted-foreground text-center text-wrap px-5">
										Nenhum vídeo carregado. Clique no botão abaixo para carregar.
									</p>
								{/if}
							</div>
						</Card.Root>
						<!-- Button to upload a video -->
						<Button
							variant="outline"
							class="flex min-w-10 flex-1 rounded-lg border-brand-border px-4 py-2 text-base text-brand-blue"
							on:click={handleFileUpload2}
						>
							<div class="relative flex items-center">
								<Upload class="h-4 w-4" /> &nbsp; Carregar vídeo
							</div>
						</Button>
						<input
							type="file"
							accept="video/mp4"
							bind:files={$video2}
							bind:this={fileInputRef2}
							class="hidden"
						/>
						<input hidden value={$formData.context_video_url} name="context_video_url" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="sentence" class="flex w-full flex-col">
					<Form.Control let:attrs>
						<Form.Label class="mt-1 leading-7 text-foreground text-base font-semibold">Frase de utilização em contexto (1)</Form.Label>
						<Textarea {...attrs} 
							class="min-h-10 h-10 resize-y"
							placeholder="Isto é um exemplo de frase em contexto..." 
							bind:value={$formData.sentence} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>

			<!-- Context Video 2 -->
			<div class="flex w-full flex-col gap-4">
				<Form.Field {form} name="context_video_2" class="flex w-full flex-col">
					<Form.Control let:attrs>
						<Form.Label class="mt-1 leading-7 text-foreground text-base font-semibold"
							>Vídeo de Utilização em Contexto (2)</Form.Label
						>
						<p class="mt-1 pb-5 leading-7 text-foreground">Carregar vídeo de contexto em LGP do gesto.</p>
						<Card.Root class="aspect-video bg-brand-surface">
							<div class="flex h-full w-full flex-col items-center justify-center gap-5">
								{#if context_video_url_2}
									<!-- svelte-ignore a11y-media-has-caption -->
									<video
										src={context_video_url_2}
										class="aspect-video w-full rounded-2xl bg-brand-border object-contain shadow-sm"
										controls
										playsinline
									/>
								{:else}
									<FileVideo class="h-24 w-24 text-brand-blue" />
									<p class="text-sm text-muted-foreground text-center text-wrap px-5">
										Nenhum vídeo carregado. Clique no botão abaixo para carregar.
									</p>
								{/if}
							</div>
						</Card.Root>
						<!-- Button to upload a video -->
						<Button
							variant="outline"
							class="flex min-w-10 flex-1 rounded-lg border-brand-border px-4 py-2 text-base text-brand-blue"
							on:click={handleFileUpload3}
						>
							<div class="relative flex items-center">
								<Upload class="h-4 w-4" /> &nbsp; Carregar vídeo
							</div>
						</Button>
						<input
							type="file"
							accept="video/mp4"
							bind:files={$video3}
							bind:this={fileInputRef3}
							class="hidden"
						/>
						<input hidden value={$formData.context_video_url_2} name="context_video_url_2" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="sentence_2" class="flex w-full flex-col">
					<Form.Control let:attrs>
						<Form.Label class="mt-1 leading-7 text-foreground text-base font-semibold">Frase de utilização em contexto (2)</Form.Label>
						<Textarea {...attrs} 
							class="min-h-10 h-10 resize-y"
							placeholder="Isto é um exemplo de frase em contexto..." 
							bind:value={$formData.sentence_2} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
		</div>
	</section>

	<!-- Annotation Level -->
	<section class="container mx-auto px-4 pb-10">
		<div class="relative space-y-2 pb-5">
			<img src="/branding/curve-yellow.svg" alt="Curve Yellow" class="absolute -top-10 h-12 w-12" />
			<h2 class="text-xl font-extrabold text-brand-dark dark:text-foreground sm:text-2xl">
				5. Nível de Anotação
			</h2>
		</div>
		<Form.Field {form} name="is_anotated" class="flex w-full flex-col">
			<Form.Control let:attrs>
				<Form.Label class="mt-1 pb-2 leading-7 text-foreground text-base font-normal">Escolha o nível que a anotação da entrada se encontra e verifique todas as informações.</Form.Label>
				<Select.Root
					selected={is_anotated}
					onSelectedChange={(v) => {
						v && ($formData.is_anotated = Number(v.value));
					}}
				>
					<Select.Trigger {...attrs}>
						<Select.Value
							placeholder="Selecione o nível de anotação desta entrada..."
						/>
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="2" label="Totalmente anotada" />
						<Select.Item value="1" label="Parcialmente anotada" />
						<Select.Item value="0" label="Não anotada" />
					</Select.Content>
				</Select.Root>
				<input hidden bind:value={$formData.frequency} name={attrs.name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</section>

	{#if user?.role === 'admin'}
		<SuperDebug data={$formData} />
	{/if}
	<div
		class="container sticky bottom-0 flex w-full mx-auto px-4 flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
