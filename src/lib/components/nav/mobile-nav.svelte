<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '@/utils';
	import { Menu } from 'lucide-svelte';
	import FeatureWrapper from '../feature-wrapper.svelte';
	import { Button } from '../ui/button';
	import { ScrollArea } from '../ui/scroll-area';
	import * as Sheet from '../ui/sheet';
	import type { UserProfile, UserRole } from '@/types/types';

	let open = false;
	export let role: UserRole;
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon" class="md:hidden">
			<Menu class="h-5 w-5" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="pr-0">
		<a href="/" on:click={() => (open = false)} class="mr-6 flex items-center gap-x-4">
			<div class="h-8 w-8 rounded-full bg-primary"></div>
			<span class="text-lg font-bold"> {$page.data.branding.name} </span>
		</a>
		<ScrollArea orientation="both" class="my-4 h-[calc(100vh-8rem)] pb-10">
			<nav class="flex flex-col items-start gap-y-4 font-medium">
				<FeatureWrapper feature="docs">
					<a
						href="/docs"
						on:click={() => (open = false)}
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
						href="/guides"
						on:click={() => (open = false)}
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
						on:click={() => (open = false)}
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
						on:click={() => (open = false)}
						class={cn(
							'transition-colors hover:text-foreground/80',
							$page.url.pathname.startsWith('/map') ? 'text-foreground' : 'text-foreground/60'
						)}
					>
						Map
					</a>
				</FeatureWrapper>
				<FeatureWrapper feature="dictionary">
					<a
						href="/dictionary"
						on:click={() => (open = false)}
						class={cn(
							'transition-colors hover:text-foreground/80',
							$page.url.pathname.startsWith('/dictionary')
								? 'text-foreground'
								: 'text-foreground/60'
						)}
					>
						Dicionário
					</a>
				</FeatureWrapper>
				<FeatureWrapper feature="fcdictionary">
					<a
						href="/fcdictionary"
						on:click={() => (open = false)}
						class={cn(
							'transition-colors hover:text-foreground/80',
							$page.url.pathname.startsWith('/dictionary')
								? 'text-foreground'
								: 'text-foreground/60'
						)}
					>
						Dicionário 1º Ciclo
					</a>
				</FeatureWrapper>
				{#if role === 'admin' || role === 'moderator'}
					<FeatureWrapper feature="annotate">
						<a
							href="/annotate"
							on:click={() => (open = false)}
							class={cn(
								'transition-colors hover:text-foreground/80',
								$page.url.pathname.startsWith('/dictionary')
									? 'text-foreground'
									: 'text-foreground/60'
							)}
						>
							Anotação
						</a>
					</FeatureWrapper>
				{/if}
			</nav>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
