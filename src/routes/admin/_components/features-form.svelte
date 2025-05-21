<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { Switch } from '@/components/ui/switch';
	import { updateFeaturesSchema, type UpdateFeaturesSchema } from '@/schemas/features';
	import { Loader2 } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<UpdateFeaturesSchema>>;

	const form = superForm(data, {
		validators: zodClient(updateFeaturesSchema),
		taintedMessage: true,
		resetForm: false,
	});

	const { form: formData, enhance, isTainted, tainted, submitting } = form;
</script>

<form method="POST" action="?/updateFeatures" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Módulos</Card.Title>
			<Card.Description>Ative ou desative os vários módulos da plataforma.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="max-w-2xl space-y-4">
				<Form.Field
					{form}
					name="guides"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Guias</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que os utilizadores criem e partilhem guias.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.guides} />
					</Form.Control>
				</Form.Field>
				<Form.Field
					{form}
					name="events"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Eventos</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que os utilizadores criem e partilhem eventos.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.events} />
					</Form.Control>
				</Form.Field>
				<Form.Field
					{form}
					name="map"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Mapa</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que os utilizadores criem um mapa da sua comunidade.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.map} />
					</Form.Control>
				</Form.Field>
				<Form.Field
					{form}
					name="docs"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Documentação</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que os utilizadores criem e partilhem documentação.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.docs} />
					</Form.Control>
				</Form.Field>
				<Form.Field
					{form}
					name="dictionary"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Dicionário LGP</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que os utilizadores vejam o Dicionário de Língua
								Gestual Portuguesa.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.dictionary} />
					</Form.Control>
				</Form.Field>
				<Form.Field
					{form}
					name="fcdictionary"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Dicionário LGP de Primeiro Ciclo</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que os utilizadores vejam o Dicionário de Língua
								Gestual Portuguesa do Primeiro Ciclo.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.fcdictionary} />
					</Form.Control>
				</Form.Field>
				<Form.Field
					{form}
					name="annotate"
					class="flex flex-row items-center justify-between rounded-lg border p-4"
				>
					<Form.Control let:attrs>
						<div class="space-y-0.5">
							<Form.Label>Anotação</Form.Label>
							<Form.Description>
								Ative este módulo para permitir que utilizadores com permissões vejam a funcionalidade de Anotação
								de uma entrada de gesto no Dicionário de Língua Gestual Portuguesa.
							</Form.Description>
						</div>
						<Switch includeInput {...attrs} bind:checked={$formData.annotate} />
					</Form.Control>
				</Form.Field>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" disabled={$submitting || !isTainted($tainted)}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Save Settings
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
