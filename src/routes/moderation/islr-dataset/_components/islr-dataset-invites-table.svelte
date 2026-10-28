<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Table from '@/components/ui/table';
	import type { ContributorActivity, ContributorInvite, ContributorStage } from '@/types/types';
	import { format, formatDistanceToNow } from 'date-fns';
	import { pt } from 'date-fns/locale';
	import { ArrowDown, ArrowUp } from 'lucide-svelte';
	import { stageMap } from './islr-dataset-stage-map';

	export let invites: ContributorInvite[];
	export let activityByEmail: Record<string, ContributorActivity>;
	export let stageByEmail: Record<string, ContributorStage>;

	type SortKey = 'contributor' | 'stage' | 'videos' | 'lastRecorded' | 'invited';

	const PAGE_SIZE = 20;

	// Furthest along first, so the table reads top to bottom like the funnel.
	const STAGE_ORDER: ContributorStage[] = ['recording', 'consented', 'accepted', 'pending'];
	const FILTER_ORDER: ContributorStage[] = ['pending', 'accepted', 'consented', 'recording'];

	const collator = new Intl.Collator('pt-PT', { sensitivity: 'base' });
	const normalize = (value: string) =>
		value
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();

	let sortKey: SortKey = 'stage';
	// Each column has its own natural order (most videos first, most recent
	// first...); clicking the header again reverses it.
	let reversed = false;
	let stageFilter: ContributorStage | null = null;
	let query = '';
	let pageIndex = 0;

	$: rows = invites.map((invite) => {
		const email = invite.email.toLowerCase();
		const activity = activityByEmail[email];
		return {
			invite,
			stage: stageByEmail[email] ?? 'pending',
			name: activity?.name ?? null,
			videoCount: activity?.videoCount ?? 0,
			videosThisWeek: activity?.videosThisWeek ?? 0,
			lastRecordedAt: activity?.lastRecordedAt ?? null,
		};
	});
	type Row = (typeof rows)[number];

	// Within a stage, whoever has been stuck longest comes first: the recorder
	// who stopped longest ago, the oldest unanswered invite or reminder.
	function stalledSince(row: Row) {
		if (row.stage === 'recording') return row.lastRecordedAt ?? '';
		if (row.stage === 'pending') return row.invite.invite_sent_at ?? row.invite.created_at;
		return row.invite.consent_reminded_at ?? row.invite.used_at ?? '';
	}

	function compare(a: Row, b: Row) {
		switch (sortKey) {
			case 'contributor':
				return collator.compare(a.name ?? a.invite.email, b.name ?? b.invite.email);
			case 'stage':
				return (
					STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage) ||
					stalledSince(a).localeCompare(stalledSince(b))
				);
			case 'videos':
				return b.videoCount - a.videoCount;
			case 'lastRecorded':
				// Never recorded sorts last either way round.
				if (!a.lastRecordedAt || !b.lastRecordedAt) {
					return (reversed ? -1 : 1) * (Number(!a.lastRecordedAt) - Number(!b.lastRecordedAt));
				}
				return b.lastRecordedAt.localeCompare(a.lastRecordedAt);
			case 'invited':
				return b.invite.created_at.localeCompare(a.invite.created_at);
		}
	}

	function sortBy(key: SortKey) {
		if (sortKey === key) {
			reversed = !reversed;
		} else {
			sortKey = key;
			reversed = false;
		}
		pageIndex = 0;
	}

	function setFilter(stage: ContributorStage | null) {
		stageFilter = stage;
		pageIndex = 0;
	}

	$: stageCounts = Object.fromEntries(
		FILTER_ORDER.map((stage) => [stage, rows.filter((row) => row.stage === stage).length])
	) as Record<ContributorStage, number>;
	$: filtered = rows.filter(
		(row) =>
			(!stageFilter || row.stage === stageFilter) &&
			normalize(`${row.name ?? ''} ${row.invite.email}`).includes(normalize(query))
	);
	$: sorted = [...filtered].sort((a, b) => (reversed ? -compare(a, b) : compare(a, b)));
	$: pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
	// Keep the page in range when the list shrinks (e.g. after a rollback).
	$: if (pageIndex > pageCount - 1) pageIndex = pageCount - 1;
	$: pageRows = sorted.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

	const columns: { key: SortKey; label: string; class: string }[] = [
		{ key: 'contributor', label: 'Contribuidor', class: '' },
		{ key: 'stage', label: 'Estado', class: '' },
		{ key: 'videos', label: 'Vídeos', class: '' },
		{ key: 'lastRecorded', label: 'Última gravação', class: '' },
		{ key: 'invited', label: 'Convidado em', class: '' },
	];

	function formatTimestamp(dateString: string) {
		return format(new Date(dateString), 'dd-MM-yyyy HH:mm');
	}

	function formatRelative(dateString: string) {
		return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: pt });
	}
