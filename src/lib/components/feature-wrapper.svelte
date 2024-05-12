<script lang="ts">
	import { page } from '$app/stores';
	import type { Feature } from '@/types/types';

	export let feature: Feature;
	$: features = $page.data.features;
	$: isEnabled = features.includes(feature);
</script>

{#if isEnabled}
	<slot />
{/if}
