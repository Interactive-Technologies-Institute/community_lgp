<script lang="ts">
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<div
		class="fixed bottom-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-foreground p-3 font-mono text-xs text-background"
	></div>
{/if}
