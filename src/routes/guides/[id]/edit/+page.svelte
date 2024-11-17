<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import GuideForm from '../../_components/guide-form.svelte';
	export let data;
</script>

<MetaTags title="Edit Guide" description="Edit this guide" />

<PageHeader title="Edit Guide" subtitle="Edit this guide" />
<div class="container mx-auto mb-20">
	<GuideForm data={data.updateForm} />
</div>
