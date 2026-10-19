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
	export let pendingCount: number;
	export let batchLimit: number;

	let open = false;

	const form = superForm(data, {
		validators: zodClient(resendPendingInvitesSchema),
	});

	const { enhance, submitting } = form;

	$: batchSize = Math.min(pendingCount, batchLimit);
</script>

<Button variant="outline" on:click={() => (open = true)} disabled={pendingCount === 0 || $submitting}>
	<MailPlus class="mr-2 h-4 w-4" />
	{$submitting ? 'A reenviar...' : `Reenviar pendentes (${pendingCount})`}
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
				{#if pendingCount > batchLimit}
					Há {pendingCount} convites pendentes, mas por causa do limite de envio do Gmail só são
					reenviados {batchLimit} de cada vez (os que estão há mais tempo sem e-mail). Para os
					restantes, repita daqui a cerca de uma hora.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<AlertDialog.Action on:click={form.submit}>Reenviar</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
