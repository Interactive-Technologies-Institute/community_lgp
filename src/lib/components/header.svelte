<script lang="ts">
	import ModeToggle from '@/components/mode-toggle.svelte';
	import MainNav from '@/components/nav/main-nav.svelte';
	import MobileNav from '@/components/nav/mobile-nav.svelte';
	import UserNav from '@/components/nav/user-nav.svelte';
	import type { Notification, UserProfile, UserRole } from '@/types/types';
	import NotificationsButton from './notifications-button.svelte';
	import { Button } from './ui/button';

	export let role: UserRole | null;
	export let profile: UserProfile | null;
	export let notifications: Notification[];
</script>

<header class="sticky top-0 z-50 w-full border-b-2 border-brand-blue bg-brand-dark shadow-md">
	<div class="mx-auto flex h-16 max-w-[1920px] items-center px-4 sm:px-6 lg:px-8">
		{#if profile && role}
			<MainNav {role} />
			<MobileNav {role} />
		{:else}
			<MainNav role={'user'} />
			<MobileNav role={'user'} />
		{/if}
		<div class="ml-auto flex items-center gap-x-2 sm:gap-x-4 md:justify-end">
			<!-- <ModeToggle /> -->
			{#if profile && role}
				<NotificationsButton {notifications} />
				<UserNav {role} {profile} />
			{:else}
				<Button variant="outline" class="text-brand-dark-grey hover:bg-brand-white/90" size="sm" href="/sign-in">Login</Button>
				<Button  class="bg-brand-blue text-brand-white hover:bg-brand-blue/90" size="sm" href="/sign-up">Join</Button>
			{/if}
		</div>
	</div>
</header>
