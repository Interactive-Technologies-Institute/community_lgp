<script lang="ts">
	import { Dialog, DialogContent, DialogTrigger } from '$lib/components/ui/dialog';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { ChevronLeft, ChevronRight, Keyboard, MonitorX, Play } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';

	let gameLoaded = false;
	let iframeRef: HTMLIFrameElement;
	let levelsCarouselApi: CarouselAPI | undefined;
	let attachedCarouselApi: CarouselAPI | undefined;
	let activeLevel = 0;

	const levels = [
		{
			number: 0,
			title: 'Alfabeto Pré-Escolar',
			image: '/img/image-game-level0.png',
			alt: 'Nível 0 do LGP4Fun — Alfabeto Pré-Escolar',
			description:
				'Treinar o reconhecimento de uma letra alvo escolhida. Para concluir cada ronda deve recolher: a imagem do gesto em LGP e a letra maiúscula em imprensa.',
		},
		{
			number: 1,
			title: 'Alfabeto',
			image: '/img/image-game-level1.png',
			alt: 'Nível 1 do LGP4Fun — Alfabeto',
			description:
				'Treinar o reconhecimento de uma letra alvo escolhida. Para concluir cada ronda deve recolher: a imagem do gesto em LGP, a letra maiúscula manuscrita e a letra minúscula manuscrita.',
		},
		{
			number: 2,
			title: 'Vocabulário Temático',
			image: '/img/image-game-level2.png',
			alt: 'Nível 2 do LGP4Fun — Vocabulário Temático',
			description:
				'Treinar o vocabulário sobre um tema escolhido. Cada ronda apresenta um puzzle de três painéis com: vídeo do gesto em LGP, imagem ilustrativa e palavra escrita. Deve encontrar e recolher os painéis em falta para completar o puzzle.',
		},
		{
			number: 3,
			title: 'Letras em Falta',
			image: '/img/image-game-level3.png',
			alt: 'Nível 3 do LGP4Fun — Letras em Falta',
			description:
				'Treinar a escrita sobre um tema escolhido. Cada ronda apresenta um puzzle de três painéis com um elemento em falta: umas letras. Deve encontrar e recolher as letras em falta para completar o puzzle.',
		},
	];

	function updateActiveLevel() {
		if (attachedCarouselApi) {
			activeLevel = attachedCarouselApi.selectedScrollSnap();
		}
	}

	function handleCarouselKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			levelsCarouselApi?.scrollPrev();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			levelsCarouselApi?.scrollNext();
		}
	}

	$: if (levelsCarouselApi && levelsCarouselApi !== attachedCarouselApi) {
		attachedCarouselApi?.off('select', updateActiveLevel);
		attachedCarouselApi?.off('reInit', updateActiveLevel);
		attachedCarouselApi = levelsCarouselApi;
		updateActiveLevel();
		attachedCarouselApi.on('select', updateActiveLevel);
		attachedCarouselApi.on('reInit', updateActiveLevel);
	}

	onDestroy(() => {
		attachedCarouselApi?.off('select', updateActiveLevel);
		attachedCarouselApi?.off('reInit', updateActiveLevel);
	});
</script>

<MetaTags title="LGP4Fun" description="Aprende Língua Portuguesa e Língua Gestual Portuguesa" />

