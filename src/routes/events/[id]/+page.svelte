<script lang="ts">
	import InteractableImage from '@/components/interactable-image.svelte';
	import ModerationBanner from '@/components/moderation-banner.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import dayjs from 'dayjs';
	import { Calendar, CircleUser, MapPin, Pen, Tag, Trash } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import EventDeleteDialog from './_components/event-delete-dialog.svelte';
	import EventInterestButton from './_components/event-interest-button.svelte';

	export let data;

	let openDeleteDialog = false;
</script>

<MetaTags title={data.event.title} description={data.event.description} />

<PageHeader title={data.event.title} subtitle={data.event.description} />
<div class="container mx-auto space-y-10 pb-10">
	{#if data.moderation[0].status !== 'approved'}
		<ModerationBanner moderation={data.moderation} />
	{/if}
	<div class="flex flex-col items-center gap-y-4">
		<div class="flex flex-row gap-x-4">
			<div class="flex flex-row items-center gap-x-2">
				<Calendar class="text-muted-foreground" />
				{dayjs(data.event.date).format(
					dayjs(data.event.date).year() === dayjs().year()
						? 'ddd, MM/DD [at] HH:mm'
						: 'ddd, MM/DD/YYYY [at] HH:mm'
				)}
			</div>
			<div class="flex flex-row items-center gap-x-2">
				<MapPin class="text-muted-foreground" />
				{data.event.location}
			</div>
		</div>
		<EventInterestButton count={data.interestCount} data={data.toggleInterestForm} />
	</div>
	<div class="mx-auto flex max-w-2xl flex-col gap-y-4">
		<InteractableImage
			src={data.event.image}
			alt="Event Cover"
			class="aspect-[3/2] h-auto w-full rounded-md object-cover"
		/>
		<p>{data.event.description}</p>
		<div class=" flex flex-row gap-x-2">
			{#each data.event.tags as tag}
				<Button variant="secondary" size="sm" href="/events?tags={tag}">
					<Tag class="mr-2 h-4 w-4" />
					{tag}
				</Button>
			{/each}
		</div>
	</div>
	<div class="flex flex-col items-center gap-y-2">
		<span class="text-sm text-muted-foreground">
			Updated on {dayjs(data.event.updated_at).format('YYYY-MM-DD [at] HH:mm')}
		</span>
		<Button variant="secondary" size="sm" href="/users/{data.event.author.id}">
			<CircleUser class="mr-2 h-4 w-4" />
			{data.event.author.display_name}
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
