<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { Button } from '@/components/ui/button';
	import {
		resendPendingInvitesSchema,
		type ResendPendingInvitesSchema,
	} from '@/schemas/resend-pending-invites';
	import { MailPlus } from 'lucide-svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<ResendPendingInvitesSchema>>;
	export let dueCount: number;
	export let recentCount: number;
	export let batchLimit: number;

	let open = false;

	const form = superForm(data, {
		validators: zodClient(resendPendingInvitesSchema),
	});

	const { enhance, submitting } = form;

	$: batchSize = Math.min(dueCount, batchLimit);
</script>

<Button variant="outline" on:click={() => (open = true)} disabled={dueCount === 0 || $submitting}>
	<MailPlus class="mr-2 h-4 w-4" />
	{$submitting ? 'A reenviar...' : `Reenviar pendentes (${dueCount})`}
</Button>

<AlertDialog.Root bind:open>
	<form method="POST" action="?/resendPending" use:enhance class="hidden"></form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				Reenviar convite a {batchSize}
				{batchSize === 1 ? 'pessoa' : 'pessoas'}?
			</AlertDialog.Title>
			<AlertDialog.Description>
				Cada pessoa com convite pendente recebe um novo e-mail com um link novo, e o link anterior
				deixa de funcionar.
				{#if recentCount > 0}
					{recentCount}
					{recentCount === 1 ? 'pessoa recebeu' : 'pessoas receberam'} um convite nas últimas 24 horas
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
			<AlertDialog.Action on:click={form.submit}>Reenviar</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
