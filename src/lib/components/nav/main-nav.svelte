<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@/utils';
	import FeatureWrapper from '../feature-wrapper.svelte';
	import type { UserRole } from '@/types/types';

	export let role: UserRole;

	const linkClass =
		'relative flex h-16 items-center whitespace-nowrap text-sm font-semibold text-brand-white/85 transition-colors hover:text-brand-white';
</script>

<div class="hidden min-w-0 items-center lg:flex">
	<a href="/" class="mr-7 flex shrink-0 items-center" aria-label="Dicionário LGP - Início">
		<img
			src="/branding/submark light.svg"
			alt="Dicionário LGP"
			class="h-11 w-[110px] object-contain"
		/>
	</a>

	<div class="mr-6 h-8 w-px shrink-0 bg-brand-blue"></div>

	<nav class="flex min-w-0 items-center gap-7">
		<FeatureWrapper feature="tutorial">
			<a
				href="/tutorial"
				class={cn(
					linkClass,
					$page.url.pathname.startsWith('/tutorial') &&
						'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
				)}
			>
				Como usar a plataforma
			</a>
			<div class="h-8 w-px shrink-0 bg-brand-blue"></div>
		</FeatureWrapper>

		<FeatureWrapper feature="map">
			<a
				href="/map"
				class={cn(
				linkClass,
				$page.url.pathname.startsWith('/map') &&
					'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
			)}
			>
				Mapa
			</a>
			<div class="h-8 w-px shrink-0 bg-brand-blue"></div>
		</FeatureWrapper>

		<FeatureWrapper feature="dictionary">
			<a
				href="/dictionary"
				class={cn(
					linkClass,
					$page.url.pathname.startsWith('/dictionary') &&
						'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
				)}
			>
				Dicionário Geral
			</a>
		</FeatureWrapper>

		{#if role === 'admin' || role === 'moderator'}
			<FeatureWrapper feature="annotate">
				<a
					href="/annotate"
					class={cn(
						linkClass,
						$page.url.pathname.startsWith('/annotate') &&
							'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
					)}
				>
					Anotação
				</a>
			</FeatureWrapper>
		{/if}

		<FeatureWrapper feature="crowdsource">
			<a
				href="/crowdsource"
				class={cn(
					linkClass,
					$page.url.pathname.startsWith('/crowdsource') &&
						'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
				)}
			>
				Gestos da Comunidade
			</a>
		</FeatureWrapper>

		<div class="h-8 w-px shrink-0 bg-brand-blue"></div>

		<FeatureWrapper feature="fcdictionary">
			<a
				href="/fcdictionary"
				class={cn(
					linkClass,
					$page.url.pathname.startsWith('/fcdictionary') &&
						'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
				)}
			>
				Dicionário 1º Ciclo
			</a>
		</FeatureWrapper>

		<FeatureWrapper feature="lgp4fun">
			<a
				href="/lgp4fun"
				class={cn(
					linkClass,
					$page.url.pathname.startsWith('/lgp4fun') &&
						'text-brand-white after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:rounded-t-full after:bg-brand-yellow'
				)}
			>
				LGP4Fun
			</a>
		</FeatureWrapper>
	</nav>
</div>
