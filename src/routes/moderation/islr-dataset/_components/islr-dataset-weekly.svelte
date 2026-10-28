<script lang="ts">
	// Oldest first; the last entry is the current, still running week.
	export let weeklyVideoCounts: number[];
	export let collectionStart: string;
	export let maxWeeks: number;

	const formatNumber = (value: number) => new Intl.NumberFormat('pt-PT').format(value);
	const weekFormat = new Intl.DateTimeFormat('pt-PT', {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC',
	});

	// Weeks run Monday to Sunday in UTC, matching how the server buckets them.
	function weekLabel(weeksAgo: number) {
		const monday = new Date();
		monday.setUTCHours(0, 0, 0, 0);
		monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7) - weeksAgo * 7);
		const sunday = new Date(monday);
		sunday.setUTCDate(sunday.getUTCDate() + 6);
		return weekFormat.formatRange(monday, sunday);
	}

	$: videosThisWeek = weeklyVideoCounts[weeklyVideoCounts.length - 1];
	$: videosLastWeek = weeklyVideoCounts.at(-2);
	$: maxWeeklyCount = Math.max(1, ...weeklyVideoCounts);
</script>

<div class="flex flex-col gap-y-2 rounded-2xl border border-brand-border p-4">
	<div class="flex items-baseline justify-between gap-2">
		<span class="text-sm text-muted-foreground">Vídeos gravados esta semana</span>
		{#if videosLastWeek !== undefined}
			<span class="text-sm text-muted-foreground">
				Semana passada: <span class="font-semibold text-foreground"
					>{formatNumber(videosLastWeek)}</span
				>
			</span>
		{/if}
	</div>
	<span class="text-2xl font-semibold">{formatNumber(videosThisWeek)}</span>
	<div
		class="flex h-10 items-end gap-1"
		role="img"
		aria-label="Vídeos por semana nas últimas {weeklyVideoCounts.length} semanas: {weeklyVideoCounts.join(
			', '
		)}"
	>
		{#each weeklyVideoCounts as count, i}
			{@const isCurrentWeek = i === weeklyVideoCounts.length - 1}
			<!-- The whole column is the hover target, so short bars are easy to hit. -->
			<div class="group relative flex h-full flex-1 items-end">
				<div
					class="w-full rounded-t-sm transition-colors {isCurrentWeek
						? 'bg-brand-blue/40 group-hover:bg-brand-blue/60'
						: 'bg-brand-blue group-hover:bg-brand-blue/80'}"
					style="height: {Math.max(4, (count / maxWeeklyCount) * 100)}%"
				></div>
				<div
					class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-brand-border bg-background px-2 py-1 text-xs shadow-md group-hover:block"
				>
					<span class="text-muted-foreground">
						{isCurrentWeek ? 'Esta semana' : weekLabel(weeklyVideoCounts.length - 1 - i)}
					</span>
					<span class="ml-1 font-semibold">
						{formatNumber(count)}
						{count === 1 ? 'vídeo' : 'vídeos'}
					</span>
				</div>
			</div>
		{/each}
	</div>
	<span class="text-xs text-muted-foreground">
		{#if weeklyVideoCounts.length < maxWeeks}
			Desde o início da recolha ({weekFormat.format(new Date(collectionStart))}), de segunda a
			domingo
		{:else}
			Últimas {weeklyVideoCounts.length} semanas, de segunda a domingo
		{/if}
	</span>
</div>
