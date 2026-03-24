<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Card } from '@/components/ui/card';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { forgotPasswordSchema } from '@/schemas/forgot-password';
	import { Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	export let data;

	const form = superForm(data.form, {
		validators: zodClient(forgotPasswordSchema),
		taintedMessage: true,
	});

	const { form: formData, enhance, submitting } = form;
</script>

<MetaTags title="Esqueceu-se da sua palavra-passe?" description="Insira o endereço de e-mail associado à sua conta. Vamos enviar-lhe um link para redefinir a sua palavra-passe." />

<PageHeader title="Esqueceu-se da sua palavra-passe?" subtitle="Insira o endereço de e-mail associado à sua conta. Vamos enviar-lhe um link para redefinir a sua palavra-passe." />
<div class="container mb-20 mt-2 flex flex-col items-center justify-center md:mt-4">
	<Card class="w-full max-w-[32rem] px-6 py-5 sm:px-8 sm:py-6 md:px-12 md:py-10">
		<form method="POST" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
					<Form.FieldErrors />
				</Form.Control>
			</Form.Field>
      <Form.Button href="/sign-in" class="mt-5 bg-gray-200 text-black hover:bg-gray-300">
				Cancelar
			</Form.Button>
			<Form.Button class="mt-5" disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Enviar
			</Form.Button>
		</form>
	</Card>
</div>
