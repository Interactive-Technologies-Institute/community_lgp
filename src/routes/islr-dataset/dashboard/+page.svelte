<script lang="ts">
	import { Button } from '@/components/ui/button';
	import PageHeader from '@/components/page-header.svelte';
	import { PERSONAL_MILESTONES, PERSONAL_MILESTONE_LABELS } from '@/islr-milestones';
	import { Award, ClipboardCheck, Video } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

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
	} = data);

	const VIDEO_TARGET = 6000;

	$: milestonesMaxed = nextMilestoneIndex >= PERSONAL_MILESTONES.length;
	$: segmentSpan = milestoneCeiling - milestoneFloor;
	$: segmentProgressPercent = milestonesMaxed
		? 100
		: Math.min(100, Math.max(0, ((myVideoCount - milestoneFloor) / segmentSpan) * 100));

	function formatNumber(value: number) {
		return value.toLocaleString('pt-PT');
	}
</script>

<MetaTags
	title="Dataset ISLR"
	description="Acompanhe o progresso coletivo da contribuição para o dataset ISLR de Língua Gestual Portuguesa."
/>

<PageHeader
	title="Contribuição para o Dataset ISLR"
	subtitle="Obrigado por fazer parte deste esforço coletivo, feito de forma voluntária pela comunidade para a comunidade."
/>

<div class="container mx-auto max-w-3xl space-y-4 pb-10">
		<div class="mt-5 flex flex-col gap-3">
			{#if queueLength > 0}
				<Button
					href="/islr-dataset/record"
					class="h-16 w-full gap-3 bg-brand-blue text-lg font-bold text-brand-white shadow-md hover:bg-brand-blue/90"
				>
					<Video class="h-6 w-6" />
					Gravar o próximo gesto
				</Button>
			{:else}
				<p class="text-center text-lg font-semibold text-brand-dark">
					Já contribuíste com um vídeo para todos os gestos do dataset. Obrigado pelo teu esforço!
				</p>
			{/if}

		</div>


	<div class="rounded-2xl bg-brand-surface p-6">
		<div
			class="grid grid-cols-1 divide-y divide-brand-blue/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0"
		>

			<div class="px-2 py-4 text-center sm:py-0">
				<p class="text-4xl font-black text-brand-dark sm:text-5xl">
					{formatNumber(videosCollected)} / {formatNumber(VIDEO_TARGET)}
				</p>
				<p class="mt-2 text-sm font-semibold text-base sm:text-base">vídeos recolhidos</p>
			</div>
			<div class="px-2 py-4 text-center sm:py-0">
				<p class="text-4xl font-black text-brand-dark sm:text-5xl">
					{formatNumber(totalContributors)}
				</p>
				<p class="mt-2 text-sm font-semibold text-base sm:text-base">pessoas contribuíram</p>
			</div>
		</div>
	</div>

	<div class="rounded-2xl bg-brand-surface p-6">
		<div class="flex items-center justify-between gap-2">
			<p class="text-sm font-semibold text-brand-dark">O teu progresso pessoal</p>
			<p class="text-sm font-semibold text-brand-dark">
				{formatNumber(myVideoCount)} / {formatNumber(milestoneCeiling)} vídeos
			</p>
		</div>
		<div class="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-border/40">
			<div
				class="h-full rounded-full bg-brand-yellow transition-all"
				style="width: {segmentProgressPercent}%"
			></div>
		</div>
		<p class="mt-2 text-center text-sm text-muted-foreground">
			{#if milestonesMaxed}
				Atingiste todos os marcos pessoais. Obrigado pelo teu esforço!
			{:else}
				Faltam <strong>{formatNumber(milestoneCeiling - myVideoCount)}</strong> vídeos para o marco
				"{PERSONAL_MILESTONE_LABELS[milestoneCeiling]}"
			{/if}
		</p>
	</div>

	<div class="rounded-2xl border bg-card p-6">
		<p class="mb-4 text-center text-base font-semibold text-foreground">Marcos pessoais</p>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{#each PERSONAL_MILESTONES as milestone (milestone)}
				{@const unlocked = myVideoCount >= milestone}
				<div
					class="flex flex-col items-center gap-2 rounded-xl border p-3 text-center {unlocked
						? 'border-brand-blue bg-brand-blue/5'
						: 'border-brand-border/50 bg-muted/30 opacity-50'}"
				>
					<Award class="h-6 w-6 {unlocked ? 'text-brand-blue' : 'text-muted-foreground'}" />
					<p
						class="text-xs font-semibold {unlocked ? 'text-brand-dark' : 'text-muted-foreground'}"
					>
						{PERSONAL_MILESTONE_LABELS[milestone]}
					</p>
					<p class="text-[11px] text-muted-foreground">{formatNumber(milestone)} vídeos</p>
				</div>
			{/each}
		</div>
	</div>

</div>
