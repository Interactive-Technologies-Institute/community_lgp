<script lang="ts">
	import { Button } from '@/components/ui/button';
	import PageHeader from '@/components/page-header.svelte';
	import { ClipboardCheck, Video } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
	$: ({
		targetSignCount,
		signsCovered,
		videosCollected,
		totalContributors,
		myContributedCount,
		queueLength,
	} = data);

	const VIDEO_TARGET = 6000;

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
	subtitle="Obrigado por fazer parte deste esforço coletivo, feito de forma voluntária pela comunidade."
/>

<div class="container mx-auto max-w-3xl space-y-4 pb-10">
	<!-- svelte-ignore a11y-media-has-caption -->
	<!-- TODO: placeholder video, replace with the real explainer for the record/review steps -->
	<video class="h-auto w-full rounded-2xl" controls playsinline>
		<source src="/videos/dashboard-intro.mp4" type="video/mp4" />
		O seu navegador não suporta a reprodução deste vídeo.
	</video>

	<div class="rounded-2xl bg-brand-surface p-6">
		<div
			class="grid grid-cols-1 divide-y divide-brand-blue/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
		>
			<div class="px-2 py-4 text-center sm:py-0">
				<p class="text-4xl font-black text-brand-dark sm:text-5xl">
					{formatNumber(signsCovered)} / {formatNumber(targetSignCount)}
				</p>
				<p class="mt-2 text-sm font-semibold text-base sm:text-base">sinais já têm vídeo</p>
			</div>
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

	<div class="rounded-2xl border bg-card p-6">
		<p class="text-center text-base text-foreground">
			Contribuíste com <strong>{myContributedCount}</strong> sinais até agora. Obrigado!
		</p>

		<div class="mt-5 flex flex-col gap-3">
			{#if queueLength > 0}
				<Button
					href="/islr-dataset/record"
					class="h-16 w-full gap-3 bg-brand-blue text-lg font-bold text-brand-white shadow-md hover:bg-brand-blue/90"
				>
					<Video class="h-6 w-6" />
					Gravar o próximo sinal
				</Button>
			{:else}
				<p class="text-center text-lg font-semibold text-brand-dark">
					Já contribuíste com um vídeo para todos os sinais do dataset. Obrigado pelo teu esforço!
				</p>
			{/if}

		</div>
	</div>
</div>
