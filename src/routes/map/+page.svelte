<script lang="ts">
	import ModerationBanner from '@/components/moderation-banner.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import Card from '@/components/ui/card/card.svelte';
	import * as Select from '@/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { CircleUser, Store } from 'lucide-svelte';
	import type { Writable } from 'svelte/store';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import AddEditPinButton from './_components/add-edit-pin-button.svelte';
	import Map from './_components/map.svelte';
	import Marker from './_components/marker.svelte';
	import MyPinButton from './_components/my-pin-button.svelte';

	export let data;

	const lng = queryParam('lng', ssp.number(-9.469218750000001), {
		debounceHistory: 1000,
	}) as Writable<number>;
	const lat = queryParam('lat', ssp.number(38.7376572), {
		debounceHistory: 1000,
	}) as Writable<number>;
	const zoom = queryParam('zoom', ssp.number(6), {
		debounceHistory: 1000,
	}) as Writable<number>;

	let selectedUserType: Selected<string> | undefined;
	$: filteredUsers = data.users.filter((user) => {
		return selectedUserType ? user.type === selectedUserType.value : true;
	});
</script>

<div class="relative h-screen">
	<Map bind:lng={$lng} bind:lat={$lat} bind:zoom={$zoom}>
		{#each filteredUsers as user (user.id)}
			{#if user?.pin}
				<Marker lng={user.pin.lng} lat={user.pin.lat}>
					<div class="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-foreground">
						<img src="/avatars/user.png" alt="User avatar" class="aspect-square h-full w-full" />
					</div>
					<div slot="popup">
						<Card class="w-52">
							<div class="flex aspect-video items-center justify-center">
								<Avatar.Root class="h-20 w-20">
									<Avatar.Image src="/avatars/user.png" alt={user.display_name} />
								</Avatar.Root>
							</div>
							<div class="flex flex-col items-start gap-y-2 px-4 py-3">
								<Button variant="secondary" size="sm" href="/user/0">
									<CircleUser class="mr-2 h-4 w-4" />
									{user.display_name}
								</Button>
								<p>{user.description}</p>
							</div>
						</Card>
					</div>
				</Marker>
			{/if}
		{/each}
		<Marker lat={38.7341425} lng={-9.1246718}>
			<div
				class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary"
			>
				<Store class="h-5 w-5 text-primary-foreground" />
			</div>
		</Marker>
		<div
			class="container absolute left-0 right-0 top-6 flex flex-col items-center gap-y-4 md:top-10"
		>
			<div class="flex justify-center">
				<Select.Root
					selected={selectedUserType}
					onSelectedChange={(s) => {
						selectedUserType = s;
					}}
				>
					<Select.Trigger class="w-52 bg-background">
						<Select.Value placeholder="Filter by type" />
					</Select.Trigger>
					<Select.Content>
						{#each data.userTypes as userType}
							<Select.Item value={userType.slug}>{userType.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			{#if data.moderation && data.moderation[0].status !== 'approved'}
				<ModerationBanner moderation={data.moderation} />
			{/if}
			<div class="flex flex-row gap-x-6">
				{#if data.profile?.pin}
					<MyPinButton pin={data.profile.pin} />
				{/if}
				<AddEditPinButton data={data.form} />
			</div>
		</div>
	</Map>
</div>
