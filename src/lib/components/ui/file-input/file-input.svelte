<script lang="ts" context="module">
	import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = FormPathLeaves<T, File>;
	type FileFieldProps<T extends Record<string, unknown>, U extends FormPathLeaves<T, File>> = {
		/**
		 * The form object returned from calling `superForm` in your component.
		 */
		form: SuperForm<T>;
		/**
		 * The path to the field in the form object.
		 *
		 * @required
		 */
		name: U;
	};
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T, File>">
	import { cn } from '$lib/utils.js';
	import * as Card from '@/components/ui/card';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { fileProxy } from 'sveltekit-superforms';
	import type { InputEvents } from './index.js';

	type $$Props = Omit<HTMLInputAttributes, 'form' | 'type'> & FileFieldProps<T, U>;
	type $$Events = InputEvents;

	export let form: SuperForm<T>;
	export let name: U;

	let className: $$Props['class'] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;

	let file = fileProxy(form, name);
	let fileUrl: string | null | undefined = undefined;
	$: {
		if ($file.length > 0) {
			const img = $file.item(0);
			const reader = new FileReader();
			reader.onload = (e) => {
				fileUrl = e.target?.result as string | null | undefined;
			};
			reader.readAsDataURL(img!);
		}
	}
</script>

<div class="flex flex-col gap-y-2">
	<Card.Root class="aspect-video overflow-hidden">
		{#if fileUrl}
			<img src={fileUrl} class="h-full w-full object-cover" />
		{/if}
	</Card.Root>
	<input
		class={cn(
			'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		type="file"
		bind:files={$file}
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
		on:paste
		on:input
		on:wheel
		{...$$restProps}
	/>
</div>
