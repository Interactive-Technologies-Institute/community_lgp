<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import ProfileForm from './_components/profile-form.svelte';

	export let data;
</script>

<MetaTags title="Editar Perfil" description="Edite o seu perfil." />

<PageHeader title="Editar Perfil" subtitle="Edite o seu perfil." />
<div class="container mb-20 flex flex-col gap-y-8 md:gap-y-10">
	<ProfileForm data={data.updateProfile} />
</div>
