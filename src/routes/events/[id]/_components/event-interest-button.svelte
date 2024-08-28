<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { toggleEventInterestSchema, type ToggleEventInterestSchema } from '@/schemas/event';
	import { cn } from '@/utils';
	import { Bookmark } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let count: number;
	export let data: SuperValidated<Infer<ToggleEventInterestSchema>>;

	const form = superForm(data, {
		validators: zodClient(toggleEventInterestSchema),
		invalidateAll: 'force',
		onUpdate: ({ result }) => {
			if (result.type === 'failure') {
				$formData.value = !$formData.value;
				count += $formData.value ? 1 : -1;
			}
		},
	});

	const { form: formData, enhance, submit } = form;

	async function toggleInterest() {
		$formData.value = !$formData.value;
		count += $formData.value ? 1 : -1;
		await tick();
		submit();
	}
</script>

<form method="POST" action="?/toggleInterest" use:enhance>
	<input type="hidden" name="value" value={$formData.value} />
	<Button type="button" on:click={toggleInterest} variant="outline" size="sm">
		<Bookmark class={cn('mr-2 h-4 w-4', { 'fill-foreground': $formData.value })} />
		{#if $formData.value}
			Marked as interested
		{:else}
			Mark as interested
		{/if}
		<span class="ml-4 font-mono text-xs">{count}</span>
	</Button>
</form>
