<script lang="ts">
	import AchievementsDialog from '@/components/AchievementsDialog.svelte';
	import * as Accordion from '@/components/ui/accordion';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import InviteShareCard from '@/components/InviteShareCard.svelte';
	import { PERSONAL_MILESTONES, PERSONAL_MILESTONE_LABELS } from '@/islr-milestones';
	import { Camera, ClipboardCheck, HelpCircle } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let helpOpen = false;

	const faqs = [
		{
			question: 'Para que servem os vídeos que grava?',
			answer:
				'Os vídeos servirão, no futuro, para permitir pesquisar no dicionário gesticulando o gesto, em vez de ter de o escrever ou de selecionar parâmetros. Para construirmos esta funcionalidade, precisamos da ajuda de muitas pessoas a contribuir com vídeos de LGP, como a sua.',
			link: {
				href: 'https://www.youtube.com/watch?v=tUTgAK1tGBw',
				label: 'Veja aqui uma demonstração',
			},
		},
		{
			question: 'Onde ficam guardados os vídeos que grava?',
			answer:
				'Os vídeos ficam guardados num local seguro, com acesso restrito ao IST, à UCP e à APS.',
		},
		{
			question: 'Os vídeos que grava serão partilhados?',
			answer:
				'Não. Os vídeos nunca serão partilhados nem publicados. São utilizados apenas para investigação científica em LGP e para melhorar o dicionário.',
		},
		{
			question: 'Há um limite para quantos vídeos pode filmar, ou até quando?',
			answer:
				'Não há limite: pode filmar sempre que quiser e, quantos mais vídeos contribuir, melhor. Esta primeira recolha decorre até ao final de 2026, por isso aproveite para contribuir o máximo possível até lá.',
		},
		{
			question: 'O vídeo precisa de ter alguma qualidade específica?',
			answer:
				'Não há requisitos rígidos, mas ajuda muito se o vídeo tiver boa iluminação, se as mãos e o rosto estiverem visíveis e se o fundo for simples, sem outras pessoas ou objetos em movimento.',
		},
		{
			question: 'Pode pedir para apagar um vídeo que já enviou?',
			answer:
				'Sim. Pode pedir para ver, corrigir ou apagar os seus dados a qualquer momento, através do contacto indicado acima.',
		},
	];

	export let data;
	$: ({
		targetSignCount,
		signsCovered,
		videosCollected,
		totalContributors,
		myContributedCount,
		queueLength,
		myVideoCount,
		firstName,
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

<div class="container relative mx-auto flex flex-auto flex-col items-start justify-start overflow-x-auto pt-2">
	<h1 class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">
		{#if myVideoCount === 0}
			{firstName ? `Olá, ${firstName}!` : 'Olá!'}
		{:else}
			{firstName ? `Olá de novo, ${firstName}!` : 'Olá de novo!'}
		{/if}
	</h1>
	<p class="mt-1 mb-10 leading-7 text-foreground">
		{#if myVideoCount === 0}
			Cada gesto que grava ensina a pesquisa por vídeo a reconhecer LGP.
		{:else}
			{myVideoCount === 1 ? 'O seu' : 'Os seus'}
			<span class="font-bold text-[#2b2b9c]">{formatNumber(myVideoCount)}</span>
			{myVideoCount === 1 ? 'gesto já está' : 'gestos já estão'} a ensinar a pesquisa por vídeo a reconhecer
			LGP.
		{/if}
	</p>

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
	<Dialog.Content class="max-h-[85vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Precisa de ajuda?</Dialog.Title>
			<Dialog.Description>
				Em caso de dúvida contactar <strong>joana.peixinho@tecnico.ulisboa.pt</strong>
			</Dialog.Description>
		</Dialog.Header>

		<Accordion.Root class="px-1">
			{#each faqs as faq, i (i)}
				<Accordion.Item value={`faq-${i}`}>
					<Accordion.Trigger class="text-left font-semibold">
						{faq.question}
					</Accordion.Trigger>
					<Accordion.Content>
						{faq.answer}
						{#if faq.link}
							<a
								href={faq.link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-1 block font-medium text-brand-blue underline"
							>
								{faq.link.label}
							</a>
						{/if}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>

<div class="container mx-auto space-y-8 pb-10">
	{#if queueLength > 0}
		<div
			class="grid grid-cols-[minmax(0,1fr)_520px] items-center gap-[48px] rounded-[18px] border border-[#f0dc7a] bg-[#f7f1c9] p-[28px] max-[900px]:grid-cols-1"
		>
			<div class="flex flex-col items-start">
				<h2 class="text-[30px] font-extrabold leading-[1.1] text-[#2b2b9c]">
					Pronto para começar?
				</h2>

				<p class="mt-2 text-[16px] font-medium text-[#333]">
					Veja o gesto <span class="text-[#3a96f7]">→</span> Repita-o <span class="text-[#3a96f7]">→</span> Passe ao seguinte
				</p>

				<div class="mt-6 flex items-center gap-4">
					<Button
						href="/islr-dataset/record"
						class="h-14 w-auto whitespace-nowrap bg-brand-blue px-10 py-0 text-lg font-bold text-brand-white shadow-lg hover:bg-brand-blue/90"
					>
						<Camera class="mr-2 size-5" />
						Começar a gravar
					</Button>

					<p class="text-[14px] text-[#6b6b6b]">
						Cada gesto leva ~10 segundos
					</p>
				</div>
			</div>

			<div
				class="relative aspect-[520/250] w-[520px] max-w-full justify-self-center overflow-hidden rounded-xl border border-[#e3d78e] shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:justify-self-end"
			>
				<img
					src="/img/preview-gravar-panels.png"
					alt=""
					aria-hidden="true"
					class="h-full w-full object-cover object-left"
				/>
			</div>
		</div>
	{:else}
		<div class="rounded-2xl border-2 border-brand-blue bg-brand-blue/5 p-4 shadow-md">
			<p class="text-center text-lg font-semibold text-brand-dark">
				Já contribuiu com um vídeo para todos os gestos do dataset. Obrigado pelo seu esforço!
			</p>
		</div>
	{/if}

	<div class="flex flex-col gap-5 md:flex-row md:gap-10">
		<div class="flex-1 rounded-2xl bg-brand-surface p-5">
			<div class="flex items-center justify-between gap-2">
				<p class="text-base font-semibold text-brand-dark">O seu progresso pessoal</p>
				<p class="text-base font-bold text-brand-blue">
					{formatNumber(myVideoCount)} / {formatNumber(milestoneCeiling)}
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
					{#if milestonesMaxed}
						Conquistou tudo!
					{:else}
						Faltam {formatNumber(milestoneCeiling - myVideoCount)} para "{PERSONAL_MILESTONE_LABELS[milestoneCeiling]}"
					{/if}
				</p>
				<AchievementsDialog {myVideoCount} />
			</div>
		</div>

		<div class="flex-1 rounded-2xl border bg-card p-5">
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
				+{formatNumber(videosThisWeek)} gestos esta semana · {formatNumber(totalContributors)}
				{totalContributors === 1 ? 'pessoa contribuiu' : 'pessoas contribuíram'}
			</p>
		</div>
	</div>

	<InviteShareCard />
</div>
