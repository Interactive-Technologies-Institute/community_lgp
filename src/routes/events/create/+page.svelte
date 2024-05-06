<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import EventForm from '../_components/event-form.svelte';

	export let data;
</script>

<PageHeader title="Event" subtitle="Create a new event to and share it with the community" />
<div class="container mx-auto mb-20">
	<EventForm data={data.createForm} />
</div>
