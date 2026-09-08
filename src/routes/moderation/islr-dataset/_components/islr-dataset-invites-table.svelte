<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';
	import * as Table from '@/components/ui/table';
	import type { ContributorInvite } from '@/types/types';
	import { format } from 'date-fns';

	export let invites: ContributorInvite[];

	function formatTimestamp(dateString: string) {
		return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
	}
</script>

<div class="w-full overflow-x-auto rounded-2xl border border-brand-border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Email</Table.Head>
				<Table.Head>Estado</Table.Head>
				<Table.Head>Convidado em</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each invites as invite (invite.id)}
				<Table.Row>
					<Table.Cell>{invite.email}</Table.Cell>
					<Table.Cell>
						{#if invite.used_at}
							<Badge variant="outline">Aceite</Badge>
						{:else}
							<Badge variant="secondary">Pendente</Badge>
						{/if}
					</Table.Cell>
					<Table.Cell>{formatTimestamp(invite.created_at)}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={3} class="text-center text-muted-foreground">
						Ainda não foram enviados convites.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
