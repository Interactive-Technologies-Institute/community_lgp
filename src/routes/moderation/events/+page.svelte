<script lang="ts">
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import { Input } from '@/components/ui/input';
	import * as Tabs from '@/components/ui/tabs';
	import EventsModerationTable from './_components/events-moderation-table.svelte';

	export let data;
</script>

<Tabs.Content value="events" class="mt-8 flex flex-col gap-y-4">
	<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
		<Input placeholder="Search..." class="flex-1 sm:max-w-64"></Input>
		<TagFilterButton />
	</div>
	<EventsModerationTable events={data.events} updateModerationForm={data.updateModerationForm} />
</Tabs.Content>
