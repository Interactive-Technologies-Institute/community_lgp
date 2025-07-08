<script lang="ts">
	import TagFilterButton from '@/components/tag-filter-button.svelte';
	import { Input } from '@/components/ui/input';
	import * as Tabs from '@/components/ui/tabs';
	import { arrayQueryParam, stringQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';
	import SignsModerationTable from './_components/signs-moderation-table.svelte';

	export let data;

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 500,
	});
	const theme = queryParam('theme', arrayQueryParam());
</script>

<Tabs.Content value="signs" class="mt-8 flex flex-col gap-y-4">
	<div class="flex flex-1 flex-row gap-x-2 sm:gap-x-4 md:flex-auto">
		<Input placeholder="Procurar..." class="flex-1 sm:max-w-64" bind:value={$search}></Input>
		<TagFilterButton tags={data.themes} bind:filterValues={$theme} />
	</div>
	<SignsModerationTable signs={data.signs} updateModerationForm={data.updateModerationForm} />
</Tabs.Content>
