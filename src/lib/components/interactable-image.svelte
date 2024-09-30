<script lang="ts">
	import { Dialog, DialogContent, DialogTrigger } from '$lib/components/ui/dialog';
	import type { HTMLImgAttributes } from 'svelte/elements';

	type $$Props = HTMLImgAttributes;

	let className: $$Props['class'] = undefined;
	export let src: $$Props['src'] = undefined;
	export let alt: $$Props['alt'] = undefined;
	export { className as class };
</script>

<Dialog>
	<DialogTrigger class={className}>
		<img {src} {alt} class={className} {...$$restProps} />
	</DialogTrigger>
	<DialogContent class="max-w-7xl border-0 bg-transparent p-0">
		<img {src} alt={alt || ''} class="h-full w-full object-contain" />
	</DialogContent>
</Dialog>
