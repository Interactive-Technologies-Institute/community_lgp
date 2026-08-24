<script lang="ts">
	import { Wrench } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { mode } from 'mode-watcher';
</script>

<MetaTags
	title="Em manutenção | Dicionário LGP"
	description="Estamos a realizar melhorias na plataforma. Voltaremos em breve."
/>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="min-h-screen bg-background px-3 py-3 text-foreground sm:px-5 sm:py-5">
	<section
		class="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1920px] flex-col overflow-hidden rounded-[32px] bg-brand-surface px-6 py-6 dark:border dark:border-brand-blue/40 dark:bg-background sm:min-h-[calc(100vh-2.5rem)] sm:px-10"
	>
		<div class="flex flex-1 items-center justify-center py-5 text-center">
			<div class="max-w-2xl">
				<div
					class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-yellow text-brand-dark shadow-sm sm:h-24 sm:w-24"
				>
					<Wrench class="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={2.25} />
				</div>

				<h1
					class="mt-7 text-3xl font-black leading-tight text-brand-dark dark:text-foreground sm:text-4xl lg:text-5xl"
				>
					Estamos a melhorar a plataforma
				</h1>
				<p class="mx-auto mt-6 max-w-xl text-base font-semibold leading-7 sm:text-lg sm:leading-8">
					O Dicionário LGP encontra-se temporariamente em manutenção. Estamos a realizar algumas
					melhorias e voltaremos em breve.
				</p>
				<p class="mx-auto mt-6 max-w-xl text-base font-semibold leading-7 sm:text-lg sm:leading-8">
					Obrigado pela compreensão
				</p>
			</div>
		</div>

		<div class="flex items-center justify-center">
			<img
				src={$mode === 'dark' ? '/branding/logo-light.svg' : '/branding/logo-dark.svg'}
				alt="Dicionário LGP"
				class="w-34 sm:w-40"
			/>
		</div>
	</section>
</main>
