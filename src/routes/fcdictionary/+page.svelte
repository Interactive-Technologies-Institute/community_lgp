<script lang="ts">
	import DictionaryLayout from '@/components/dictionary/DictionaryLayout.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
</script>

<MetaTags
	title="Dicionário de 1º Ciclo"
	description="Página príncipal do dicionário de primeiro ciclo"
	openGraph={{
		title: 'Dicionário de 1º Ciclo',
		description: 'Página príncipal do dicionário de primeiro ciclo',
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: 'Dicionário de 1º Ciclo',
		description: 'Página príncipal do dicionário de primeiro ciclo',
	}}
/>

<div class="relative isolate overflow-hidden pb-[clamp(4rem, 7vw, 6.5rem)]">
	<img class="sky-background" src="/branding/sky.svg" alt="" aria-hidden="true" />
	<img class="grass-background" src="/branding/grass.svg" alt="" aria-hidden="true" />

	<div class="relative z-10">
		<div
			class="container mx-auto flex flex-auto flex-col items-start justify-start overflow-x-auto pt-2"
		>
			<h1 class="mt-5 text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">
				Dicionário 1º Ciclo
			</h1>
			<p class="mb-10 mt-1 leading-7 text-foreground">
				Pesquise um gesto através do seus parâmetros ou por texto.
			</p>
		</div>
		<DictionaryLayout {data} />
	</div>
</div>

<style>
	.first-cycle-page {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		padding-bottom: clamp(4rem, 7vw, 6.5rem);
	}

	.sky-background,
	.grass-background {
		position: absolute;
		left: 50%;
		z-index: -1;
		width: 100vw;
		max-width: none;
		transform: translateX(-50%);
		object-fit: cover;
		object-position: center top;
		pointer-events: none;
		user-select: none;
	}

	.sky-background {
		top: 0;
		height: clamp(28rem, 38vw, 34rem);
	}

	.grass-background {
		bottom: 0;
		height: clamp(7rem, 10vw, 9rem);
	}
</style>
