<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import AcceptInviteForm from './_components/accept-invite-form.svelte';

	export let data;
</script>

<MetaTags title="Aceitar convite" description="Crie a sua conta de contribuidor." />

<PageHeader title="Foi convidado para ser contribuidor" subtitle="Escolha um nome e uma palavra-passe para concluir a criação da sua conta." />

<div class="container mb-20 flex flex-col gap-y-8 md:gap-y-10">
	<AcceptInviteForm data={data.acceptInvite} />
</div>
