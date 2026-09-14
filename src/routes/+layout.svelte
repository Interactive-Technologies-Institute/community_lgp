<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Footer from '@/components/footer.svelte';
	import Header from '@/components/header.svelte';
	import NavigatingIndicator from '@/components/navigating-indicator.svelte';
	import TailwindIndicator from '@/components/tailwind-indicator.svelte';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { Toaster } from '@/components/ui/sonner';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.css';
	import '../themes.css';
	dayjs.extend(relativeTime);

	export let data;

	$: ({ supabase, session, user, profile, notifications, branding } = data);

	const flash = getFlash(page);
	let unlockedMilestone: { label: string; value: number } | null = null;
	$: if ($flash) {
		if ($flash.type === 'error') {
			toast.error($flash.message);
		} else {
			toast.success($flash.message);
		}
		if ($flash.milestone) {
			unlockedMilestone = $flash.milestone;
		}
		// Clear the flash message to avoid double-toasting.
		$flash = undefined;
	}

	onMount(() => {
		if (data.maintenance || !supabase) return;

		const { data: authState } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authState.subscription.unsubscribe();
	});
</script>

<svelte:body class="theme-{branding.color_theme}" style="--radius: {branding.radius}rem" />

<ModeWatcher />
<Toaster />

{#if data.maintenance}
	<slot />
{:else}
	<div class="relative flex min-h-screen flex-col">
		{#if $page.url.pathname === '/reset-password' || $page.url.pathname === '/accept-invite'}
			<div class="flex-1">
				<slot />
			</div>
			<Footer />
		{:else}
			<Header role={user?.role ?? null} {profile} {notifications} />
			<div class="flex-1">
				<slot />
			</div>
			<Footer />
		{/if}
		{#if dev}
			<TailwindIndicator />
			<NavigatingIndicator />
		{/if}
	</div>
{/if}

<Dialog.Root
	open={unlockedMilestone !== null}
	onOpenChange={(open) => !open && (unlockedMilestone = null)}
>
	<Dialog.Content class="text-center sm:max-w-sm">
		<Dialog.Header class="items-center">
			{#if unlockedMilestone}
				<img
					src="/img/badges/{unlockedMilestone.value}.png"
					alt={unlockedMilestone.label}
					class="h-48 w-48 object-contain"
				/>
			{/if}
			<Dialog.Title class="text-2xl">Marco Desbloqueado!</Dialog.Title>
			<Dialog.Description class="text-lg font-semibold text-foreground">
				"{unlockedMilestone?.label}"
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="sm:justify-center">
			<Button on:click={() => (unlockedMilestone = null)}>Continuar</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
