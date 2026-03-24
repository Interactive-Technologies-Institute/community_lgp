<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import PasswordForm from './_components/password-form.svelte';

	export let data;
</script>

<MetaTags title="Configurações" description="Altere as suas configurações." />

<PageHeader title="Configurações" subtitle="Altere as suas configurações." />

<div class="container mb-20 flex flex-col gap-y-8 md:gap-y-10">
	<PasswordForm data={data.updatePassword} />
</div>