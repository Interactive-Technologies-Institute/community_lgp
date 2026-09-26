<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Tooltip from '@/components/ui/tooltip';
	import { onMount } from 'svelte';
	import { Check, Copy, Facebook, MessageCircle, Share2, Twitter, UserPlus } from 'lucide-svelte';

	const FORM_URL =
		'https://docs.google.com/forms/d/e/1FAIpQLScYYrls0JA4EGpJQGQVdLS0266muMDj8XfWnQqV0DCY_VYu6A/viewform?usp=header';
	const DICTIONARY_URL = 'https://dclgp.dcitizens.eu/';
	const SHARE_TITLE = 'Dicionário LGP';
	const SHARE_TEXT = `Estou a ajudar a melhorar o Dicionário LGP (${DICTIONARY_URL}) para construir uma ferramenta de pesquisa por vídeo de gestos. É muito fácil, basta registares-te e começares a gravar vídeos! Vem ajudar também, inscreve-te aqui:`;

	let canNativeShare = false;
	let copied = false;

	onMount(() => {
		canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
	});

	async function nativeShare() {
		try {
			await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: FORM_URL });
		} catch {
			// Person cancelled the native share sheet, nothing to do.
		}
	}

	async function copyLink() {
		await navigator.clipboard.writeText(FORM_URL);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const socialLinks = [
		{
			label: 'Partilhar no WhatsApp',
			icon: MessageCircle,
			href: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${FORM_URL}`)}`,
		},
		{
			label: 'Partilhar no Facebook',
			icon: Facebook,
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(FORM_URL)}`,
		},
		{
			label: 'Partilhar no X',
			icon: Twitter,
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(FORM_URL)}`,
		},
	];
</script>

<div class="rounded-2xl border border-brand-blue/70 bg-brand-blue/30 p-5">
	<div class="flex items-start gap-3">
		<div class="rounded-full bg-brand-blue/10 p-2 text-brand-blue">
			<UserPlus class="h-5 w-5" />
		</div>
		<div>
			<p class="font-semibold text-brand-dark">Conhece alguém que possa ajudar?</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Partilhe o formulário de inscrição.
			</p>
		</div>
	</div>

	<div class="mt-4 flex flex-wrap items-center gap-2">
		{#if canNativeShare}
			<Button
				on:click={nativeShare}
				class="gap-2 bg-brand-blue text-brand-white hover:bg-brand-blue/90"
			>
				<Share2 class="h-4 w-4" />
				Partilhar convite
			</Button>
		{:else}
			{#each socialLinks as social (social.label)}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							variant="outline"
							size="icon"
							aria-label={social.label}
						>
							<svelte:component this={social.icon} class="h-4 w-4" />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>{social.label}</Tooltip.Content>
				</Tooltip.Root>
			{/each}
			<Tooltip.Root openDelay={0}>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						on:click={copyLink}
						variant="outline"
						size="icon"
						aria-label="Copiar link do formulário"
					>
						{#if copied}
							<Check class="h-4 w-4" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					{copied ? 'Link copiado!' : 'Copiar link do formulário'}
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	</div>
</div>
