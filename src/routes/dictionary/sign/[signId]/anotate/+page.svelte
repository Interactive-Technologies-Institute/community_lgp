<script lang="ts">
	import type { AnnotationArray, Parameter, Sign } from '@/types/types';
	import { themes } from '@/themes';
	import ParametersOptions from './_components/ParametersOptions.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Input from '@/components/ui/input/input.svelte';
	import { writable } from 'svelte/store';
	import ParameterBox from './_components/ParameterBox.svelte';
	import { Button } from '@/components/ui/button';

	export let data;
	

	let sign = data.sign;
	let parameters = data.parameters;
	export let exist_changes = false;

	export let signsAnotation = new Map<number, AnnotationArray>();
	let edit_mode = false;
	let add_theme = false;
	let open = false;
	let sheet_open = true;
	export let anotationArray: AnnotationArray = sign.annotation;
	console.log(anotationArray)
	let database_annotation = sign.annotation;
	let database_ann_array: any[] = [];

	let written_anotation = { configuration: '', movement: ['', '', ''], orientation: ['', ''] };

	if (sign.written_annotation != null) {
		written_anotation = sign.written_annotation;
	}

	let written_anotation_placeholder = written_anotation;

	if (written_anotation_placeholder.configuration == '') {
		written_anotation_placeholder.configuration = 'Anotação';
	}
	if (written_anotation_placeholder.orientation[0] == '') {
		written_anotation_placeholder.orientation[0] = 'Anotação';
	}
	if (written_anotation_placeholder.orientation[1] == '') {
		written_anotation_placeholder.orientation[1] = 'Anotação';
	}
	if (written_anotation_placeholder.movement[0] == '') {
		written_anotation_placeholder.movement[0] = 'Anotação';
	}
	if (written_anotation_placeholder.movement[1] == '') {
		written_anotation_placeholder.movement[1] = 'Anotação';
	}
	if (written_anotation_placeholder.movement[2] == '') {
		written_anotation_placeholder.movement[2] = 'Anotação';
	}
	let signStores = new Map<any, any>();
	
	// Create and populate the store only for the specific sign
		database_ann_array = database_ann_array.concat(
			database_annotation["configuration"],
			database_annotation['movement'],
			database_annotation['location'],
			database_annotation['orientation'],
			database_annotation['expression'],
		);
		
		signsAnotation.set(sign.id, database_annotation);
	
	

	const store = writable(new Map<any, boolean>());
	data.parameters.forEach((par: { id: any }) => {
		store.update((map) => {
			const newMap = new Map(map);
			newMap.set(par.id, database_ann_array.includes(par.id));
			return newMap;
		});
	});

	signStores.set(sign.id, store);
	
</script>



<div class="flex  justify-center py-5">
	<Button href="./">Sair da anotação</Button>
</div>

<div>
	<Tabs.Root value="configuracao" class="flex flex-col items-center gap-y-2">
		<Tabs.List class="flex items-center w-fit">
			<Tabs.Trigger value="configuracao">Configuração</Tabs.Trigger>
			<Tabs.Trigger value={"orientacao"}>Orientação</Tabs.Trigger>
			<Tabs.Trigger value={"localizacao"}>Localização</Tabs.Trigger>
			<Tabs.Trigger value={"movimento"}>Movimento</Tabs.Trigger>
			<Tabs.Trigger value={"expressoes"}>Expressões</Tabs.Trigger>         
		</Tabs.List>
		<Tabs.Content value="configuracao">
			<div class="flex items-center">
				<ParametersOptions data={data} 
										currentTab={"configuracao"} 
										bind:anotationArray={anotationArray} 
										isParSelected={signStores.get(sign.id)} 
										bind:signsAnotation={signsAnotation} 
										bind:sign={sign}
										bind:exist_changes={exist_changes}
										/>
			</div>    
				<div class="flex flex-row sticky justify-center pt-8 bottom-4  bg-blend-overlay">
					<form class="flex ">
						<div class="flex relative w-60">
							<Input placeholder="Anotação" class="pl-8" bind:value={written_anotation.configuration}/>
						</div>
					</form>
				</div>
		</Tabs.Content>
		<Tabs.Content value="orientacao">
			<div class="flex items-center w-full">
				<ParametersOptions data={data} 
									currentTab={"orientacao"} 
									bind:anotationArray={anotationArray} 
									isParSelected={signStores.get(sign.id)} 
									bind:signsAnotation={signsAnotation} 
									bind:sign={sign}
									bind:exist_changes={exist_changes}
									/>
			</div>
			<div class="flex flex-row sticky justify-center pt-8 gap-4 bottom-4 w-full bg-blend-overlay">
				<form class="flex ">
					<div class="flex relative w-60">
						<Input placeholder="Anotação" class="pl-8" bind:value={written_anotation.orientation[0]}/>
					</div>
				</form>
				<form class="flex ">
					<div class="flex relative w-60">
						<Input placeholder="Anotação" class="pl-8" bind:value={written_anotation.orientation[1]}/>
					</div>
				</form>
			</div>
		</Tabs.Content>
		<Tabs.Content value="localizacao">
			<div class="flex items-center">
				<ParametersOptions data={data} 
									currentTab={"localizacao"} 
									bind:anotationArray={anotationArray} 
									isParSelected={signStores.get(sign.id)} 
									bind:signsAnotation={signsAnotation} 
									bind:sign={sign}
									bind:exist_changes={exist_changes}
									/>
			</div>
		</Tabs.Content>
		<Tabs.Content value="movimento">
			<div class="flex items-center">
				<ParametersOptions data={data} 
										currentTab={"movimento"} 
										bind:anotationArray={anotationArray} 
										isParSelected={signStores.get(sign.id)} 
										bind:signsAnotation={signsAnotation} 
										bind:sign={sign}
										bind:exist_changes={exist_changes}
										/>
			</div>    
									<div class="flex flex-row sticky justify-center pt-8 gap-4 bottom-4 bg-blend-overlay">
										<form class="flex">
											<div class="flex relative w-40">
												<Input placeholder="Anotação" class="pl-8" bind:value={written_anotation.movement[0]}/>
											</div>
										</form>
										<form class="flex bg-white">
											<div class="flex relative w-40">
												<Input placeholder="Anotação" class="pl-8" bind:value={written_anotation.movement[1]}/>
											</div>
										</form>
										<form class="flex bg-white">
											<div class="flex relative w-40">
												<Input placeholder="Anotação" class="pl-8" bind:value={written_anotation.movement[2]}/>
											</div>
										</form>
									</div>
		</Tabs.Content>
		<Tabs.Content value="expressoes">
			<div class="flex items-center">
				<ParametersOptions data={data} 
										currentTab={"expressao facial"} 
										bind:anotationArray={anotationArray} 
										isParSelected={signStores.get(sign.id)} 
										bind:signsAnotation={signsAnotation} 
										bind:sign={sign}
										bind:exist_changes={exist_changes}
										/>
			</div>    
		</Tabs.Content>
	</Tabs.Root>
</div>



<div class="fixed bottom-0 right-0 p-3" />
