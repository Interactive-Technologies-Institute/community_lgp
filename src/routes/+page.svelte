<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { mode } from 'mode-watcher';
	export let data;
	$: ({ branding } = data);
</script>

<MetaTags title={branding.name} description={branding.slogan} />

<main class="bg-background text-foreground">
	<section class="px-3 pt-3 sm:px-5 sm:pt-5">
		<div
			class="relative mx-auto flex h-screen w-full max-w-[1920px] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-brand-surface px-6 py-16 text-center sm:px-10"
		>
			<img
				src={$mode === 'dark' ? '/branding/logo-light.svg' : '/branding/logo-dark.svg'}
				alt="Dicionário LGP"
				class="relative z-10 w-full max-w-[760px]"
			/>
			<h1 class="relative z-10 mt-7 text-2xl font-extrabold text-brand-dark dark:text-foreground md:text-3xl">
				O Dicionário Online de Língua Gestual Portuguesa
			</h1>
			<p
				class="relative z-10 mt-5 max-w-3xl text-base font-semibold leading-7 text-foreground md:text-lg"
			>
				Descubra, aprenda e partilhe a Língua Gestual Portuguesa através de recursos digitais
				acessíveis, educativos e colaborativos.
			</p>
			<div class="relative z-10 mt-16 sm:mt-20">
				<img
					src="branding/spark-yellow.svg"
					alt="Spark Yellow"
					class="absolute -left-10 -top-6 h-12"
				/>
				<a
					href="#dictionary"
					class="group inline-flex h-12 items-center gap-6 rounded-2xl bg-brand-dark px-7 text-base font-bold text-brand-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-dark/90 hover:shadow-md"
				>
					Explorar
					<ArrowRight
						class="h-5 w-5 text-brand-yellow transition-transform"
					/>
				</a>
			</div>
			<img
				src="/img/flag-character.svg"
				alt=""
				aria-hidden="true"
				class="pointer-events-none absolute bottom-0 right-4 hidden h-32 w-auto select-none md:block lg:right-20 lg:h-48 xl:right-28 xl:h-64"
			/>
		</div>
	</section>

	<section
		id="dictionary"
		class="mx-auto grid max-w-[1920px] scroll-mt-24 items-center gap-10 px-7 py-20 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-28"
	>
		<div class="max-w-xl">
			<h2 class="text-2xl font-black text-brand-dark dark:text-foreground md:text-3xl">Dicionário Geral</h2>
			<p class="mt-8 text-base leading-7 text-foreground md:text-lg">
				Com mais de <strong>2000 entradas</strong> anotadas, este Dicionário tem um motor de
				pesquisa
				<strong>único</strong>, sendo possível pesquisar um gesto por <strong>texto</strong> ou
				pelos seus
				<strong>parâmetros</strong>: Configuração, Localização, Orientação, Movimento e Expressão
				Facial.
			</p>
			<a class="group inline-flex h-11 w-50 items-center gap-6 rounded-2xl bg-brand-blue px-7 mt-7 text-base font-bold text-brand-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 hover:shadow-md" href="/dictionary">
				Dicionário Geral
				<ArrowRight class="h-5 w-5 text-brand-yellow transition-transform" />
			</a>
		</div>
		<div class="overflow-hidden rounded-xl bg-muted shadow-md">
			<img
				src="/img/dictionary.png"
				alt="Pesquisa por gesto no Dicionário Geral"
				class="aspect-auto h-auto w-full"
				loading="lazy"
			/>
		</div>
	</section>

	<section class="px-3 sm:px-5">
		<div
			class="mx-auto max-w-[1920px] space-y-14 rounded-[32px] bg-brand-yellow/60 dark:bg-transparent dark:border dark:border-brand-yellow px-5 py-8 sm:px-8 sm:py-10 lg:space-y-16"
		>
			<div class="grid items-center gap-9 lg:grid-cols-2 lg:gap-20">
				<div class="overflow-hidden rounded-xl bg-muted shadow-md">
					<img
					src="/img/fcdictionary.png"
					alt="Entrada do Dicionário do 1º Ciclo"
					class="aspect-auto h-auto w-full"
					loading="lazy"
					/>
				</div>
				<div class="order-1 text-left lg:order-2 lg:text-right">
					<h2 class="text-2xl font-black text-brand-dark dark:text-brand-yellow md:text-3xl">Dicionário 1º Ciclo</h2>
					<p class="mt-8 text-base leading-7 text-foreground md:text-lg">
						Um recurso pensado para a aprendizagem bilingue LGP-Português no 1º Ciclo. Pesquise por
						texto ou através dos seus parâmetros.
					</p>
					<a class="group inline-flex h-11 w-50 items-center gap-6 rounded-2xl bg-brand-blue px-7 mt-7 text-base font-bold text-brand-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 hover:shadow-md" href="/fcdictionary">
						Dicionário 1º Ciclo
						<ArrowRight class="h-5 w-5 text-brand-yellow transition-transform" />
					</a>
				</div>
			</div>

			<div class="grid items-center gap-9 lg:grid-cols-2 lg:gap-20">
				<div>
					<h2 class="text-2xl font-black text-brand-dark dark:text-brand-yellow md:text-3xl">LGP4Fun</h2>
					<p class="mt-8 text-base leading-7 text-foreground md:text-lg">
						Um jogo interativo para dois jogadores, com quatro níveis progressivos para aprender
						Língua Gestual Portuguesa e Português de forma divertida.
					</p>
					<a class="group inline-flex h-11 w-50 items-center gap-6 rounded-2xl bg-brand-blue px-7 mt-7 text-base font-bold text-brand-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 hover:shadow-md" href="/lgp4fun">
						LGP4Fun
						<ArrowRight class="h-5 w-5 text-brand-yellow transition-transform" />
					</a>
				</div>
				<div class="overflow-hidden rounded-xl bg-muted shadow-md">
					<img
						src="/img/lgp4fun.png"
						alt="Jogo educativo LGP4Fun"
						class="aspect-auto h-auto w-full"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	</section>

	<section
		class="mx-auto grid max-w-[1920px] items-center gap-10 px-7 py-20 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-28"
	>
		<div class="overflow-hidden rounded-xl bg-muted shadow-md">
			<img
				src="/img/crowdsource.png"
				alt="Proposta de uma nova entrada de gesto"
				class="aspect-auto h-auto w-full"
				loading="lazy"
			/>
		</div>
		<div class="text-left lg:text-right">
			<h2 class="text-2xl font-black text-brand-dark dark:text-foreground md:text-3xl">Propor Gestos</h2>
			<p class="mt-8 text-base leading-7 text-foreground md:text-lg">
				A comunidade faz o Dicionário crescer! Proponha novos termos e participe nas discussões,
				comentando e votando nas propostas.
			</p>
			<a class="group inline-flex h-11 w-50 items-center gap-6 rounded-2xl bg-brand-blue px-7 mt-7 text-base font-bold text-brand-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue/90 hover:shadow-md" href="/crowdsource">
				Propor Gestos
				<ArrowRight class="h-5 w-5 text-brand-yellow transition-transform" />
			</a>
		</div>
	</section>
</main>
