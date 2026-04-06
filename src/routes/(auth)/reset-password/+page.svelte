<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import ResetPasswordForm from './_components/reset-password-form.svelte';

	export let data;
</script>

<MetaTags title="Redefinir a palavra-passe" description="Redefina a sua palavra-passe." />

<PageHeader title="Redefinir a palavra-passe" subtitle="Redefina a sua palavra-passe." />

<div class="container mb-20 flex flex-col gap-y-8 md:gap-y-10">
	<ResetPasswordForm data={data.resetPassword} />
</div>