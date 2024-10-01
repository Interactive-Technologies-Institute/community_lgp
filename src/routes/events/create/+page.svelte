<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import EventForm from '../_components/event-form.svelte';
	export let data;
</script>

<MetaTags
	title="Create Event"
	description="Create a new event to and share it with the community"
/>

<PageHeader title="Create Event" subtitle="Create a new event to and share it with the community" />
<div class="container mx-auto mb-20">
	<EventForm data={data.createForm} />
</div>
