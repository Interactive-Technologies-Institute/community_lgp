<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { FileInput } from '@/components/ui/file-input';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import type { CreateHowToSchema } from '@/schemas/how-to';
	import { ArrowDown, ArrowUp, Trash } from 'lucide-svelte';
	import { fileProxy, type SuperForm } from 'sveltekit-superforms';
	import { type Infer } from 'sveltekit-superforms/adapters';

	export let form: SuperForm<Infer<CreateHowToSchema>, any>;
	export let index: number;

	const { form: formData } = form;

	// TODO: Fix this
	function removeStep() {
		$formData.steps = $formData.steps.filter((_, i) => i !== index);
	}

	function moveStepUp() {
		if (index === 0) return;
		const steps = $formData.steps;
		const step = steps[index];
		steps[index] = steps[index - 1];
		steps[index - 1] = step;
		$formData.steps = steps;
	}

	function moveStepDown() {
		if (index === $formData.steps.length - 1) return;
		const steps = $formData.steps;
		const step = steps[index];
		steps[index] = steps[index + 1];
		steps[index + 1] = step;
		$formData.steps = steps;
	}

	let image = fileProxy(form, `steps[${index}].image`);
	let imageUrl: string | null | undefined = $formData.steps[index].imageUrl;
	$: {
		if ($image.length > 0) {
			const img = $image.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				imageUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(img!);
		} else {
			imageUrl = $formData.steps[index].imageUrl;
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row">
			<div class="flex flex-1 flex-col space-y-1.5">
				<Card.Title>
					Step {index + 1}
				</Card.Title>
				<Card.Description>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</Card.Description>
			</div>
			<div>
				{#if index !== 0}
					<Button variant="outline" size="icon" class="mr-2" on:click={moveStepUp}>
						<ArrowUp class="h-4 w-4" />
					</Button>
				{/if}
				{#if index !== $formData.steps.length - 1}
					<Button variant="outline" size="icon" class="mr-2" on:click={moveStepDown}>
						<ArrowDown class="h-4 w-4" />
					</Button>
				{/if}
				{#if $formData.steps.length > 3}
					<Button variant="destructive" size="icon" class="mr-2" on:click={removeStep}>
						<Trash class="h-4 w-4" />
					</Button>
				{/if}
			</div>
		</div>
	</Card.Header>
	<Card.Content class="space-y-4">
		<Form.ElementField {form} name="steps[{index}].title">
			<Form.Control let:attrs>
				<Form.Label>Title*</Form.Label>
				<Input {...attrs} bind:value={$formData.steps[index].title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.ElementField>
		<Form.ElementField {form} name="steps[{index}].description">
			<Form.Control let:attrs>
				<Form.Label>Description*</Form.Label>
				<Textarea {...attrs} bind:value={$formData.steps[index].description} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.ElementField>
		<div class="grid grid-cols-2 gap-x-4">
			<Form.ElementField {form} name="steps[{index}].image">
				<Form.Control let:attrs>
					<Form.Label>Cover Image*</Form.Label>
					<Card.Root class="aspect-video overflow-hidden">
						{#if imageUrl}
							<img src={imageUrl} alt="Event Cover" class="h-full w-full object-cover" />
						{/if}
					</Card.Root>
					<FileInput {...attrs} bind:files={$image} accept="image/*" />
					<input hidden value={$formData.steps[index].imageUrl} name="steps[{index}].imageUrl" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.ElementField>
		</div>
	</Card.Content>
</Card.Root>
