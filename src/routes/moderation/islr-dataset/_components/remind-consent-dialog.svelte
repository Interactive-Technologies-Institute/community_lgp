<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { Button } from '@/components/ui/button';
	import { remindConsentSchema, type RemindConsentSchema } from '@/schemas/remind-consent';
	import { BellRing } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<RemindConsentSchema>>;
	export let dueCount: number;
	export let recentCount: number;
	export let batchLimit: number;

	let open = false;

	const form = superForm(data, {
		validators: zodClient(remindConsentSchema),
	});

	const { enhance, submitting } = form;

	$: batchSize = Math.min(dueCount, batchLimit);
</script>

<Button variant="outline" on:click={() => (open = true)} disabled={dueCount === 0 || $submitting}>
	<BellRing class="mr-2 h-4 w-4" />
	{$submitting ? 'A enviar...' : `Lembrar consentimento (${dueCount})`}
</Button>

<AlertDialog.Root bind:open>
	<form method="POST" action="?/remindConsent" use:enhance class="hidden"></form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				Enviar lembrete de consentimento a {batchSize}
				{batchSize === 1 ? 'pessoa' : 'pessoas'}?
			</AlertDialog.Title>
			<AlertDialog.Description>
				Quem aceitou o convite mas ainda não deu consentimento recebe um e-mail a lembrar que falta
				esse passo para começar a gravar.
				{#if recentCount > 0}
					{recentCount}
					{recentCount === 1 ? 'pessoa recebeu' : 'pessoas receberam'} um lembrete nas últimas 24 horas
					e {recentCount === 1 ? 'fica' : 'ficam'} de fora desta vez.
				{/if}
				{#if dueCount > batchLimit}
					Por causa do limite de envio do Gmail, só são enviados {batchLimit} de cada vez. Para os restantes,
					repita daqui a cerca de uma hora.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<AlertDialog.Action on:click={form.submit}>Enviar</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
