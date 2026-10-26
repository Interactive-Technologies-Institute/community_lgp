<script lang="ts">
	export let progress: {
		videosRecorded: number;
		signsComplete: number;
		targetVideoCount: number;
		targetSignCount: number;
		videosPerSignTarget: number;
	};

	const formatNumber = (value: number) => new Intl.NumberFormat('pt-PT').format(value);

	$: bars = [
		{
			label: 'Vídeos gravados',
			value: progress.videosRecorded,
			target: progress.targetVideoCount,
			hint: null,
		},
		{
			label: 'Gestos completos',
			value: progress.signsComplete,
			target: progress.targetSignCount,
			hint: `Com ${formatNumber(progress.videosPerSignTarget)} ou mais vídeos`,
		},
	];
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	{#each bars as bar (bar.label)}
		{@const percent = Math.min(100, (bar.value / bar.target) * 100)}
		<div class="flex flex-col gap-y-2 rounded-2xl border border-brand-border p-4">
			<div class="flex items-baseline justify-between gap-2">
				<span class="text-sm text-muted-foreground">{bar.label}</span>
				<span class="text-sm font-semibold">{Math.floor(percent)}%</span>
			</div>
			<span class="text-2xl font-semibold">
				{formatNumber(bar.value)}
				<span class="text-base font-normal text-muted-foreground">
					/ {formatNumber(bar.target)}
				</span>
			</span>
			<div class="h-3 w-full overflow-hidden rounded-full bg-brand-blue/15">
				<div
					class="h-full rounded-full bg-brand-blue transition-all"
					style="width: {percent}%"
				></div>
			</div>
			<span class="text-xs text-muted-foreground">
				{#if bar.value >= bar.target}
					Objetivo atingido
				{:else}
					Faltam {formatNumber(bar.target - bar.value)}{bar.hint ? ` · ${bar.hint}` : ''}
				{/if}
			</span>
		</div>
	{/each}
</div>
