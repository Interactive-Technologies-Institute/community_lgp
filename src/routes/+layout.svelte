<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Footer from '@/components/footer.svelte';
	import Header from '@/components/header.svelte';
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
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:body
	class="theme-{$page.data.branding.color_theme}"
	style="--radius: {$page.data.branding.radius}rem"
/>

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
	{/if}
</div>
