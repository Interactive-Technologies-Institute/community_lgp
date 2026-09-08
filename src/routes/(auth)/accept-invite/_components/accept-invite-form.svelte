<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { PasswordInput } from '@/components/ui/password-input';
	import { acceptInviteSchema, type AcceptInviteSchema } from '@/schemas/accept-invite';
	import { Loader2 } from 'lucide-svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<AcceptInviteSchema>>;

	const form = superForm(data, {
		validators: zodClient(acceptInviteSchema),
		taintedMessage: true,
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form method="POST" use:enhance>
	<Card.Root id="accept-invite-form">
		<Card.Header>
			<Card.Title>Criar Conta</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="max-w-2xl space-y-4">
				<Form.Field {form} name="displayName">
					<Form.Control let:attrs>
						<Form.Label>Nome*</Form.Label>
						<Input {...attrs} bind:value={$formData.displayName} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="newPassword">
					<Form.Control let:attrs>
						<Form.Label>Palavra-passe*</Form.Label>
						<PasswordInput {...attrs} bind:value={$formData.newPassword} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="confirmNewPassword">
					<Form.Control let:attrs>
						<Form.Label>Confirmar Palavra-passe*</Form.Label>
						<PasswordInput {...attrs} bind:value={$formData.confirmNewPassword} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button type="submit" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Criar Conta
			</Button>
		</Card.Footer>
	</Card.Root>
</form>