</script>

<div class="flex flex-col gap-y-3">
	<div class="flex flex-wrap items-center justify-between gap-2">
		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors {stageFilter ===
				null
					? 'border-foreground bg-foreground text-background'
					: 'border-brand-border hover:bg-brand-surface'}"
				on:click={() => setFilter(null)}
			>
				Todos ({rows.length})
			</button>
			{#each FILTER_ORDER as stage (stage)}
				<button
					type="button"
					class="rounded-full border px-3 py-1 text-xs font-semibold transition-colors {stageMap[
						stage
					].class} {stageFilter === stage
						? 'ring-2 ring-foreground ring-offset-1'
						: 'opacity-80 hover:opacity-100'}"
					title={stageMap[stage].description}
					on:click={() => setFilter(stageFilter === stage ? null : stage)}
				>
					{stageMap[stage].label} ({stageCounts[stage]})
				</button>
			{/each}
		</div>
		<Input
			type="search"
			placeholder="Procurar nome ou email"
			class="w-full sm:w-64"
			bind:value={query}
			on:input={() => (pageIndex = 0)}
		/>
	</div>

	<div class="w-full overflow-x-auto rounded-2xl border border-brand-border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as column (column.key)}
						<Table.Head class={column.class}>
							<button
								type="button"
								class="inline-flex items-center gap-1 hover:text-foreground"
								on:click={() => sortBy(column.key)}
							>
								{column.label}
								{#if sortKey === column.key}
									<svelte:component this={reversed ? ArrowUp : ArrowDown} class="h-3 w-3" />
								{/if}
							</button>
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each pageRows as row (row.invite.id)}
					{@const stage = stageMap[row.stage]}
					<Table.Row>
						<Table.Cell>
							{#if row.name}
								<div class="font-medium">{row.name}</div>
								<div class="text-xs text-muted-foreground">{row.invite.email}</div>
							{:else}
								{row.invite.email}
							{/if}
						</Table.Cell>
						<Table.Cell>
							<div class="flex flex-col items-start gap-y-1">
								<Badge variant="outline" class={stage.class} title={stage.description}>
									{stage.label}
								</Badge>
								{#if row.stage === 'pending' && row.invite.invite_sent_at}
									<span class="text-xs text-muted-foreground">
										Convite enviado a {formatTimestamp(row.invite.invite_sent_at)}
									</span>
								{:else if row.stage === 'accepted' && row.invite.consent_reminded_at}
									<span class="text-xs text-muted-foreground">
										Lembrete enviado a {formatTimestamp(row.invite.consent_reminded_at)}
									</span>
								{/if}
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="font-semibold tabular-nums">{row.videoCount}</div>
							{#if row.videosThisWeek > 0}
								<div class="mt-0.5 text-xs text-muted-foreground">
									+{row.videosThisWeek} esta semana
								</div>
							{/if}
						</Table.Cell>
						<Table.Cell>
							{#if row.lastRecordedAt}
								<span title={formatTimestamp(row.lastRecordedAt)}>
									{formatRelative(row.lastRecordedAt)}
								</span>
							{:else}
								<span class="text-muted-foreground">—</span>
							{/if}
						</Table.Cell>
						<Table.Cell>{formatTimestamp(row.invite.created_at)}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="text-center text-muted-foreground">
							{invites.length === 0
								? 'Ainda não foram enviados convites.'
								: 'Nenhum contribuidor encontrado.'}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	{#if pageCount > 1}
		<div class="flex items-center justify-end space-x-4">
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
