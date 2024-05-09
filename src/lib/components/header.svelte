<script lang="ts">
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import MainNav from '$lib/components/nav/main-nav.svelte';
	import MobileNav from '$lib/components/nav/mobile-nav.svelte';
	import UserNav from '$lib/components/nav/user-nav.svelte';
	import type { UserProfile, UserRole } from '@/types/types';
	import { Button } from './ui/button';

	export let role: UserRole | null;
	export let profile: UserProfile | null;
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 items-center">
		<MainNav />
		<MobileNav />
		<div class="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
			<ModeToggle />
			{#if profile && role}
				<UserNav {role} {profile} />
			{:else}
				<Button variant="outline" size="sm" href="/sign-in">Login</Button>
				<Button size="sm" href="/sign-up">Join</Button>
			{/if}
		</div>
	</div>
</header>
