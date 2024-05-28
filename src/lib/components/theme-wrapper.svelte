<script lang="ts">
	import { cn } from '@/utils';

	export let theme: string;
	export let radius: number;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn(`theme-${theme}`, className)} style="--radius: {radius}rem">
	<slot />
</div>
