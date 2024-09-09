<script lang="ts">
	import { cn } from '@/utils';

	type $$Props = {
		logoUrl: string;
		class?: string;
	};

	export let logoUrl: $$Props['logoUrl'];
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div class={cn('logo bg-primary', className)} style="--logo-url: url({logoUrl})"></div>

<style>
	.logo {
		-webkit-mask: var(--logo-url) no-repeat center;
		mask: var(--logo-url) no-repeat center;
		-webkit-mask-size: contain;
		mask-size: contain;
	}
</style>
