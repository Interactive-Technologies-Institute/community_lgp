<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { toggleSignFavoriteSchema, type ToggleSignFavoriteSchema } from '@/schemas/sign';
	import { cn } from '@/utils';
	import { Star } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let count: number;
	export let data: SuperValidated<Infer<ToggleSignFavoriteSchema>>;

	const form = superForm(data, {
		validators: zodClient(toggleSignFavoriteSchema),
		invalidateAll: 'force',
		onUpdate: ({ result }) => {
			if (result.type === 'failure') {
				$formData.value = !$formData.value;
				count += $formData.value ? 1 : -1;
			}
		},
	});

	const { form: formData, enhance, submit } = form;

	async function toggleFavorite() {
		$formData.value = !$formData.value;
		count += $formData.value ? 1 : -1;
		await tick();
		submit();
	}
</script>

<form method="POST" action="?/toggleFavorite" use:enhance>
	<input type="hidden" name="value" value={$formData.value} />
	<Button type="button" on:click={toggleFavorite} variant="outline" class="rounded-xl">
		<Star class={cn('mr-2 h-4 w-4', { 'fill-foreground': $formData.value })} />
		{#if $formData.value}
			Adicionado aos favoritos
		{:else}
			Adicionar aos favoritos
		{/if}
		<span class="ml-4 font-mono text-xs">{count}</span>
	</Button>
</form>
