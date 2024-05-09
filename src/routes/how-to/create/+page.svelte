<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import HowToForm from '../_components/how-to-form.svelte';

	export let data;
</script>

<PageHeader title="How to" subtitle="Create a new how to and share it with the community" />
<div class="container mx-auto mb-20">
	<HowToForm data={data.createForm} />
</div>
