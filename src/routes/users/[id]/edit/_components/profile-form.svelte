<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { FileInput } from '@/components/ui/file-input';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { updateUserProfileSchema, type UpdateUserProfileSchema } from '@/schemas/user-profile';
	import { firstAndLastInitials } from '@/utils';
	import { Loader2 } from 'lucide-svelte';
	import { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient, type Infer } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<UpdateUserProfileSchema>>;

	const form = superForm(data, {
		validators: zodClient(updateUserProfileSchema),
		taintedMessage: true,
		resetForm: false,
	});

	const { form: formData, enhance, submitting, isTainted, tainted } = form;

	const avatar = fileProxy(form, 'avatar');
	let avatarUrl: string | null | undefined = $formData.avatarUrl;
	$: {
		if ($avatar.length > 0) {
			const img = $avatar.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				avatarUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(img!);
		} else {
			avatarUrl = $formData.avatarUrl;
		}
	}
</script>

<form method="POST" enctype="multipart/form-data" action="?/updateProfile" use:enhance>
	<Card.Root>
		<Card.Header>
			<Card.Title>Edit Profile</Card.Title>
			<Card.Description>Lorem Ipsum</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="max-w-2xl space-y-4">
				<Form.Field {form} name="display_name">
					<Form.Control let:attrs>
						<Form.Label>Nome de exposição</Form.Label>
						<Input {...attrs} bind:value={$formData.display_name} />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Descrição</Form.Label>
						<Input {...attrs} bind:value={$formData.description} placeholder="Escreva algo sobre si!"/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="avatar">
					<Form.Control let:attrs>
						<Form.Label>Avatar</Form.Label>
						<Card.Root class="flex aspect-[3/2] items-center justify-center p-4">
							<Avatar.Root class="h-20 w-20 md:h-40 md:w-40">
								<Avatar.Image src={avatarUrl} alt="User avatar" />
								<Avatar.Fallback>{firstAndLastInitials($formData.display_name)}</Avatar.Fallback>
							</Avatar.Root>
						</Card.Root>
						<FileInput {...attrs} bind:files={$avatar} accept="image/*" />
						<input hidden value={$formData.avatarUrl} name="avatarUrl" />
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="age">
					<Form.Control let:attrs>
						<Form.Label>Idade</Form.Label>
						<Input {...attrs} bind:value={$formData.age} placeholder="Insira a sua idade!"/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="gender">
					<Form.Control let:attrs>
						<Form.Label>Género</Form.Label>
						<Input {...attrs} bind:value={$formData.gender} placeholder="Qual é o seu género?"/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="language">
					<Form.Control let:attrs>
						<Form.Label>Língua de Comunicação</Form.Label>
						<Input {...attrs} bind:value={$formData.language} placeholder="Qual/Quais as línguas que usa para comunicar?"/>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="profession">
					<Form.Control let:attrs>
						<Form.Label>Profissão</Form.Label>
						<Input {...attrs} bind:value={$formData.profession} placeholder="Que profissão exerce?"/>
						<Form.FieldErrors />
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
