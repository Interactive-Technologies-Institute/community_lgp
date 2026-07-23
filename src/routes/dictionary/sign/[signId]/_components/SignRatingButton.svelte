<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { cn } from '@/utils';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toggleSignRatingSchema, type ToggleSignRatingSchema } from '@/schemas/sign';
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { tick } from 'svelte';

	export let data: SuperValidated<Infer<ToggleSignRatingSchema>>;
	export let currentValue: number | null;
	export let positiveNumber: number;
	export let negativeNumber: number;

	const form = superForm(data, {
		id: 'toggle-sign-rating',
		validators: zodClient(toggleSignRatingSchema),
		invalidateAll: 'force',
		onUpdate: ({ result }) => {
			if (result.type === 'failure') {
				// Reset to current value - now as number or null
				$formData.value = currentValue;
			}
		},
	});

	const { form: formData, enhance, submit, submitting } = form;

	function calculateRate(posVotes: number, negVotes: number) {
		const total = posVotes + negVotes;
		if (total === 0) return 0;
		return (posVotes / total) * 100;
	}

	async function selectRating(val: number) {
		if ($submitting) return;

		const newValue = currentValue === val ? null : val;
		$formData.value = newValue === null ? '' : newValue.toString();
		await tick();
		
		try {
			await submit();
		} catch (err) {
			console.error('Submit failed:', err);
		}
	}
</script>

<form method="POST" action="?/toggleRating" use:enhance class="min-w-0">
	<input type="hidden" name="value" value={$formData.value} />
	<div class="grid grid-cols-2 gap-3">
		<Button 
			on:click={() => selectRating(1)}
			variant="outline"
			data-selected={Number($formData.value) === 1}
			aria-pressed={Number($formData.value) === 1}
			aria-label={`Gosto. ${positiveNumber} ${positiveNumber === 1 ? 'voto' : 'votos'}`}
			disabled={$submitting}
			class="h-16 w-full justify-start gap-3 rounded-xl border px-4 bg-brand-white text-brand-grey hover:border-brand-blue hover:bg-brand-blue/10 data-[selected=true]:border-brand-blue data-[selected=true]:bg-brand-blue/10" 
		>
			<ThumbsUp class={cn('h-5 w-5 shrink-0 transition hover:scale-110', { 'fill-brand-blue': $formData.value === 1 })} />
			<span class="min-w-0 text-left leading-tight">
				<p class="block truncate font-semibold">Gosto</p>
				<p class="block text-xs tabular-nums text-brand-grey">{positiveNumber}</p>
			</span>
		</Button>

		<Button
			on:click={() => selectRating(-1)}
			variant="outline"
			data-selected={Number($formData.value) === -1}
			aria-pressed={Number($formData.value) === -1}
			aria-label={`Não gosto. ${negativeNumber} ${negativeNumber === 1 ? 'voto' : 'votos'}`}
			disabled={$submitting}
			class="h-16 w-full justify-start gap-3 rounded-xl border px-4 bg-brand-white text-brand-grey hover:border-destructive hover:bg-destructive/10 data-[selected=true]:border-destructive data-[selected=true]:bg-destructive/10" 
		>
			<ThumbsDown class={cn('h-5 w-5 shrink-0 transition hover:scale-110', { 'fill-destructive': $formData.value === -1 })} />
			<span class="min-w-0 text-left leading-tight">
				<p class="block truncate font-semibold">Não gosto</p>
				<p class="block text-xs tabular-nums text-brand-grey">{negativeNumber}</p>
			</span>
		</Button>
	</div>
</form>