<main class="pb-20 text-foreground lg:pb-28">
	<header class="container mx-auto flex flex-col items-start justify-start pt-2">
		<h1
			class="relative z-10 mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl"
		>
			LGP4Fun
		</h1>
		<p class="mb-10 mt-1 leading-7">Aprende Língua Portuguesa e Língua Gestual Portuguesa.</p>
	</header>

	<!-- Introduction and primary action -->
	<section class="px-3 py-10 sm:px-5">
		<div
			class="mx-auto flex max-w-[1920px] flex-col items-center gap-10 overflow-hidden rounded-[32px] bg-brand-yellow/60 px-5 py-8 dark:border dark:border-brand-yellow dark:bg-transparent sm:px-8 sm:py-10 lg:flex-row lg:gap-32 lg:px-14 lg:py-12"
		>
			<div class="flex items-center justify-center lg:justify-end lg:pr-8">
				<img
					src="/img/lgp4fun-logo.png"
					alt="Logótipo LGP4Fun"
					class="h-auto w-64 drop-shadow-sm lg:w-96"
				/>
			</div>

			<div class="w-full text-center lg:text-left">
				<p class="text-base leading-7 sm:text-lg sm:leading-8">
					O <strong>LGP4Fun</strong> é um jogo interativo para <strong>dois jogadores</strong> do
					1.º Ciclo ou Pré-Escolar que promove a aprendizagem bilingue de
					<strong>Língua Gestual Portuguesa e Português</strong>
					através de 4 níveis progressivos. Ideal para salas de aula e momentos de prática lúdica.
				</p>

				<div class="pt-10">
					<Dialog>
						<DialogTrigger
							class="group mt-8 inline-flex h-12 items-center gap-5 rounded-2xl bg-brand-blue px-7 text-base font-bold text-brand-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
						>
							<Play class="h-5 w-5 fill-current" aria-hidden="true" />
							Jogar agora
						</DialogTrigger>
						<DialogContent
							class="w-[calc(100vw-2rem)] max-w-[1280px] border-0 bg-transparent p-0 shadow-none"
						>
							<div
								class="relative mx-auto aspect-video w-full overflow-hidden border-2 border-slate-800 bg-black"
							>
								<iframe
									bind:this={iframeRef}
									src="/game/index.html"
									title="LGP4Fun"
									height="720"
									width="1280"
									class="h-full w-full"
									on:load={() => {
										gameLoaded = true;
									}}
								/>
								{#if !gameLoaded}
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/70 text-white"
									>
										A carregar jogo…
									</div>
								{/if}
							</div>
						</DialogContent>
					</Dialog>
					<p
						class="pt-2 pl-2 flex items-center justify-center gap-2 text-sm font-medium text-red-500 lg:justify-start"
					>
						<Keyboard class="h-4 w-4 text-red-500" aria-hidden="true" />
						Requer um teclado.
					</p>
				</div>
		</div>
	</section>

	<!-- Levels -->
	<section class="container mx-auto pt-20 lg:pt-28" aria-labelledby="levels-title">
		<div class="relative max-w-2xl">
			<img
				src="/branding/curve-yellow.svg"
				alt=""
				aria-hidden="true"
				class="absolute -top-10 h-12 w-12"
			/>
			<h2
				id="levels-title"
				class="text-3xl font-bold leading-none text-brand-dark dark:text-foreground"
			>
				Descobre os níveis do jogo
			</h2>
			<p class="mb-10 mt-1 leading-7">
				Cada nível acrescenta um novo desafio para aprender ao ritmo de cada criança.
			</p>
		</div>

		<Carousel.Root
			bind:api={levelsCarouselApi}
			opts={{
				align: 'center',
				loop: true,
				skipSnaps: false,
			}}
			class="mt-10"
			aria-label="Níveis do jogo"
		>
			<Carousel.Content class="-ml-4 items-stretch sm:-ml-6">
				{#each levels as level, index}
					<Carousel.Item
						class="pl-4 sm:pl-6"
						style="flex-basis: min(100%, 624px); max-width: 624px;"
						aria-label={`Nível ${level.number}: ${level.title}`}
					>
						<div
							class:scale-100={activeLevel === index}
							class:opacity-100={activeLevel === index}
							class:scale-95={activeLevel !== index}
							class:opacity-70={activeLevel !== index}
							class="mx-auto h-full w-full transition duration-300 ease-out motion-reduce:transition-none"
							style="max-width: 600px;"
						>
							<article
								class="group h-full overflow-hidden rounded-2xl border border-brand-border bg-brand-white shadow-sm transition duration-200 hover:shadow-md motion-reduce:transition-none dark:bg-brand-surface"
							>
								<div class="overflow-hidden bg-brand-border/30">
									<img
										src={level.image}
										alt={level.alt}
										class="aspect-video h-auto w-full object-cover transition duration-300 group-hover:scale-[1.015] motion-reduce:transition-none"
										loading="lazy"
									/>
								</div>

								<div class="p-5 sm:p-6">
									<h3 class="text-xl font-bold leading-tight text-brand-dark dark:text-foreground">
										Nível {level.number} – {level.title}
									</h3>
									<p class="mt-4 leading-7 text-muted-foreground">{level.description}</p>
								</div>
							</article>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>

			<button
				type="button"
				class="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-white text-brand-blue shadow-sm transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 sm:left-4"
				aria-label="Nível anterior"
				on:click={() => levelsCarouselApi?.scrollPrev()}
				on:keydown={handleCarouselKeydown}
			>
				<ChevronLeft class="h-5 w-5" aria-hidden="true" />
			</button>
			<button
				type="button"
				class="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-white text-brand-blue shadow-sm transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 sm:right-4"
				aria-label="Nível seguinte"
				on:click={() => levelsCarouselApi?.scrollNext()}
				on:keydown={handleCarouselKeydown}
			>
				<ChevronRight class="h-5 w-5" aria-hidden="true" />
			</button>

			<div class="mt-6 flex items-center justify-center gap-2" aria-label="Selecionar nível">
				{#each levels as level, index}
					<button
						type="button"
						class="h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 motion-reduce:transition-none {activeLevel ===
						index
							? 'w-8 bg-brand-blue'
							: 'w-2.5 bg-brand-border hover:bg-brand-blue/60'}"
						aria-label={`Mostrar nível ${level.number}`}
						aria-current={activeLevel === index ? 'true' : undefined}
						on:click={() => levelsCarouselApi?.scrollTo(index)}
					></button>
				{/each}
			</div>
		</Carousel.Root>
	</section>
</main>
