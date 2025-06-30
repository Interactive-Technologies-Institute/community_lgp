<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '@/components/page-header.svelte';
	import * as Tabs from '@/components/ui/tabs';
	import { MetaTags } from 'svelte-meta-tags';

	$: path = $page.url.pathname.split('/').pop();
</script>

<MetaTags title="Moderação" description="Modere utilizadores e conteúdo" />

<PageHeader title="Moderação" subtitle="Modere utilizadores e conteúdo" />
<div class="container mx-auto mb-20">
	<Tabs.Root value={path}>
		<Tabs.List>
			<Tabs.TriggerLink href="/moderation/signs" value="signs">Gestos</Tabs.TriggerLink>
			<Tabs.TriggerLink href="/moderation/users" value="users">Utilizadores</Tabs.TriggerLink>
			<Tabs.TriggerLink href="/moderation/guides" value="guides">Guias</Tabs.TriggerLink>
			<Tabs.TriggerLink href="/moderation/events" value="events">Eventos</Tabs.TriggerLink>
			<Tabs.TriggerLink href="/moderation/map" value="map">Mapa</Tabs.TriggerLink>
		</Tabs.List>
		<slot />
	</Tabs.Root>
</div>
