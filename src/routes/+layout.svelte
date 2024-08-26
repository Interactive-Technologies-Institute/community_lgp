<script lang="ts">
	import { dev } from '$app/environment';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Footer from '@/components/footer.svelte';
	import Header from '@/components/header.svelte';
	import NavigatingIndicator from '@/components/navigating-indicator.svelte';
	import TailwindIndicator from '@/components/tailwind-indicator.svelte';
	import { Toaster } from '@/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.css';
	import '../themes.css';

	export let data;

	$: ({ supabase, session, user, profile, branding } = data);

	const flash = getFlash(page);
	$: if ($flash) {
		if ($flash.type === 'error') {
			toast.error($flash.message);
		} else {
			toast.success($flash.message);
		}
		// Clear the flash message to avoid double-toasting.
		$flash = undefined;
	}

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:body class="theme-{branding.color_theme}" style="--radius: {branding.radius}rem" />

<ModeWatcher />
<Toaster />

<div class="relative flex min-h-screen flex-col">
	<Header role={user?.role ?? null} {profile} />
	<div class="flex-1">
		<slot />
	</div>
	<Footer />
	{#if dev}
		<TailwindIndicator />
		<NavigatingIndicator />
	{/if}
</div>
