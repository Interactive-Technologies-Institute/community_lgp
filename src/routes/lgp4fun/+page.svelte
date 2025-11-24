<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import Button from '@/components/ui/button/button.svelte';
	import { Dialog, DialogContent, DialogTrigger } from '$lib/components/ui/dialog';

	let gameLoaded = false;
	let iframeRef: HTMLIFrameElement;
</script>

<MetaTags title="LGP4Fun" description="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />

<PageHeader title="LGP4Fun" subtitle="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />

<!-- Intro Section -->
<section class="mx-auto mt-6 max-w-5xl space-y-4 px-4">
	<p class="text-muted-foreground">
		O <strong>LGP4Fun</strong> é um jogo interativo para dois jogadores do 1.º Ciclo ou Pré-Escolar que
		promove a aprendizagem bilingue de <strong>Língua Gestual Portuguesa e Português</strong> através de 4 níveis
		progressivos. Ideal para salas de aula e momentos de prática lúdica.
	</p>
</section>

<!-- Levels Section -->
<section class="mx-auto mt-10 max-w-6xl space-y-10 px-4">
	<h2 class="text-xl font-bold text-primary">Níveis do Jogo</h2>
	<div class="grid gap-8 sm:grid-cols-2">
		<!-- Level 0 -->
		<div class="flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
			<img src="/img/image-game-level0.png" alt="Nível 0 - Alfabeto Pré-Escolar" class="rounded-md object-cover" />
			<div>
				<h3 class="mb-2 font-semibold">Nível 0 – Alfabeto Pré-Escolar</h3>
				<p class="text-muted-foreground">
					Treinar o reconhecimento de uma letra alvo escolhida. Para concluir cada ronda deves
					recolher: a imagem do gesto em LGP e a letra maiúscula em imprensa.
				</p>
			</div>
		</div>
		<!-- Level 1 -->
		<div class="flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
			<img src="/img/image-game-level1.png" alt="Nível 1 - Alfabeto" class="rounded-md object-cover" />
			<div>
				<h3 class="mb-2 font-semibold">Nível 1 – Alfabeto</h3>
				<p class="text-muted-foreground">
					Treinar o reconhecimento de uma letra alvo escolhida. Para concluir cada ronda deves
					recolher: a imagem do gesto em LGP, a letra maiúscula manuscrita e a letra minúscula
					manuscrita.
				</p>
			</div>
		</div>
		<!-- Level 2 -->
		<div class="flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
			<img src="/img/image-game-level2.png" alt="Nível 2 - Vocabulário Temático" class="rounded-md object-cover" />
			<div>
				<h3 class="mb-2 font-semibold">Nível 2 – Vocabulário Temático</h3>
				<p class="text-muted-foreground">
					Treinar o vocabulário sobre um tema escolhido. Cada ronda apresenta um puzzle de três
					painéis com: vídeo do gesto em LGP, imagem ilustrativa e palavra escrita. Tens de encontrar 
					e recolher os painéis em falta para completar o puzzle.
				</p>
			</div>
		</div>
		<!-- Level 3 -->
		<div class="flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
			<img src="/img/image-game-level3.png" alt="Nível 3 - Letras em Falta" class="rounded-md object-cover" />
			<div>
				<h3 class="mb-2 font-semibold">Nível 3 – Letras em Falta</h3>
				<p class="text-muted-foreground">
					Treinar a escrita sobre um tema escolhido. Cada ronda apresenta um puzzle de três
					painéis com um elemento em falta: umas letras. Tens de encontrar e recolher as letras em falta para completar o puzzle.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Play Button / Dialog Trigger -->
<section class="mx-auto my-16 flex max-w-6xl flex-col items-center justify-center px-4">
	<p class="mb-4 text-muted-foreground">
		Pronto para começar a jogar?
	</p>
	<Dialog>
		<DialogTrigger class="inline-block">
			<Button class="group flex items-center gap-2 px-8 py-6 text-lg">
				<span class="font-semibold">Jogar</span>
			</Button>
		</DialogTrigger>
		<DialogContent class="max-w-[960px] p-0 border-0 bg-transparent shadow-none">
			<div class="relative mx-auto overflow-hidden border-2 border-slate-800 bg-black">
				<iframe
					bind:this={iframeRef}
					src="/game/index.html"
					frameborder="0"
					title="LGP4Fun"
					height="540"
					width="960"
					on:load={() => {
						gameLoaded = true;
					}}
				/>
				{#if !gameLoaded}
					<div class="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
						A carregar jogo...
					</div>
				{/if}
			</div>
		</DialogContent>
	</Dialog>
</section>
