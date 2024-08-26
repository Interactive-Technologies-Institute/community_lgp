<script lang="ts">
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import { Input } from '@/components/ui/input';
	import * as Tabs from '@/components/ui/tabs';
	import HowToModerationTable from './_components/how-to-moderation-table.svelte';

	export let data;
</script>

<Tabs.Content value="how-to" class="mt-8 flex flex-col gap-y-4">
	<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
		<Input placeholder="Search..." class="flex-1 sm:max-w-64"></Input>
		<TagFilterButton />
	</div>
	<HowToModerationTable howTos={data.howTos} updateModerationForm={data.updateModerationForm} />
</Tabs.Content>
