<script lang="ts">
	import { page } from '$app/stores';
	import ModeToggle from '@/components/mode-toggle.svelte';
	import MainNav from '@/components/nav/main-nav.svelte';
	import MobileNav from '@/components/nav/mobile-nav.svelte';
	import UserNav from '@/components/nav/user-nav.svelte';
	import type { Notification, UserProfile, UserRole } from '@/types/types';
	import NotificationsButton from './notifications-button.svelte';
	import FeatureWrapper from './feature-wrapper.svelte';
	import { Button } from './ui/button';
	import { Camera } from 'lucide-svelte';
	import { cn } from '@/utils';

	export let role: UserRole | null;
	export let profile: UserProfile | null;
	export let notifications: Notification[];

	$: isIslrDatasetPage = $page.url.pathname.startsWith('/islr-dataset');
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
			{#if role === 'admin' || role === 'contributor'}
				<FeatureWrapper feature="islrdatasetcontribute">
					<Button
						class={cn(
							'gap-2 bg-brand-yellow text-black hover:bg-brand-yellow/90',
							isIslrDatasetPage && 'bg-brand-yellow/80 ring-2 ring-brand-yellow ring-offset-2 ring-offset-brand-dark hover:bg-brand-yellow/80'
						)}
						size="sm"
						href="/islr-dataset"
						aria-current={isIslrDatasetPage ? 'page' : undefined}
					>
						<Camera class="h-4 w-4 shrink-0" />
						<span class="hidden sm:inline">Contribuir Dataset</span>
					</Button>
				</FeatureWrapper>
				<div class="h-8 w-px shrink-0 bg-brand-blue"></div>
			{/if}
			<ModeToggle />
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
