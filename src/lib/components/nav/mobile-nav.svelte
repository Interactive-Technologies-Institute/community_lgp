<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import FeatureWrapper from '../feature-wrapper.svelte';
	import { Button } from '../ui/button';
	import { ScrollArea } from '../ui/scroll-area';
	import * as Sheet from '../ui/sheet';
	import type { UserRole } from '@/types/types';

	let open = false;
	export let role: UserRole;

	const closeMenu = () => (open = false);
</script>

<div class="flex items-center gap-3 lg:hidden">
	<Sheet.Root bind:open>
		<Sheet.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				size="icon"
				class="border border-brand-blue text-brand-white hover:bg-brand-white/10 hover:text-brand-white"
			>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Abrir menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="w-[310px] border-0 bg-brand-dark p-0 text-brand-white">
			<div class="border-b border-brand-white/15 px-6 py-5">
				<a href="/" on:click={closeMenu} aria-label="Dicionário LGP - Início">
					<img
						src="/branding/submark-light.svg"
						alt="Dicionário LGP"
						class="h-14 w-36 object-contain"
					/>
				</a>
			</div>
			<ScrollArea orientation="both" class="my-4 h-[calc(100vh-8rem)] pb-10">
				<nav class="flex flex-col px-6 py-5 text-base font-semibold">
					<FeatureWrapper feature="tutorial">
						<a href="/tutorial" on:click={closeMenu} class="py-4"> Como usar a plataforma </a>
						<div class="h-px w-full shrink-0 bg-brand-blue"></div>
					</FeatureWrapper>
					<FeatureWrapper feature="map">
						<a href="/map" on:click={closeMenu} class="py-4"> Mapa </a>
						<div class="h-px w-full shrink-0 bg-brand-blue"></div>
					</FeatureWrapper>
					<FeatureWrapper feature="dictionary">
						<a href="/dictionary" on:click={closeMenu} class="py-4"> Dicionário Geral </a>
					</FeatureWrapper>
					{#if role === 'admin' || role === 'moderator'}
						<FeatureWrapper feature="annotate">
							<a href="/annotate" on:click={closeMenu} class="py-4"> Anotação </a>
						</FeatureWrapper>
					{/if}
					<FeatureWrapper feature="crowdsource">
						<a href="/crowdsource" on:click={closeMenu} class="py-4"> Propor Gestos </a>
					</FeatureWrapper>
					<div class="h-px w-full shrink-0 bg-brand-blue"></div>
					<FeatureWrapper feature="fcdictionary">
						<a href="/fcdictionary" on:click={closeMenu} class="py-4"> Dicionário 1º Ciclo </a>
					</FeatureWrapper>
					<FeatureWrapper feature="lgp4fun">
						<a href="/lgp4fun" on:click={closeMenu} class="py-4"> LGP4Fun </a>
					</FeatureWrapper>
				</nav>
			</ScrollArea>
		</Sheet.Content>
	</Sheet.Root>

	<a href="/" class="flex items-center" aria-label="Dicionário LGP - Início">
		<img
			src="/branding/submark-light.svg"
			alt="Dicionário LGP"
			class="h-10 w-[100px] object-contain"
		/>
	</a>
</div>
