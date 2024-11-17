<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import GuideForm from '../_components/guide-form.svelte';
	export let data;
</script>

<MetaTags title="Create Guide" description="Create a new guide and share it with the community" />

<PageHeader title="Create Guide" subtitle="Create a new guide and share it with the community" />
<div class="container mx-auto mb-20">
	<GuideForm data={data.createForm} />
</div>
