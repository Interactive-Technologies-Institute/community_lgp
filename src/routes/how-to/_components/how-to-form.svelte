<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { createHowToSchema, type CreateHowToSchema } from '$lib/schemas/how-to';
	import type { HowToDifficulty, HowToDuration } from '$lib/types.ts';
	import { TagInput } from '@/components/ui/tag-input';
	import type { Selected } from 'bits-ui';
	import { ArrowDown, ArrowUp, Loader2, Trash } from 'lucide-svelte';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<CreateHowToSchema>>;

	const form = superForm(data, {
		validators: zodClient(createHowToSchema),
		dataType: 'json',
	});

	const { form: formData, enhance, submitting } = form;

	const difficultyOptions: Record<HowToDifficulty, { label: string }> = {
		easy: {
			label: 'Easy',
		},
		medium: {
			label: 'Medium',
		},
		hard: {
			label: 'Hard',
		},
	};
	$: selectedDifficulty = $formData.difficulty
		? {
				value: $formData.difficulty,
				label: difficultyOptions[$formData.difficulty].label,
			}
		: undefined;
	function getDifficultyFromValue(v: Selected<unknown>): HowToDifficulty {
		return v.value as HowToDifficulty;
	}

	const durationOptions: Record<HowToDuration, { label: string }> = {
		short: {
			label: 'Short',
		},
		medium: {
			label: 'Medium',
		},
		long: {
			label: 'Long',
		},
	};
	$: selectedDuration = $formData.duration
		? {
				value: $formData.duration,
				label: durationOptions[$formData.duration].label,
			}
		: undefined;
	function getDurationFromValue(v: Selected<unknown>): HowToDuration {
		return v.value as HowToDuration;
	}

	async function addStep() {
		$formData.steps = [...$formData.steps, { title: '', description: '', image: '' }];
	}

	async function removeStep(index: number) {
		$formData.steps = $formData.steps.filter((_, i) => i !== index);
	}

	async function moveStepUp(index: number) {
		if (index === 0) return;
		const steps = $formData.steps;
		const step = steps[index];
		steps[index] = steps[index - 1];
		steps[index - 1] = step;
		$formData.steps = steps;
	}

	async function moveStepDown(index: number) {
		if (index === $formData.steps.length - 1) return;
		const steps = $formData.steps;
		const step = steps[index];
		steps[index] = steps[index + 1];
		steps[index + 1] = step;
		$formData.steps = steps;
	}
</script>

<form method="POST" use:enhance class="flex flex-col gap-y-10">
	<Card.Root>
		<Card.Header>
			<Card.Title>Introduction</Card.Title>
			<Card.Description
				>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
				ut labore et dolore magna aliqua.
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title*</Form.Label>
					<Input {...attrs} bind:value={$formData.title} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Description*</Form.Label>
					<Textarea {...attrs} bind:value={$formData.description} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="tags">
				<Form.Control let:attrs>
					<Form.Label>Tags*</Form.Label>
					<TagInput {...attrs} bind:value={$formData.tags} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<div class="grid grid-cols-2 gap-x-4">
				<Form.Field {form} name="difficulty">
					<Form.Control let:attrs>
						<Form.Label>Difficulty*</Form.Label>
						<Select.Root
							{...attrs}
							selected={selectedDifficulty}
							onSelectedChange={(v) => {
								if (v) {
									$formData.difficulty = getDifficultyFromValue(v);
								}
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="easy">Easy</Select.Item>
								<Select.Item value="medium">Medium</Select.Item>
								<Select.Item value="hard">Hard</Select.Item>
							</Select.Content>
						</Select.Root>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="duration">
					<Form.Control let:attrs>
						<Form.Label>Duration*</Form.Label>
						<Select.Root
							{...attrs}
							selected={selectedDuration}
							onSelectedChange={(v) => {
								if (v) {
									$formData.duration = getDurationFromValue(v);
								}
							}}
						>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Select" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="short">Short</Select.Item>
								<Select.Item value="medium">Medium</Select.Item>
								<Select.Item value="long">Long</Select.Item>
							</Select.Content>
						</Select.Root>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
			<Form.Field {form} name="image">
				<Form.Control let:attrs>
					<Form.Label>Cover Image*</Form.Label>
					<Card.Root class="aspect-video h-60"></Card.Root>
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
		</Card.Content>
	</Card.Root>
	<Form.Fieldset {form} name="steps">
		<Card.Root>
			<Card.Header>
				<Form.Legend><Card.Title>Steps*</Card.Title></Form.Legend>
				<Card.Description
					>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				{#each $formData.steps as _, i}
					<Card.Root>
						<Card.Header>
							<div class="flex flex-row">
								<div class="flex flex-1 flex-col space-y-1.5">
									<Card.Title>
										Step {i + 1}
									</Card.Title>
									<Card.Description
										>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua.
									</Card.Description>
								</div>
								<div>
									{#if i !== 0}
										<Button
											variant="outline"
											size="icon"
											class="mr-2"
											on:click={() => moveStepUp(i)}
										>
											<ArrowUp class="h-4 w-4" />
										</Button>
									{/if}
									{#if i !== $formData.steps.length - 1}
										<Button
											variant="outline"
											size="icon"
											class="mr-2"
											on:click={() => moveStepDown(i)}
										>
											<ArrowDown class="h-4 w-4" />
										</Button>
									{/if}
									{#if $formData.steps.length > 3}
										<Button
											variant="destructive"
											size="icon"
											class="mr-2"
											on:click={() => removeStep(i)}
										>
											<Trash class="h-4 w-4" />
										</Button>
									{/if}
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-4">
							<Form.ElementField {form} name="steps[{i}].title">
								<Form.Control let:attrs>
									<Form.Label>Title*</Form.Label>
									<Input {...attrs} bind:value={$formData.steps[i].title} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.ElementField>
							<Form.ElementField {form} name="steps[{i}].description">
								<Form.Control let:attrs>
									<Form.Label>Description*</Form.Label>
									<Textarea {...attrs} bind:value={$formData.steps[i].description} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.ElementField>
							<Form.ElementField {form} name="steps[{i}].image">
								<Form.Control let:attrs>
									<Form.Label>Image*</Form.Label>
									<Card.Root class="aspect-video h-40"></Card.Root>
								</Form.Control>
								<Form.FieldErrors />
							</Form.ElementField>
						</Card.Content>
					</Card.Root>
				{/each}
			</Card.Content>
		</Card.Root>
	</Form.Fieldset>
	<Button type="button" variant="outline" size="sm" class="mr-auto mt-2" on:click={addStep}>
		Add Step
	</Button>
	<SuperDebug data={$formData} />
	<div
		class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<Button variant="outline">Cancel</Button>
		<Button type="submit" disabled={$submitting}>
			{#if $submitting}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Submit
		</Button>
	</div>
</form>
