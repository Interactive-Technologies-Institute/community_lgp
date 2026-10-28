<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	export let progress: {
		videosRecorded: number;
		targetVideoCount: number;
	};

	const formatNumber = (value: number) => new Intl.NumberFormat('pt-PT').format(value);

	$: percent = Math.min(100, (progress.videosRecorded / progress.targetVideoCount) * 100);
</script>

<div class="flex flex-col gap-y-2 rounded-2xl border border-brand-border p-4">
	<div class="flex items-baseline justify-between gap-2">
		<span class="text-sm text-muted-foreground">Vídeos gravados</span>
		<span class="text-sm font-semibold">{Math.floor(percent)}%</span>
	</div>
	<span class="text-2xl font-semibold">
		{formatNumber(progress.videosRecorded)}
		<span class="text-base font-normal text-muted-foreground">
			/ {formatNumber(progress.targetVideoCount)}
		</span>
	</span>
	<div class="h-3 w-full overflow-hidden rounded-full bg-brand-blue/15">
		<div class="h-full rounded-full bg-brand-blue transition-all" style="width: {percent}%"></div>
	</div>
	<div class="flex items-center justify-between gap-2 text-xs">
		<span class="text-muted-foreground">
			Faltam {formatNumber(Math.max(0, progress.targetVideoCount - progress.videosRecorded))}
		</span>
		<a
			href="/moderation/islr-dataset/vocabulary"
			class="inline-flex items-center gap-1 font-semibold text-brand-blue hover:underline"
		>
			Ver vídeos por gesto
			<ArrowRight class="h-3 w-3" />
		</a>
	</div>
</div>
