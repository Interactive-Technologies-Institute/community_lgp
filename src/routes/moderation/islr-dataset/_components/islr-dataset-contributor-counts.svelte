<script lang="ts">
	import type { ContributorStage } from '@/types/types';

	export let stageByEmail: Record<string, ContributorStage>;

	const formatNumber = (value: number) => new Intl.NumberFormat('pt-PT').format(value);

	// Each count includes everyone who got further, so they read as a funnel.
	$: stages = Object.values(stageByEmail);
	$: counts = [
		{ label: 'convidados', value: stages.length },
		{ label: 'aceitaram', value: stages.filter((stage) => stage !== 'pending').length },
		{
			label: 'deram consentimento',
			value: stages.filter((stage) => stage === 'consented' || stage === 'recording').length,
		},
		{ label: 'gravaram', value: stages.filter((stage) => stage === 'recording').length },
	];
</script>

<p class="text-sm text-muted-foreground">
	{#each counts as count, i (count.label)}
		{#if i > 0}<span class="mx-1.5" aria-hidden="true">·</span>{/if}
		<span class="font-semibold text-foreground">{formatNumber(count.value)}</span>
		{count.label}
	{/each}
</p>
