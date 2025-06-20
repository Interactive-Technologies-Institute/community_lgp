<script lang="ts">
	import { createCommentSchema, type CreateCommentSchema } from "@/schemas/cs-comment";
	import { fileProxy, superForm, type SuperValidated } from "sveltekit-superforms";
    import { zodClient, type Infer } from 'sveltekit-superforms/adapters';
    import * as Form from '@/components/ui/form';
    import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Textarea } from '@/components/ui/textarea';
    import { Loader2 } from 'lucide-svelte';
    export let data: SuperValidated<Infer<CreateCommentSchema>>;
    
    const form = superForm(data, {
		validators: zodClient(createCommentSchema),
		taintedMessage: true,
		dataType: 'json',
	});

    const { form: formData, enhance, submitting } = form;

    const content_video = fileProxy(form, 'content_video');
    let content_video_url: string | null | undefined = null;
    let fileInputRef1: HTMLInputElement | null = null;

    const handleFileUpload1 = () => {
		if (fileInputRef1) {
			fileInputRef1.click();
		}
	};

    $: {
	if ($content_video.length > 0) {
		const file = $content_video.item(0);
		const reader = new FileReader();
		reader.onload = (e) => {
			content_video_url = e.target?.result as string | null | undefined;
		};
		reader.readAsDataURL(file!);
	}
}

$: if (!$content_video.length && $formData.content_video_url) {
	content_video_url = $formData.content_video_url;
}
</script>

<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance class="flex flex-col gap-y-10">
	<Card.Root>
		<Card.Header>
			<Card.Title>Detalhes</Card.Title>
			<Card.Description>Adicione os detalhes da sua resposta</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
            <Form.Field {form} name="content_video">
				<Form.Control let:attrs>
					<Form.Label>Conteúdo em vídeo</Form.Label>
					<Button on:click={handleFileUpload1}>Carregar vídeo</Button>
							<input
								type="file"
								accept="video/mp4"
								bind:files={$content_video}
								bind:this={fileInputRef1}
								class="hidden"
							/>
                            <Card.Root class="aspect-video overflow-hidden">
								<div class="h-[400px] w-full bg-muted flex items-center justify-center">
									{#if content_video}
										<video src={content_video_url} controls class="h-full w-full object-contain" />
									{:else}
										<span class="text-sm text-muted-foreground">Nenhum vídeo carregado</span>
									{/if}
								</div>
							</Card.Root>
                            <input hidden value={$formData.content_video_url} name="content_video_url" />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
            <Form.Field {form} name="content_text">
				<Form.Control let:attrs>
					<Form.Label>Conteúdo em texto</Form.Label>
					<Textarea {...attrs} bind:value={$formData.content_text} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
		</Card.Content>
	</Card.Root>
	<div
		class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<Button variant="outline" href="/proposals/">Cancelar</Button>
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Comentar
		</Button>
	</div>
</form>