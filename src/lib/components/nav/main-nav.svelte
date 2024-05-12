<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@/utils';
	import FeatureWrapper from '../feature-wrapper.svelte';
</script>

<div class="mr-4 hidden md:flex">
	<a href="/" class="mr-6 flex items-center gap-x-2">
		<div class="h-4 w-4 rounded-full bg-foreground"></div>
		<span class="font-bold"> community </span>
	</a>
	<nav class="flex items-center space-x-6 text-sm font-medium">
		<FeatureWrapper feature="academy">
			<a
				href="/academy"
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname.startsWith('/academy') ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				Academy
			</a>
		</FeatureWrapper>
		<FeatureWrapper feature="howtos">
			<a
				href="/how-to"
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
	</nav>
</div>
