<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';
	import { Button } from '@/components/ui/button';
	import * as Table from '@/components/ui/table';
	import type { ContributorInvite, ContributorStage } from '@/types/types';
	import { format } from 'date-fns';
	import { stageMap } from './islr-dataset-stage-map';

	export let invites: ContributorInvite[];
	export let videoCountByEmail: Record<string, number>;
	export let stageByEmail: Record<string, ContributorStage>;

	const PAGE_SIZE = 20;

	let pageIndex = 0;

	$: pageCount = Math.max(1, Math.ceil(invites.length / PAGE_SIZE));
	// Keep the page in range when the list shrinks (e.g. after a rollback).
	$: if (pageIndex > pageCount - 1) pageIndex = pageCount - 1;
	$: pageInvites = invites.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

	function formatTimestamp(dateString: string) {
		return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
	}

	function formatDate(dateString: string) {
		return format(new Date(dateString), 'dd-MM-yyyy');
	}
</script>

<div>
	<div class="w-full overflow-x-auto rounded-2xl border border-brand-border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Email</Table.Head>
					<Table.Head>Estado</Table.Head>
					<Table.Head>Convidado em</Table.Head>
					<Table.Head class="text-right">Vídeos</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each pageInvites as invite (invite.id)}
					{@const stageKey = stageByEmail[invite.email.toLowerCase()] ?? 'pending'}
					{@const stage = stageMap[stageKey]}
					<Table.Row>
						<Table.Cell>{invite.email}</Table.Cell>
						<Table.Cell>
							<div class="flex flex-col items-start gap-y-1">
								<Badge variant="outline" class={stage.class} title={stage.description}>
									{stage.label}
								</Badge>
								{#if stageKey === 'accepted' && invite.consent_reminded_at}
									<span class="text-xs text-muted-foreground">
										Lembrete enviado a {formatDate(invite.consent_reminded_at)}
									</span>
								{/if}
							</div>
						</Table.Cell>
						<Table.Cell>{formatTimestamp(invite.created_at)}</Table.Cell>
						<Table.Cell class="text-right tabular-nums">
							{videoCountByEmail[invite.email.toLowerCase()] ?? 0}
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={4} class="text-center text-muted-foreground">
							Ainda não foram enviados convites.
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	{#if pageCount > 1}
		<div class="flex items-center justify-end space-x-4 py-4">
			<span class="text-sm text-muted-foreground">Página {pageIndex + 1} de {pageCount}</span>
			<Button
				variant="outline"
				size="sm"
				on:click={() => (pageIndex = pageIndex - 1)}
				disabled={pageIndex === 0}>Anterior</Button
			>
			<Button
				variant="outline"
				size="sm"
				disabled={pageIndex >= pageCount - 1}
				on:click={() => (pageIndex = pageIndex + 1)}>Seguinte</Button
			>
		</div>
	{/if}
</div>
