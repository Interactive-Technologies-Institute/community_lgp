<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import SignForm from '../../_components/sign-form.svelte';

	export let data;
</script>

<PageHeader title="Sign" subtitle="Create a new sign to and share it with the community" />
<div class="container mx-auto mb-20">
	<SignForm data={data.createForm} />
</div>
