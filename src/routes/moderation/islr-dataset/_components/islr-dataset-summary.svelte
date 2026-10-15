<script lang="ts">
	export let summary: {
		signsRecorded: number;
		videosRecorded: number;
		contributorsWhoRecorded: number;
		contributorsInvited: number;
	};

	const formatNumber = (value: number) => new Intl.NumberFormat('pt-PT').format(value);

	$: stats = [
		{ label: 'Gestos gravados', value: summary.signsRecorded },
		{ label: 'Vídeos gravados', value: summary.videosRecorded },
		{ label: 'Contribuidores que gravaram', value: summary.contributorsWhoRecorded },
		{ label: 'Contribuidores convidados', value: summary.contributorsInvited },
	];
</script>

<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
	{#each stats as stat (stat.label)}
		<div class="flex flex-col gap-y-1 rounded-2xl border border-brand-border p-4">
			<span class="text-sm text-muted-foreground">{stat.label}</span>
			<span class="text-2xl font-semibold">{formatNumber(stat.value)}</span>
		</div>
	{/each}
</div>
