<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Card } from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label'
	import { PasswordInput } from '@/components/ui/password-input';
	import { signUpSchema } from '@/schemas/sign-up';
	import { Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(signUpSchema),
		taintedMessage: true,
	});

	const { form: formData, enhance, submitting } = form;
	let accept : boolean = false;

	$: console.log(accept)
</script>

<MetaTags title="Registar" description="Registe-se na nossa comunidade" />

<PageHeader title="Registar" subtitle="Registe-se na nossa comunidade" />
<div class="container mb-20 mt-10 flex flex-col items-center justify-center md:mt-20">
	<Card class="w-full max-w-[32rem] px-6 py-5 sm:px-8 sm:py-6 md:px-12 md:py-10">
		<form method="POST" use:enhance>
			<Form.Field {form} name="displayName">
				<Form.Control let:attrs>
					<Form.Label>Nome a Exibir</Form.Label>
					<Input {...attrs} bind:value={$formData.displayName} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Palavra-passe</Form.Label>
					<PasswordInput {...attrs} bind:value={$formData.password} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="confirmPassword">
				<Form.Control let:attrs>
					<Form.Label>Confime a palavra-passe</Form.Label>
					<PasswordInput {...attrs} bind:value={$formData.confirmPassword} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
			<div class="mt-6">
			<div class="flex items-center space-x-2">
				<Checkbox id="terms" bind:checked={accept} />
				<Label for="terms">Aceitar Termos e Condições</Label>
			</div>
			<p class="text-muted-foreground text-sm mt-2">
				Ao clicar nesta caixa, concorda com os Termos e Condições.
			</p>
		</div>
			<Form.Button disabled={$submitting || !accept} class="mt-5">
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Registar
			</Form.Button>
		</form>
	</Card>
</div>
