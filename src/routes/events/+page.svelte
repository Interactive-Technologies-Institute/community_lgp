<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import SortButton from '@/components/sort-button.svelte';
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { PlusCircle } from 'lucide-svelte';
	import EventItem from './_components/event-item.svelte';

	export let data;
</script>

<PageHeader title="Events" subtitle="Find & share events" />
<div class="container mx-auto flex flex-row justify-between">
	<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
		<Input placeholder="Search..." class="flex-1 sm:max-w-64"></Input>
		<TagFilterButton tags={data.tags} />
		<SortButton />
	</div>
	<Button href="/events/create">
		<PlusCircle class="mr-2 h-4 w-4" />
		Create an Event
	</Button>
</div>
<div class="container mx-auto grid grid-cols-1 gap-6 py-10 lg:grid-cols-2">
	{#each data.events as event}
		<EventItem {event}></EventItem>
	{/each}
</div>
