<script lang="ts">
	import Logo from '@/components/logo.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
	$: ({ branding } = data);
</script>

<MetaTags title={branding.name} description={branding.slogan} />

<div class="container mx-auto mb-20 mt-20 flex flex-col items-center justify-center md:mt-40">
	{#if branding.logo}
		<Logo class="h-32 w-32 md:h-48 md:w-48" logoUrl={branding.logo} />
	{/if}
	<h1 class="mb-4 text-center text-6xl font-bold md:text-8xl">{branding.name}</h1>
	<p class="text-center text-xl text-muted-foreground md:text-3xl">{branding.slogan}</p>
</div>
