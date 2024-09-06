<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils.js';
	import { Eye, EyeOff } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { PasswordInputEvents } from './index.js';

	type $$Props = HTMLInputAttributes;
	type $$Events = PasswordInputEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };

	let showPassword = false;

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;
</script>

<div class="relative">
	<Input
		type={showPassword ? 'text' : 'password'}
		class={cn('pr-10', className)}
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:mousemove
		on:paste
		on:input
		{...$$restProps}
	/>
	<Button
		variant="ghost"
		size="icon"
		class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
		on:click={togglePasswordVisibility}
	>
		{#if showPassword}
			<EyeOff class="h-4 w-4 text-muted-foreground" />
		{:else}
			<Eye class="h-4 w-4 text-muted-foreground" />
		{/if}
	</Button>
</div>
