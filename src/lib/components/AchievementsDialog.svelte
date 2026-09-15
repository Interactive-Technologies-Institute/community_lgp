<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { PERSONAL_MILESTONES, PERSONAL_MILESTONE_LABELS } from '@/islr-milestones';
	import { Trophy } from 'lucide-svelte';

	export let myVideoCount: number;

	let open = false;
	let showAll = false;

	function formatNumber(value: number) {
		return value.toLocaleString('pt-PT');
	}

	// The next locked milestone gets the spotlight - showing every badge as an
	// equally-sized gray circle when the user has unlocked few (or none) of
	// them reads as a wall of losses rather than a goal to chase.
	$: nextMilestone = PERSONAL_MILESTONES.find((m) => myVideoCount < m) ?? null;
	$: otherMilestones = PERSONAL_MILESTONES.filter((m) => m !== nextMilestone);

	function floorFor(milestone: number) {
		const index = PERSONAL_MILESTONES.indexOf(milestone as (typeof PERSONAL_MILESTONES)[number]);
		return index <= 0 ? 0 : PERSONAL_MILESTONES[index - 1];
	}

	function progressFor(milestone: number) {
		if (myVideoCount >= milestone) return 100;
		const floor = floorFor(milestone);
		if (myVideoCount <= floor) return 0;
		return Math.min(100, Math.max(0, ((myVideoCount - floor) / (milestone - floor)) * 100));
	}

	// Reset the "ver todas" expansion each time the dialog is reopened.
	$: if (!open) showAll = false;
</script>

<Button
	variant="ghost"
	size="sm"
	class="h-auto gap-1 p-0 text-xs font-semibold text-brand-blue hover:bg-transparent hover:underline"
	on:click={() => (open = true)}
>
	<Trophy class="h-3.5 w-3.5" />
	Ver as minhas conquistas
</Button>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>As minhas conquistas</Dialog.Title>
		</Dialog.Header>

		{#if nextMilestone}
			<div
				class="flex flex-col items-center gap-1 rounded-xl border-2 border-brand-blue bg-brand-blue/5 p-4 text-center"
			>
				<img
					src="/img/badges/{nextMilestone}.png"
					alt={PERSONAL_MILESTONE_LABELS[nextMilestone]}
					class="h-28 w-28 object-contain"
				/>
				<p class="text-sm font-bold text-brand-dark">{PERSONAL_MILESTONE_LABELS[nextMilestone]}</p>
				<p class="text-sm font-semibold text-brand-blue">
					Faltam {formatNumber(nextMilestone - myVideoCount)} vídeos
				</p>
				<div class="mt-1 h-2 w-full max-w-40 overflow-hidden rounded-full bg-brand-blue/15">
					<div
						class="h-full rounded-full bg-brand-yellow"
						style="width: {progressFor(nextMilestone)}%"
					></div>
				</div>
			</div>
		{:else}
			<p class="text-center text-sm font-semibold text-brand-dark">
				Conquistou tudo! Obrigado pelo seu esforço.
			</p>
		{/if}

		{#if showAll}
			<div class="mt-2 grid grid-cols-3 gap-3">
				{#each otherMilestones as milestone (milestone)}
					{@const unlocked = myVideoCount >= milestone}
					<div
						class="flex flex-col items-center gap-1 rounded-lg border p-2 text-center {unlocked
							? 'border-brand-blue/40'
							: 'border-brand-border/50 bg-muted/30'}"
					>
						<img
							src="/img/badges/{milestone}.png"
							alt={PERSONAL_MILESTONE_LABELS[milestone]}
							class="h-14 w-14 object-contain {unlocked ? '' : 'grayscale'}"
						/>
						<p
							class="text-[10px] font-medium leading-tight {unlocked
								? 'text-brand-dark'
								: 'text-muted-foreground'}"
						>
							{PERSONAL_MILESTONE_LABELS[milestone]}
						</p>
						<div class="h-1 w-full overflow-hidden rounded-full bg-brand-border/40">
							<div
								class="h-full rounded-full bg-brand-yellow"
								style="width: {progressFor(milestone)}%"
							></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if otherMilestones.length > 0}
			<button
				type="button"
				class="mt-1 text-xs font-semibold text-brand-blue hover:underline"
				on:click={() => (showAll = true)}
			>
				Ver todas ({otherMilestones.length})
			</button>
		{/if}
	</Dialog.Content>
</Dialog.Root>
