<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { PlusCircle } from 'lucide-svelte';
	import SortButton from './../../lib/components/sort-button.svelte';
	import HowToItem from './_components/how-to-item.svelte';

	export let data;
</script>

<PageHeader title="How to" subtitle="Learn & share how to solve your problems" />
<div class="container mx-auto flex flex-row justify-between">
	<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
		<Input placeholder="Search..." class="flex-1 sm:max-w-64"></Input>
		<TagFilterButton tags={data.tags} />
		<SortButton />
	</div>
	<Button href="/how-to/create" class="fixed bottom-6 right-6 sm:static">
		<PlusCircle class="mr-2 h-4 w-4" />
		Create a How-to
	</Button>
</div>
<div
	class="container mx-auto grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
>
	{#each data.howTos as howTo}
		<HowToItem {howTo} />
	{/each}
</div>
