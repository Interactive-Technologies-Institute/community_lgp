<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import BrandingForm from './_components/branding-form.svelte';
	import FeaturesForm from './_components/features-form.svelte';
	import UserTypesForm from './_components/user-types-form.svelte';

	export let data;
</script>

<MetaTags title="Painel de Administrador" description="Ajuste as configurações da plataforma" />

<PageHeader title="Painel de Administrador" subtitle="Ajuste as configurações da plataforma" />
<div class="container mb-20 flex flex-col gap-y-8 md:gap-y-10">
	<FeaturesForm data={data.updateFeatures} />
	<BrandingForm data={data.updateBranding} />
	<UserTypesForm data={data.updateUserTypes} />
</div>
