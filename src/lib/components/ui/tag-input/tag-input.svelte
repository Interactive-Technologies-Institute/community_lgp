<script lang="ts">
	import { cn } from '@/utils';
	import { X } from 'lucide-svelte';
	import { type TagInputProps } from '.';
	import { Badge } from '../badge';

	type $$Props = TagInputProps;

	let className: $$Props['class'] = undefined;
	export let value: string[] = [];
	export { className as class };

	export let maxTags: $$Props['maxTags'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;
	export let placeholderWhenFull: $$Props['placeholderWhenFull'] = undefined;
	export let minLength: $$Props['minLength'] = undefined;
	export let maxLength: $$Props['maxLength'] = undefined;

	let inputValue = '';

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			const newTagText = inputValue.trim();

			if (minLength && newTagText.length < minLength) {
				console.warn('Tag is too short');
				return;
			}

			if (maxLength && newTagText.length > maxLength) {
				console.warn('Tag is too long');
				return;
			}

			if (newTagText && (maxTags === undefined || value.length < maxTags)) {
				value = [...value, newTagText];
			}
			inputValue = '';
		}
	};

	const handleUnselect = (tag: string) => {
		value = value.filter((t) => t !== tag);
	};
</script>

<div
	class={cn(
		'flex h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
>
	{#each value as tag}
		<Badge variant="secondary">
			{tag}
			<button
				class={cn(
					'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
					false && 'hidden'
				)}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						handleUnselect(tag);
					}
				}}
				on:mousedown={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				on:click={() => handleUnselect(tag)}
			>
				<X class="h-3 w-3 text-muted-foreground hover:text-foreground" />
			</button>
			<input type="hidden" name={$$props.name} value={tag} />
		</Badge>
	{/each}
	<input
		class="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
		type="text"
		bind:value={inputValue}
		placeholder={maxTags !== undefined && value.length >= maxTags
			? placeholderWhenFull
			: placeholder}
		on:keydown={handleKeyDown}
		disabled={maxTags !== undefined && value.length >= maxTags}
	/>
</div>
