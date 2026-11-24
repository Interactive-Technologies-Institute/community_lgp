<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { EllipsisVertical, Share, SquarePlus, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	// Chrome/Edge/Samsung Internet fire this when the site can be installed natively.
	type BeforeInstallPromptEvent = Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	};

	const DISMISS_KEY = 'install-prompt-dismissed-at';
	const DISMISS_DAYS = 14;
	const SHOW_DELAY_MS = 2500;

	// 'ios': Safari / other iOS browsers → manual "Share → Add to Home Screen".
	// 'ios-inapp': Instagram/Facebook/LinkedIn in-app browser → must open in Safari first.
	// 'android-native': we can trigger the browser's own install dialog.
	// 'android-manual': no native prompt available → manual menu instructions.
	let platform: 'ios' | 'ios-inapp' | 'android-native' | 'android-manual' | null = null;
	let visible = false;
	let deferredPrompt: BeforeInstallPromptEvent | null = null;

	function isStandalone() {
		return (
			window.matchMedia('(display-mode: standalone)').matches ||
			(navigator as Navigator & { standalone?: boolean }).standalone === true
		);
	}

	function recentlyDismissed() {
		try {
			const at = Number(localStorage.getItem(DISMISS_KEY));
			return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
		} catch {
			return false;
		}
	}

	function dismiss() {
		visible = false;
		try {
			localStorage.setItem(DISMISS_KEY, String(Date.now()));
		} catch {
			// Storage unavailable (e.g. private mode): just hide for this visit.
		}
	}

	async function install() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		deferredPrompt = null;
		if (outcome === 'accepted') visible = false;
		else dismiss();
	}

	onMount(() => {
		if (isStandalone() || recentlyDismissed()) return;

		const ua = navigator.userAgent;
		const isIOS =
			/iPhone|iPad|iPod/.test(ua) ||
			// iPadOS reports itself as a Mac.
			(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
		const isAndroid = /Android/.test(ua);
		if (!isIOS && !isAndroid) return;

		const onBeforeInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
			platform = 'android-native';
		};
		const onInstalled = () => (visible = false);
		window.addEventListener('beforeinstallprompt', onBeforeInstall);
		window.addEventListener('appinstalled', onInstalled);

		// Delay so it doesn't cover the page on first paint, and so Android has
		// time to fire `beforeinstallprompt` before we fall back to manual steps.
		const timer = setTimeout(() => {
			if (isIOS) {
				platform = /FBAN|FBAV|Instagram|LinkedInApp/.test(ua) ? 'ios-inapp' : 'ios';
			} else if (!platform) {
				platform = 'android-manual';
			}
			visible = true;
		}, SHOW_DELAY_MS);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('beforeinstallprompt', onBeforeInstall);
			window.removeEventListener('appinstalled', onInstalled);
		};
	});
</script>

{#if visible && platform}
	<div
		class="fixed inset-x-0 bottom-0 z-50 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
		transition:fly={{ y: 100, duration: 250 }}
	>
		<div
			class="mx-auto flex max-w-md items-start gap-3 rounded-lg border bg-background p-4 shadow-lg"
			role="dialog"
			aria-labelledby="install-prompt-title"
		>
			<img src="/apple-touch-icon.png" alt="" class="size-12 shrink-0 rounded-xl border" />
			<div class="min-w-0 flex-1 text-sm">
				<p id="install-prompt-title" class="font-semibold">Instala o Dicionário LGP</p>
				{#if platform === 'android-native'}
					<p class="mt-1 text-muted-foreground">
						Acede ao dicionário diretamente a partir do ecrã principal, em ecrã inteiro.
					</p>
					<Button size="sm" class="mt-3" on:click={install}>Instalar</Button>
				{:else if platform === 'ios'}
					<p class="mt-1 text-muted-foreground">Adiciona-o ao ecrã principal:</p>
					<ol class="mt-2 space-y-1.5">
						<li class="flex items-center gap-1.5">
							1. Toca em
							<Share class="size-4 shrink-0 text-[#007AFF]" aria-label="Partilhar" />
							<span class="font-medium">Partilhar</span>
						</li>
						<li class="text-xs text-muted-foreground">
							(se não o vires, está no menu <span class="font-medium">⋯</span>)
						</li>
						<li class="flex items-center gap-1.5">
							2. Escolhe
							<SquarePlus class="size-4 shrink-0" aria-hidden="true" />
							<span class="font-medium">Adicionar ao ecrã principal</span>
						</li>
					</ol>
				{:else if platform === 'ios-inapp'}
					<p class="mt-1 text-muted-foreground">
						Para o adicionar ao ecrã principal, abre esta página no
						<span class="font-medium text-foreground">Safari</span> (menu
						<span class="font-medium">⋯</span> → “Abrir no browser”).
					</p>
				{:else}
					<p class="mt-1 text-muted-foreground">Adiciona-o ao ecrã principal:</p>
					<ol class="mt-2 space-y-1.5">
						<li class="flex items-center gap-1.5">
							1. Toca no menu
							<EllipsisVertical class="size-4 shrink-0" aria-label="menu" />
						</li>
						<li>
							2. Escolhe <span class="font-medium">Instalar app</span> ou
							<span class="font-medium">Adicionar ao ecrã principal</span>
						</li>
					</ol>
				{/if}
			</div>
			<Button
				variant="ghost"
				size="icon-sm"
				class="-mr-2 -mt-2 shrink-0"
				aria-label="Fechar"
				on:click={dismiss}
			>
				<X class="size-4" />
			</Button>
		</div>
	</div>
{/if}
