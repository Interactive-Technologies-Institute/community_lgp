<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import * as Tabs from '@/components/ui/tabs';
	import EventsModeration from './_components/events-moderation.svelte';
	import HowToModeration from './_components/how-to-moderation.svelte';
	import MapModeration from './_components/map-moderation.svelte';
	import UsersModeration from './_components/users-moderation.svelte';
</script>

<PageHeader title="Moderation" subtitle="Moderate user content" />
<div class="container mx-auto mb-20">
	<Tabs.Root value="how-to">
		<Tabs.List>
			<Tabs.Trigger value="how-to">How To</Tabs.Trigger>
			<Tabs.Trigger value="events">Events</Tabs.Trigger>
			<Tabs.Trigger value="map">Map</Tabs.Trigger>
			<Tabs.Trigger value="users">Users</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="how-to">
			<HowToModeration />
		</Tabs.Content>
		<Tabs.Content value="events">
			<EventsModeration />
		</Tabs.Content>
		<Tabs.Content value="map">
			<MapModeration />
		</Tabs.Content>
		<Tabs.Content value="users">
			<UsersModeration />
		</Tabs.Content>
	</Tabs.Root>
</div>
