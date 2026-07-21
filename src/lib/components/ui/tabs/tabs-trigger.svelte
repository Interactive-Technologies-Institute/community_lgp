<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = TabsPrimitive.TriggerProps;
	type $$Events = TabsPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export { className as class };
</script>

<TabsPrimitive.Trigger
	class={cn(
		'flex flex-row flex-auto items-center justify-center whitespace-nowrap rounded-lg p-3 py-1.5 text-base bg-brand-white text-foreground shadow-sm border border-brand-border data-[state=active]:border data-[state=active]:border-brand-blue data-[state=active]:text-brand-white data-[state=active]:bg-brand-blue',
		className
	)}
	{value}
	{...$$restProps}
	on:click
>
	<slot />
</TabsPrimitive.Trigger>
