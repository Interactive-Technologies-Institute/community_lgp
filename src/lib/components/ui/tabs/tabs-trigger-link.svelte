<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Tabs as TabsPrimitive } from 'bits-ui';

	type $$Props = TabsPrimitive.TriggerProps & { href: string };
	type $$Events = TabsPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export let href: string; // Add href prop
	export { className as class };
</script>

<TabsPrimitive.Trigger {value} {...$$restProps} on:click asChild let:builder>
	<a
		{href}
		{...builder}
		class={cn(
			'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
			className
		)}
		><slot />
	</a>
</TabsPrimitive.Trigger>
