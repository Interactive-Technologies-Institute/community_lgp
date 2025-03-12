<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte';
	import * as HoverCard from "$lib/components/ui/hover-card";
	import { writable, type Writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';

	export let data;
	export let parameters: Parameter[] = data.parameters;
	export let currentTab: String;
	export let anotationArray: AnnotationArray = data.sign.annotation;
	export let isParSelected: Writable<Map<any, boolean>> = writable(new Map());
	export let signsAnotation = new Map<number, AnnotationArray>();
	export let sign: Sign;
	export let exist_changes: boolean;

	let open = false;

	data.parameters.forEach((parameter: any) => {
		if (parameter.is_parent) {
		}
	});

	export function updateSelectedState(id: any, isSelected: boolean) {
		isParSelected.update((map) => {
			const newMap = new Map(map);
			newMap.set(id, isSelected);
			return newMap;
		});
	}

	function useToast(message: number) {
		open = false;

		if (message == 0) {
			toast('A editar name e temas', {
				action: {
					label: 'Ok',
					onClick: () => {},
				},
			});
		} else if (message == 1) {
			toast('Alterações guardadas!', {
				action: {
					label: 'Ok',
					onClick: () => reloadPage(),
				},
			});
		} else if (message == 2) {
			toast('Tem anotações por guardar!', {
				action: {
					label: 'Ok',
					onClick: () => {},
				},
			});
		} else if (message == 3) {
			toast('Anotação guardada!', {
				action: {
					label: 'Ok',
					onClick: () => reloadPage(),
				},
			});
		}
	}

	function getElementByCode(code: any) {
		return parameters.find((item: { code: any }) => item.code === code);
	}

	function getParameterById(id: any) {
		return parameters.find((item: { id: any }) => item.id === id);
	}

	function selectParameter(id: any, type: string) {
		let isSelected = $isParSelected.get(id);

		

		updateSelectedState(id, !isSelected);

		const updateAnnotationArray = (type: keyof AnnotationArray, id: any) => {
			if (!isSelected) {
				console.log(id); //keep them for debugging if need be
				console.log(anotationArray);
				anotationArray[type].push(id);
				signsAnotation.set(sign.id, anotationArray);
				console.log("Updated signs anon ", signsAnotation.get(sign.id));
				if (!exist_changes) {
					useToast(2);
				}
				exist_changes = true;
			} else {
				anotationArray[type] = anotationArray[type].filter((e) => e !== id);
				if (!exist_changes) {
					useToast(2);
				}
				exist_changes = true;
			}
		};

		switch (type) {
			case 'configuracao':
				updateAnnotationArray('configuration', id);
				break;
			case 'movimento':
				updateAnnotationArray('movement', id);
				break;
			case 'localizacao':
				updateAnnotationArray('location', id);
				break;
			case 'orientacao':
				updateAnnotationArray('orientation', id);
				break;
			case 'expressao facial':
				updateAnnotationArray('expression', id);
				break;
		}
	}

	function reloadPage() {
		window.location.reload();
	}

	
</script>

<!---->
<ScrollArea class="flex h-[22rem] pt-4">
	<div class="grid grid-cols-3 gap-4">

		{#each data.parameters as par}
			{#if par.is_parent && par.type == currentTab}  
				{#if par.children.length == 0}
					<!-- Nested card for signs without children -->
					<button on:click={() => selectParameter(par.id, par.type)}>
						{#if $isParSelected.get(par.id)}
							<Card.Root class="flex items-center justify-center aspect-square w-32" style="border: 2px solid #0096FF;">
								<Card.Content class="flex flex-col gap-2">
									{#if par.image != null}
										<img class="flex w-14" src={par.image} alt=""/>
										{#if par.name}
											{par.name}
										{:else}
											{par.code}
										{/if}
									{:else if par.image == null}
										{#if par.name != null}
											{par.name}
											{par.code}
										{:else}
											{par.code}
										{/if}
									{/if}
								</Card.Content>
							</Card.Root>
						{:else}
							<Card.Root class="flex flex-col items-center w-96 h-60 gap-3 pt-2">
								<Card.Content class="flex flex-col gap-2">
									<Card.Root class="flex items-center justify-center aspect-square w-32">
										<Card.Content class="flex flex-col gap-2">
											{#if par.image != null}
												<img class="flex w-14" src={par.image} alt=""/>
												{#if par.name}
													{par.name}
												{:else}
													{par.code}
												{/if}
											{:else if par.image == null}
												{#if par.name != null}
													{par.name}
													{par.code}
												{:else}
													{par.code}
												{/if}
											{/if}
										</Card.Content>
									</Card.Root>
								</Card.Content>
							</Card.Root>
						{/if}
					</button>
				{:else}
					<!-- Adaptable card for signs with children -->
					<Card.Root class="w-auto min-w-[200px] min-h-[150px] p-2 border">
						<Card.Content class="flex flex-col items-center justify-center gap-2">
							<button on:click={() => selectParameter(par.id, par.type)}>
								{#if $isParSelected.get(par.id)}
									<Card.Root class="flex items-center justify-center aspect-square w-32" style="border: 2px solid #0096FF;">
										<Card.Content class="flex flex-col gap-2">
											<div class="flex flex-col items-center justify-center">
												{#if par.type == "configuracao"}
													<img class="flex w-14" src={par.image} alt=""/>
													{par.code}
												{:else if par.image == null}
													{#if par.name != null}
														{par.name}
														{par.code}
													{:else}
														{par.code}
													{/if}
												{/if}
											</div>
										</Card.Content>
									</Card.Root>
								{:else}
									<Card.Root class="flex items-center justify-center aspect-square w-32">
										<Card.Content class="flex flex-col gap-2">
											<div class="flex flex-col items-center justify-center">
												{#if par.type == "configuracao"}
													<img class="flex w-14" src={par.image} alt=""/>
													{par.code}
												{:else if par.image == null}
													{#if par.name != null}
														{par.name}
														{par.code}
													{:else}
														{par.code}
													{/if}
												{/if}
											</div>
										</Card.Content>
									</Card.Root>
								{/if}
							</button>

							<HoverCard.Root>
								<HoverCard.Trigger>
									{#if par.children.length > 0}
										<div class="grid grid-cols-3 gap-4">
											{#each par.children as child}
												{#if child != null}
													<button on:click={() => selectParameter(getElementByCode(child)?.id, getElementByCode(child).type)}>
														{#if $isParSelected.get(getElementByCode(child)?.id)}
															<Card.Root class="flex flex-col items-center justify-center aspect-square w-16" style="border: 2px solid #0096FF;">
																<Card.Content>
																	<img class="flex w-14" src={getElementByCode(child)?.image} alt=""/>
																</Card.Content>
															</Card.Root>
														{:else}
															<Card.Root class="flex flex-col items-center justify-center aspect-square w-16">
																<Card.Content>
																	<img class="flex w-14" src={getElementByCode(child)?.image} alt=""/>
																</Card.Content>
															</Card.Root>
														{/if}
													</button>
												{/if}
											{/each}
										</div>
									{/if}
								</HoverCard.Trigger>
								<HoverCard.Content class="overflow-auto">
									{#if par.children.length > 0}
										<div class="grid grid-cols-3 gap-4">
											{#each par.children as child}
												{#if child != null}
													<button on:click={() => selectParameter(getElementByCode(child)?.id, getElementByCode(child).type)}>
														{#if $isParSelected.get(getElementByCode(child)?.id)}
															<Card.Root class="flex flex-col items-center justify-center aspect-square w-28" style="border: 2px solid #0096FF;">
																<Card.Content>
																	<img class="flex w-14" src={getElementByCode(child)?.image} alt=""/>
																	<div class="flex text-xs justify-center">
																		{child}
																	</div>
																</Card.Content>
															</Card.Root> 
														{:else}
															<Card.Root class="flex flex-col items-center justify-center aspect-square w-28">
																<Card.Content>
																	<img class="flex w-14" src={getElementByCode(child)?.image} alt=""/>
																	<div class="flex text-xs justify-center">
																		{child}
																	</div>
																</Card.Content>
															</Card.Root>
														{/if}
													</button>
												{/if}
											{/each}
										</div>
									{/if}
								</HoverCard.Content>
							</HoverCard.Root>
						</Card.Content>
					</Card.Root>
				{/if}
			{/if}
		{/each}
	</div>
</ScrollArea>
