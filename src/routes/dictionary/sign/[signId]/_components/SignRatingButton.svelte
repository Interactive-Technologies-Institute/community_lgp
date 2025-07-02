<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toggleSignRatingSchema, type ToggleSignRatingSchema } from '@/schemas/sign';
	import { Smile, Meh, Frown } from 'lucide-svelte';
	import { tick } from 'svelte';

	export let data: SuperValidated<Infer<ToggleSignRatingSchema>>;
	export let currentValue: number | null;
	export let positiveNumber: number | null;
	

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

	const { form: formData, enhance, submit } = form;

	async function selectRating(val: number) {
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

<form method="POST" action="?/toggleRating" use:enhance>
	<input type="hidden" name="value" value={$formData.value} />
	<div class="flex justify-start items-start mb-5">O que acha desta entrada de gesto?</div>
	<div class="flex items-center justify-between space-x-6">
		<div class="flex flex-col items-center justify-center">
        <button type="button" class="transition hover:scale-110" on:click={() => selectRating(1)}>
			<Smile size="48" class={currentValue === 1 ? 'text-green-500' : 'text-gray-400'} />
		<span class={currentValue === 1 ? 'text-green-500' : 'text-gray-400'}>Gosto!</span>
		</button>
        <!--<div class="">({positiveNumber})</div> TO IMPLEMENT-->
		
        </div>
		<button type="button" class="transition hover:scale-110" on:click={() => selectRating(0)}>
			<div class="flex flex-col items-center justify-center">
			<Meh size="48" class={currentValue === 0 ? 'text-yellow-500' : 'text-gray-400'} />
			<span class={currentValue === 0 ? 'text-yellow-500' : 'text-gray-400'}>Neutro.</span>
			</div>
		</button>
		
		<button type="button" class="transition hover:scale-110" on:click={() => selectRating(-1)}>
			<div class="flex flex-col items-center justify-center">
			<Frown size="48" class={currentValue === -1 ? 'text-red-500' : 'text-gray-400'} />
			<span class={currentValue === -1 ? 'text-red-500' : 'text-gray-400'}>Não gosto.</span>
			</div>
		</button>
	</div>
</form>
