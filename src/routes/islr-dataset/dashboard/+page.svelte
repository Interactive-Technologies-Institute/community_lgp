<script lang="ts">
	import AchievementsDialog from '@/components/AchievementsDialog.svelte';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import PageHeader from '@/components/page-header.svelte';
	import { PERSONAL_MILESTONES, PERSONAL_MILESTONE_LABELS } from '@/islr-milestones';
	import { ClipboardCheck, HelpCircle, Video } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let helpOpen = false;

	export let data;
	$: ({
		targetSignCount,
		signsCovered,
		videosCollected,
		totalContributors,
		myContributedCount,
		queueLength,
		myVideoCount,
		nextMilestoneIndex,
		milestoneFloor,
		milestoneCeiling,
		weeklyVideoCounts,
		videosThisWeek,
	} = data);

	$: milestonesMaxed = nextMilestoneIndex >= PERSONAL_MILESTONES.length;
	$: segmentSpan = milestoneCeiling - milestoneFloor;
	$: segmentProgressPercent = milestonesMaxed
		? 100
		: Math.min(100, Math.max(0, ((myVideoCount - milestoneFloor) / segmentSpan) * 100));

	$: maxWeeklyCount = Math.max(1, ...weeklyVideoCounts);

	function formatNumber(value: number) {
		return value.toLocaleString('pt-PT');
	}
</script>

<MetaTags
	title="Dataset ISLR"
	description="Acompanhe o progresso coletivo da contribuição para o dataset ISLR de Língua Gestual Portuguesa."
/>

<div class="relative">
	<PageHeader
		title="Contribuição para o Dataset ISLR"
		subtitle="Obrigado por fazer parte deste esforço coletivo, feito de forma voluntária pela comunidade para a comunidade."
	/>

	<Button
		variant="outline"
		size="icon"
		class="absolute right-4 top-4 rounded-full shadow-md"
		aria-label="Ajuda"
		on:click={() => (helpOpen = true)}
	>
		<HelpCircle class="h-5 w-5" />
	</Button>
</div>

<Dialog.Root bind:open={helpOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Precisas de ajuda?</Dialog.Title>
			<Dialog.Description>
				Em caso de dúvida contactar <strong>joana.peixinho@tecnico.ulisboa.pt</strong>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<div class="container mx-auto max-w-3xl space-y-3 pb-10">
	<div
		class="flex flex-col rounded-2xl border-2 border-brand-blue bg-brand-blue/5 p-4 shadow-md"
	>
		{#if queueLength > 0}
			<Button
				href="/islr-dataset/record"
				class="h-16 w-full gap-3 bg-brand-blue text-lg font-bold text-brand-white shadow-lg hover:bg-brand-blue/90"
			>
				<Video class="h-6 w-6" />
				Gravar o próximo gesto
			</Button>
		{:else}
			<p class="text-center text-lg font-semibold text-brand-dark">
				Já contribuiu com um vídeo para todos os gestos do dataset. Obrigado pelo seu esforço!
			</p>
		{/if}
	</div>

	<div class="rounded-2xl bg-brand-surface p-5">
		<div class="flex items-center justify-between gap-2">
			<p class="text-base font-semibold text-brand-dark">O seu progresso pessoal</p>
			<p class="text-base font-bold text-brand-blue">
				{#if milestonesMaxed}
					Conquistou tudo!
				{:else}
					Faltam {formatNumber(milestoneCeiling - myVideoCount)} vídeos
				{/if}
			</p>
		</div>
		<div class="mt-3 h-6 w-full overflow-hidden rounded-full bg-brand-blue/15">
			<div
				class="h-full rounded-full bg-brand-yellow transition-all"
				style="width: {segmentProgressPercent}%"
			></div>
		</div>
		<div class="mt-2 flex items-center justify-between gap-2">
			<p class="text-xs text-muted-foreground">
				{formatNumber(myVideoCount)} / {formatNumber(milestoneCeiling)} vídeos
				{#if !milestonesMaxed}
					· conquista "{PERSONAL_MILESTONE_LABELS[milestoneCeiling]}"
				{/if}
			</p>
			<AchievementsDialog {myVideoCount} />
		</div>
	</div>

	<div class="rounded-2xl border bg-card p-5">
		<div class="flex items-baseline justify-between gap-2">
			<p class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
				A comunidade
			</p>
			<p class="text-2xl font-black text-brand-dark">
				{formatNumber(videosCollected)}
			</p>
		</div>

		<div class="mt-3 flex h-12 items-end gap-1.5">
			{#each weeklyVideoCounts as count}
				<div
					class="flex-1 rounded-t-sm bg-brand-blue/40"
					style="height: {Math.max(4, (count / maxWeeklyCount) * 100)}%"
				></div>
			{/each}
		</div>

		<p class="mt-2 text-xs text-muted-foreground">
			+{formatNumber(videosThisWeek)} gestos esta semana · {formatNumber(totalContributors)} pessoas
			contribuíram
		</p>
	</div>
</div>
