<script lang="ts">
	import ModerationBanner from '@/components/moderation-banner.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import dayjs from 'dayjs';
	import { Calendar, CircleUser, MapPin, Pen, Tag, Trash } from 'lucide-svelte';
	import EventDeleteDialog from './_components/event-delete-dialog.svelte';
	import EventInterestButton from './_components/event-interest-button.svelte';

	export let data;

	let openDeleteDialog = false;
</script>

<PageHeader
	title={data.event.title}
	subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
/>
<div class="container mx-auto space-y-10 pb-10">
	{#if data.moderation.status !== 'approved'}
		<ModerationBanner moderation={data.moderation} />
	{/if}
	<div class="mb-10 flex flex-col items-center gap-y-4">
		<div class=" flex flex-row gap-x-2">
			{#each data.event.tags as tag}
				<Button variant="secondary" size="sm" href="/user/0">
					<Tag class="mr-2 h-4 w-4" />
					{tag}
				</Button>
			{/each}
		</div>
		<div class="flex flex-col items-center gap-y-2">
			<div class="flex flex-row items-center justify-center gap-x-4">
				<div class="flex flex-row items-center gap-x-2">
					<Calendar class="text-muted-foreground" />
					{dayjs(data.event.date).format('YYYY-MM-DD HH:mm:ss')}
				</div>
				<div class="flex flex-row items-center gap-x-2">
					<MapPin class="text-muted-foreground" />
					{data.event.location}
				</div>
			</div>
		</div>
		<EventInterestButton count={data.interestCount} data={data.toggleInterestForm} />
		<div class="mt-4 flex flex-col gap-y-4">
			<img src={data.event.image} alt="Event Cover" class="aspect-video max-w-[40rem] rounded-md" />
			<p class="max-w-[40rem]">
				{data.event.description}
			</p>
		</div>
	</div>
	<div class="flex flex-col items-center gap-y-2">
		<span class="text-sm text-muted-foreground">Updated on dd/mm/yyyy</span>
		<Button variant="secondary" size="sm" href="/user/0">
			<CircleUser class="mr-2 h-4 w-4" />
			User Lorem Ipsum
		</Button>
	</div>
	{#if data.event.user_id === data.user?.id}
		<div
			class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<Button variant="outline" href="/events/{data.event.id}/edit">
				<Pen class="mr-2 h-4 w-4" />
				Edit
			</Button>
			<Button variant="destructive" on:click={() => (openDeleteDialog = true)}>
				<Trash class="mr-2 h-4 w-4" />
				Delete
			</Button>
		</div>
	{/if}
</div>

<EventDeleteDialog eventId={data.event.id} data={data.deleteForm} bind:open={openDeleteDialog} />
