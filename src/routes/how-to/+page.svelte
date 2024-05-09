<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Select from '@/components/ui/select';
	import { PlusCircle } from 'lucide-svelte';
	import HowToItem from './_components/how-to-item.svelte';

	export let data;
</script>

<PageHeader title="How to" subtitle="Learn & share how to solve your problems" />
<div class="container mx-auto flex flex-row justify-between">
	<div class="flex flex-row gap-x-4">
		<Select.Root>
			<Select.Trigger class="w-52">
				<Select.Value placeholder="Filter by tag" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
			</Select.Content>
		</Select.Root>
		<Select.Root>
			<Select.Trigger class="w-52">
				<Select.Value placeholder="Sort by" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
				<Select.Item value="lorem">Lorem</Select.Item>
			</Select.Content>
		</Select.Root>
		<Input placeholder="Search..." class="w-64"></Input>
	</div>
	<Button href="/how-to/create"><PlusCircle class="mr-2 h-4 w-4" />Create a How-to</Button>
</div>
<div class="container mx-auto grid grid-cols-4 gap-6 py-10">
	{#each data.howTos as howTo}
		<HowToItem {howTo} />
	{/each}
</div>
