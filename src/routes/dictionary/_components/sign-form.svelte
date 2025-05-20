<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
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
	import Annotation from '@/components/dictionary/Annotation.svelte';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import { goto } from '$app/navigation';
	import AnnotationShowcase from '@/components/dictionary/AnnotationShowcase.svelte';
	import type { AnnotationArray, Parameter } from '@/types/types';

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

	let signParameters = getParameters(
		data.data.annotation ?? {
			configuration: [],
			movement: [],
			location: [],
			orientation: [],
			expression: [],
		}
	);

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
	let fileInputRef2: HTMLInputElement | null = null;

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
		if ($video2.length > 0) {
			const file = $video2.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				context_video_url = e.target?.result as string | null | undefined;
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
</script>

<form method="POST" enctype="multipart/form-data" use:enhance class="flex flex-col gap-y-10">
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
					<Form.Control let:attrs>
						<Form.Label>Video</Form.Label>
						<br />
						<!-- Button to upload a video -->
						<Button on:click={handleFileUpload1}>Carregar vídeo</Button>
						<input
							type="file"
							accept="video/mp4"
							bind:files={$video}
							bind:this={fileInputRef1}
							class="hidden"
						/>
						<Card.Root class="aspect-video overflow-hidden">
							<div class="flex h-[400px] w-full items-center justify-center bg-muted">
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
			<Form.Field {form} name="annotation">
				<Form.Control let:attrs>
					<Form.Label>Anotação</Form.Label>
					<!-- bind annotation directly to form.data.annotation -->

					<AnnotationShowcase data={signParameters} />
					<ScrollArea class="h-[600px] overflow-auto">
						<Annotation
							{parameter}
							bind:annotation={$formData.annotation}
							bind:annotation_array={$formData.annotation_array}
							on:change={(e) => {
								$formData.annotation_array = e.detail.annotation_array;
							}}
						/>
					</ScrollArea>
					<input
						type="hidden"
						name="annotation_array"
						value={JSON.stringify($formData.annotation_array ?? Array(300).fill(0))}
					/>
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Descrição</Form.Label>
					<Textarea {...attrs} bind:value={$formData.description} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<div class="flex">
				<Form.Field {form} name="context_video">
					<Form.Control let:attrs>
						<Form.Label>Vídeo de Utilização em Contexto</Form.Label>
						<br />
						<!-- Button to upload a video -->
						<Button on:click={handleFileUpload2}>Carregar vídeo</Button>
						<input
							type="file"
							accept="video/mp4"
							bind:files={$video2}
							bind:this={fileInputRef2}
							class="hidden"
						/>
						<Card.Root class="aspect-video overflow-hidden">
							<div class="flex h-[400px] w-full items-center justify-center bg-muted">
								{#if context_video_url}
									<video src={context_video_url} controls class="h-full w-full object-contain" />
								{:else}
									<span class="text-sm text-muted-foreground">Nenhum vídeo carregado</span>
								{/if}
							</div>
						</Card.Root>
						<input hidden value={$formData.context_video} name="context_video_url" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
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
			<Form.Field {form} name="sentence">
				<Form.Control let:attrs>
					<Form.Label>Frase em Português</Form.Label>
					<Textarea {...attrs} bind:value={$formData.sentence} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="frequency">
				<Form.Control let:attrs>
					<Form.Label>Frequência de Uso</Form.Label>
					<Select.Root
						selected={frequency}
						onSelectedChange={(v) => {
							v && ($formData.frequency = Number(v.value));
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value
								placeholder="Selecione o nível de frequência desta entrada de gesto na língua."
							/>
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
			<Form.Field {form} name="is_anotated">
				<Form.Control let:attrs>
					<Form.Label>Nível de Anotação</Form.Label>
					<Select.Root
						selected={is_anotated}
						onSelectedChange={(v) => {
							v && ($formData.is_anotated = Number(v.value));
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value
								placeholder="Selecione o nível de anotação relativamente a esta entrada de gesto."
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
