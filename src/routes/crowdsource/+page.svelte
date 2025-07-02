<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import * as Tabs from '@/components/ui/tabs'
	import * as Card from '@/components/ui/card'
	import SignFlowAuthor from './_components/SignFlowAuthor.svelte';
	export let data;

	let triggerString: string = "proposals";
	let triggerArray: {name: string, description: string}[] = 
	[
		{name: "proposals", description: "Visualize as propostas aceites e em discussão."}, 
		{name: "comments", description: "Visualize os comentários da comunidade."}, 
		{name: "community", description: "Veja quem interage na comunidade!"}, 
		{name: "tutorial", description: "Veja como submeter uma proposta de gesto."}
		];
	
	$: subtitle = triggerArray.find(item => item.name === triggerString)?.description ?? "";

	let signsWithUsers = data.signsWithUsers;
</script>

<MetaTags
	title="Central de Crowdsource"
	description="Proponha uma nova entrada de gesto, consulte as propostas que estão a decorrer e participe na deliberação
de novos termos."
/>

<PageHeader
	title="Central de Crowdsource"
	subtitle={subtitle}
/>




<div class="flex items-center justify-center w-full">

		<Tabs.Root value={triggerArray[0].name} >
	<div class="flex items-center justify-center">
	<Tabs.List>
		<Tabs.Trigger value={triggerArray[0].name} on:click={() => triggerString = triggerArray[0].name}>Propostas</Tabs.Trigger>
		<Tabs.Trigger value={triggerArray[1].name} on:click={() => triggerString = triggerArray[1].name}>Comentários</Tabs.Trigger>
		<Tabs.Trigger value={triggerArray[2].name} on:click={() => triggerString = triggerArray[2].name}>Comunidade</Tabs.Trigger>
		<Tabs.Trigger value={triggerArray[3].name} on:click={() => triggerString = triggerArray[3].name}>Como submeter?</Tabs.Trigger>
	</Tabs.List>
	</div>
	<Tabs.Content class="w-full" value={triggerArray[0].name}>
		<Card.Root>
			<Card.Content>
				<div class="flex flex-col items-start justify-start mt-2">
					<h1 class="py-2">Propostas Em Discussão Mais Recentes</h1>
						<SignFlowAuthor
	signs={signsWithUsers}
/>
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value={triggerArray[1].name}><Card.Root>
			<Card.Content>
				
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value={triggerArray[2].name}><Card.Root>
			<Card.Content>
				
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value={triggerArray[3].name}><Card.Root>
			<Card.Content>
				<div class="flex items-center justify-center pt-5">[Placeholder] para colocar vídeo depois.</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	</Tabs.Root>

	<!--<div class="mr-10 flex items-start justify-start">Propostas em processo de aprovação</div>

	<Separator orientation="vertical" class="h-72" />

	<div class="ml-10 flex items-start justify-start">Propostas aprovadas</div>-->
</div>
