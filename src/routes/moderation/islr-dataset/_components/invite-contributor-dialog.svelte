<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { inviteContributorSchema, type InviteContributorSchema } from '@/schemas/invite-contributor';
	import { UserPlus } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<InviteContributorSchema>>;

	let open = false;

	const form = superForm(data, {
		validators: zodClient(inviteContributorSchema),
		resetForm: true,
		onResult: (event) => {
			if (event.result.type === 'success') {
				open = false;
			}
		},
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Button on:click={() => (open = true)}>
	<UserPlus class="mr-2 h-4 w-4" />
	Convidar Contribuidor
</Button>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Convidar Contribuidor</Dialog.Title>
			<Dialog.Description>
				A pessoa recebe um e-mail da Supabase com um link para criar a conta e, ao aceitar, fica
				automaticamente com o papel de Contribuidor.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} type="email" bind:value={$formData.email} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Dialog.Footer class="mt-4">
				<Button variant="secondary" type="button" on:click={() => (open = false)}>
					Cancelar
				</Button>
				<Button type="submit" disabled={$submitting}>Enviar Convite</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
