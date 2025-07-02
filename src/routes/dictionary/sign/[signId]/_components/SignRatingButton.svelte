<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toggleSignRatingSchema, type ToggleSignRatingSchema } from '@/schemas/sign';
	import { Smile, Meh, Frown } from 'lucide-svelte';
	import { tick } from 'svelte';

	export let data: SuperValidated<Infer<ToggleSignRatingSchema>>;
	export let currentValue: number | null;
	export let positiveNumber: number ;
	export let neutralNumber: number ;
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

	const { form: formData, enhance, submit } = form;

	function calculateRate(posVotes: number, neutralVotes: number, negVotes: number){
		const total = posVotes + neutralVotes + negVotes;
		if (total === 0) return 0;
		return posVotes/total * 100;
	}

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
    <div class="flex justify-start items-start mb-5 text-sm">O que acha desta entrada de gesto?</div>
    <div class="flex flex-col items-center ">
        <div class="flex items-center justify-between w-full">
            <div class="flex flex-col items-center justify-center space-y-1">
                <button type="button" class="transition hover:scale-110" on:click={() => selectRating(1)}>
                    <Smile size="48" class={currentValue === 1 ? 'text-green-500' : 'text-gray-400'} />
                </button>
                <span class={`text-sm ${currentValue === 1 ? 'text-green-500' : 'text-gray-400'}`}>Gosto!</span>
                <div class="text-gray-600">({positiveNumber})</div>
            </div>
            <div class="flex flex-col items-center justify-center space-y-1">
                <button type="button" class="transition hover:scale-110" on:click={() => selectRating(0)}>
                    <Meh size="48" class={currentValue === 0 ? 'text-yellow-500' : 'text-gray-400'} />
                </button>
                <span class={`text-sm ${currentValue === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>Neutro.</span>
                <div class="text-gray-600">({neutralNumber})</div>
            </div>
            <div class="flex flex-col items-center justify-center space-y-1">
                <button type="button" class="transition hover:scale-110" on:click={() => selectRating(-1)}>
                    <Frown size="48" class={currentValue === -1 ? 'text-red-500' : 'text-gray-400'} />
                </button>
                <span class={`text-sm ${currentValue === -1 ? 'text-red-500' : 'text-gray-400'}`}>Não gosto.</span>
                <div class="text-gray-600">({negativeNumber})</div>
            </div>
        </div>
        <div class="text-center text-gray-700 font-medium">
            {calculateRate(positiveNumber, negativeNumber, neutralNumber)}% das pessoas aprovam este gesto!
        </div>
    </div>
</form>