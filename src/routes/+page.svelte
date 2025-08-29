<script lang="ts">
	import Logo from '@/components/logo.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import Button from '@/components/ui/button/button.svelte';

	export let data;
	$: ({ branding } = data);

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}
</script>

<MetaTags title={branding.name} description={branding.slogan} />

<div class="container mx-auto mb-20 mt-20 flex flex-col items-start justify-start md:mt-40">
	<div class="flex">
		<div class="flex flex-col">
			<h1 class="mb-4 text-start text-6xl font-bold md:text-8xl">{branding.name}</h1>
			<p class="mb-4 text-start text-xl text-muted-foreground md:text-3xl">{branding.slogan}</p>
			<p class="text-md md:text-l mb-4 text-start text-primary">
				Bem vindo ao DCLGP, o Dicionário Online de Língua Gestual Portuguesa com mais de duas mil
				entradas.
			</p>
			<div class="mb-[300px] flex flex-col gap-4 md:flex-row md:gap-6">
				<Button
					on:click={() => scrollToSection('dictionary')}
					class="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-all hover:gap-3 hover:bg-primary/90"
				>
					<span>Dicionário Geral</span>
					<svg
						class="h-4 w-4 transition-transform group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Button>

				<Button
					on:click={() => scrollToSection('fcdictionary')}
					class="group flex items-center gap-2 rounded-lg border border-primary bg-primary-foreground px-6 py-3 text-primary transition-all hover:gap-3 hover:bg-primary hover:text-white"
				>
					<span>Primeiro Ciclo</span>
					<svg
						class="h-4 w-4 transition-transform group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Button>

				<Button
					on:click={() => scrollToSection('lgp4fun')}
					class="group flex items-center gap-2 rounded-lg border border-muted-foreground bg-primary-foreground px-6 py-3 text-muted-foreground transition-all hover:gap-3 hover:bg-muted-foreground hover:text-white"
				>
					<span>LGP4Fun</span>
					<svg
						class="h-4 w-4 transition-transform group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Button>
				<Button
					on:click={() => scrollToSection('crowdsource')}
					class="group flex items-center gap-2 rounded-lg border border-muted-foreground bg-primary-foreground px-6 py-3 text-muted-foreground transition-all hover:gap-3 hover:bg-muted-foreground hover:text-white"
				>
					<span>Participação em Comunidade</span>
					<svg
						class="h-4 w-4 transition-transform group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Button>
			</div>
		</div>

		{#if branding.logo}
			<Logo class="h-32 w-32 md:h-48 md:w-48" logoUrl={branding.logo} />
		{:else}
			<div class="h-32 w-32 rounded-full bg-primary md:ml-72 md:h-48 md:w-48"></div>
		{/if}
	</div>

	<div class="flex">
		<div class="flex flex-col">
			<h1 id="dictionary" class="mb-4 text-start text-3xl font-bold text-primary md:text-5xl">
				Dicionário Geral
			</h1>
			<p class="text-md md:text-l mb-4 text-start text-muted-foreground">
				Com mais de duas mil entradas anotadas, este Dicionário tem um motor de pesquisa por Gesto
				unico, sendo possível pesquisar um gesto por texto ou pelas suas características:
				Configuração da mão, Localização, Orientação, Movimento e Expressão Facial.
			</p>
		</div>
		<img
			class="h-12 w-auto rounded-2xl object-fill md:h-[300px] md:w-auto"
			src="/img/dictionary.png"
		/>
	</div>
</div>

<div
	id="fcdictionary"
	class="container mx-auto mb-20 mt-20 flex flex-col items-end justify-end md:mt-40"
>
	<div class="flex">
		<img
			class="h-12 w-auto rounded-2xl object-fill md:h-[300px] md:w-auto"
			src="/img/fcdictionary.png"
		/>
		<div class="flex flex-col">
			<h1 class="mb-4 text-end text-3xl font-bold text-primary md:text-5xl">
				Dicionário de Primeiro Ciclo
			</h1>
			<p class="text-md md:text-l mb-4 text-wrap text-end text-muted-foreground">
				O Dicionário de Primeiro Ciclo é um recurso ideal para a aprendizagem bilingue de primeiro
				Ciclo LGP-Português, tendo também um motor de pesquisa por Gesto unico, sendo possível
				pesquisar um gesto por texto, ou pelas suas características: Configuração da mão,
				Localização, Orientação, Movimento e Expressão Facial.
			</p>
		</div>
	</div>

	<div
		id="lgp4fun"
		class="container mx-auto mb-20 mt-20 flex flex-col items-start justify-start md:mt-40"
	>
		<div class="flex">
			<div class="flex flex-col items-start justify-start">
				<h1 class="mb-4 text-start text-3xl font-bold text-primary md:text-5xl">LGP4Fun</h1>
				<p class="text-md md:text-l mb-4 text-start text-muted-foreground">
					O LGP4Fun é um jogo interativo de primeiro ciclo, para dois jogadores,
					com o objetivo de aprendizagem bilingue LGP-Português,
					com 4 níveis divertidíssimos! Ideal para as salas de aula!
				</p>
			</div>
			<img
				class="h-12 w-auto rounded-2xl object-fill md:h-[300px] md:w-auto"
				src="/img/lgp4fun.png"
			/>
		</div>
	</div>

	<div
		id="crowdsource"
		class="container mx-auto mb-20 mt-20 flex flex-col items-end justify-end md:mt-40"
	>
		<div class="flex">
			<img
				class="h-12 w-auto rounded-2xl object-fill md:h-[300px] md:w-auto"
				src="img/crowdsource.png"
			/>
			<div class="flex-col">
				<h1 class="mb-4 text-end text-3xl font-bold text-primary md:text-5xl">
					Participação em Comunidade
				</h1>
				<p class="text-md md:text-l mb-4 text-end text-muted-foreground">
					Participe na discussão de novos termos para o Dicionário. Simplesmente grave o seu vídeo a
					partir da sua webcam ou câmara do telemóvel, comente outras propostas via texto ou vídeo e
					vote em novos termos.
				</p>
			</div>
		</div>
	</div>
</div>
