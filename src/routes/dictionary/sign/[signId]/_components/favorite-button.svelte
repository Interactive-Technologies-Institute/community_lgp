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

	const { form: formData, enhance, submit, submitting } = form;

	async function toggleFavorite() {
		if ($submitting) return;

		$formData.value = !$formData.value;
		count += $formData.value ? 1 : -1;
		await tick();

		try {
			await submit();
		} catch (err) {
			console.error('Submit failed:', err);
		}
	}
</script>

<form method="POST" action="?/toggleFavorite" use:enhance class="min-w-0">
	<input type="hidden" name="value" value={$formData.value} />
	<Button 
		type="button" 
		on:click={toggleFavorite} 
		variant="outline"
		data-selected={$formData.value}
		aria-pressed={$formData.value}
		aria-label={`${$formData.value ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}. ${count} ${count === 1 ? 'favorito' : 'favoritos'}`}
		disabled={$submitting} 
		class="h-16 w-full justify-center gap-3 rounded-xl border px-4 bg-brand-white text-brand-grey hover:border-brand-yellow hover:bg-brand-yellow/10 data-[selected=true]:border-brand-yellow data-[selected=true]:bg-brand-yellow/15">
		<Star class={cn('h-6 w-6 shrink-0 transition hover:scale-110', { 'fill-brand-yellow': $formData.value })} />
		<span class="min-w-0 text-left leading-tight">
			<p class="block truncate font-semibold">Favorito</p>
		</span>
	</Button>
</form>
