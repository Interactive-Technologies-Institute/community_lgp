<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import PencilCircleFill from '$lib/img/pencil_circle_fill.svelte';
	import DropdownButton from './DropdownButton.svelte';

	export let data: any;
	export let current_sign: any;
	let themes: string[] = [];

	function getSignById(id: any) {
		return data.signs.find((item: { id: any }) => item.id === id);
	}

	function changeCurrentSign(sign: any) {
		current_sign = sign;
	}

	export let anotation_options: { name: string; show: boolean }[];
	export let theme_options: { name: string; show: boolean }[];

	function themeShown(themeName: string[], options: any): boolean {
		let themeValue = false;

		options.forEach((option: any) => {
			if (themeName.includes(option.name)) {
				themeValue = themeValue || option.show;
			}
		});

		return themeValue;
	}

	function anotationShown(anotation: number, options: any): boolean {
		let anotationValue = false;
		let anotation_name = 'Por anotar';

		if (anotation == 1) {
			anotation_name = 'Anotação não terminada';
		} else if (anotation == 2) {
			anotation_name = 'Anotados';
		}

		options.forEach((option: any) => {
			if (anotation_name == option.name) {
				anotationValue = anotationValue || option.show;
			}
		});

		return anotationValue;
	}
</script>

<div class="flex w-full flex-col">
	<div class="flex flex-row items-center justify-center gap-2 py-5">
		<DropdownButton label={'Anotação'} bind:options={anotation_options} />
		<DropdownButton label={'Temas'} bind:options={theme_options} />
	</div>
	<Separator />

	<ScrollArea class="flex flex-row py-5">
		<div class="flex flex-col items-center gap-7">
			{#each data.signs as sign}
				{#if themeShown(sign.theme, theme_options) && anotationShown(sign.is_anotated, anotation_options)}
					<div class="flex flex-col items-center gap-1">
						{#if current_sign == sign}
							<Card.Root class="flex h-24 w-60  flex-col" style="border: 2px solid #0096FF;">
								<div class="flex flex-1 flex-row justify-end pe-2 pt-2">
									{#if sign.is_anotated == 2}
										<PencilCircleFill color={'#c1e1c1'} />
									{:else if sign.is_anotated == 1}
										<PencilCircleFill color={'#ffdfba'} />
									{:else if sign.is_anotated == 0}
										<PencilCircleFill color={'#ffadad'} />
									{/if}
								</div>

								<div class="sticky flex flex-col items-center justify-center">
									<div>
										{sign.name}
									</div>
									<div class="text-xs font-semibold">
										{sign.theme}
									</div>
								</div>

								<div class="flex flex-1 pb-2"></div>
							</Card.Root>
						{:else}
							<button on:click={() => changeCurrentSign(sign)}>
								<Card.Root class="flex h-24 w-60 flex-col">
									<div class="sticky flex flex-1 flex-row justify-end pe-2 pt-2">
										{#if sign.is_anotated == 2}
											<PencilCircleFill color={'#c1e1c1'} />
										{:else if sign.is_anotated == 1}
											<PencilCircleFill color={'#ffdfba'} />
										{:else if sign.is_anotated == 0}
											<PencilCircleFill color={'#ffb3ba'} />
										{/if}
									</div>

									<div class="flex flex-grow flex-col">
										<div>
											{sign.name}
										</div>
										<div class="text-xs font-semibold">
											{sign.theme}
										</div>
									</div>

									<div class="flex flex-1 pb-2"></div>
								</Card.Root>
							</button>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</ScrollArea>
</div>
