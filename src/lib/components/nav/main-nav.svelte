<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@/utils';
	import FeatureWrapper from '../feature-wrapper.svelte';
	import type { UserProfile, UserRole } from '@/types/types';
	import Separator from '../ui/separator/separator.svelte';

	export let role: UserRole;
</script>

<div class="mr-4 hidden md:flex">
	<a href="/" class="mr-6 flex items-center gap-x-2">
		<div class="h-4 w-4 rounded-full bg-primary"></div>
		<span class="font-bold"> {$page.data.branding.name} </span>
	</a>
	<nav class="flex items-center space-x-6 text-sm font-medium">
		<FeatureWrapper feature="docs">
			<a
				href="/docs"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/academy') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Academy
			</a>
		</FeatureWrapper>
		<FeatureWrapper feature="guides">
			<a
				href="guides"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/how-to') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				How To
			</a>
		</FeatureWrapper>
		<FeatureWrapper feature="events">
			<a
				href="/events"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/events') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Events
			</a>
		</FeatureWrapper>
		<FeatureWrapper feature="map">
			<a
				href="/map"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/map') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Map
			</a>
		</FeatureWrapper>
		{#if role === 'admin' || role === 'moderator'}
			<FeatureWrapper feature="annotate">
				<a
					href="/annotate"
					class={cn(
						'transition-colors hover:text-foreground/80',
						$page.url.pathname.startsWith('/annotate') ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					Anotação
				</a>
			</FeatureWrapper>
		{/if}
		
		<FeatureWrapper feature="dictionary">
			<a
				href="/dictionary"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/dictionary') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Dicionário Geral
			</a>
		</FeatureWrapper>
		<FeatureWrapper feature="crowdsource">
			<a
				href="/crowdsource"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/crowdsource') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Participar
			</a>
		</FeatureWrapper>
		<Separator class="mx-2" orientation="vertical" />

		<FeatureWrapper feature="fcdictionary">
			<a
				href="/fcdictionary"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/fcdictionary') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Dicionário 1º Ciclo
			</a>
		</FeatureWrapper>

		<FeatureWrapper feature="lgp4fun">
			<a
				href="/lgp4fun"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/lgp4fun') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				LGP4Fun
			</a>
		</FeatureWrapper>
	</nav>
</div>
