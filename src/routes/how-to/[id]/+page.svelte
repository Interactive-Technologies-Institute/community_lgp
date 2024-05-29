<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import Card from '@/components/ui/card/card.svelte';
	import { cn } from '@/utils';
	import {
		BarChart2,
		Bookmark,
		CircleUser,
		Clock,
		Footprints,
		Pen,
		Tag,
		Trash,
	} from 'lucide-svelte';
	import HowToDeleteDialog from './_components/how-to-delete-dialog.svelte';

	export let data;

	let openDeleteDialog = false;
</script>

<PageHeader title={data.howTo.title} subtitle={data.howTo.description} />
<div class="container mx-auto pb-10">
	<div class="mb-10 flex flex-col items-center gap-y-4">
		<div class=" flex flex-row gap-x-2">
			{#each data.howTo.tags as tag}
				<Button variant="secondary" size="sm" href="/user/0">
					<Tag class="mr-2 h-4 w-4" />
					{tag}
				</Button>
			{/each}
		</div>
		<div class="flex flex-col items-center gap-y-2">
			<div class="flex flex-row items-center justify-center gap-x-4">
				<div class="flex flex-row items-center gap-x-2">
					<Footprints class="text-muted-foreground" />
					{data.howTo.steps.length}
				</div>
				<div class="flex flex-row items-center gap-x-2">
					<Clock class="text-muted-foreground" />
					{data.howTo.duration}
				</div>
				<div class="flex flex-row items-center gap-x-2">
					<BarChart2 class="text-muted-foreground" />
					{data.howTo.difficulty}
				</div>
			</div>
		</div>
		<Button variant="outline" size="sm" href="/how-to/create">
			<Bookmark class={cn('mr-2 h-4 w-4', { 'fill-foreground': data.usefulCount.userUseful })} />
			{#if data.usefulCount.userUseful}
				Marked as useful
			{:else}
				Mark as useful
			{/if}
			<span class="ml-4 font-mono text-xs">{data.usefulCount.count}</span>
		</Button>
	</div>
	<div class="flex flex-col gap-y-10">
		{#each data.howTo.steps as step, i}
			<div class="flex flex-row gap-x-6">
				<Card class="flex h-fit w-32 items-center justify-center py-4">
					<span class="text-2xl font-medium">{i + 1}</span>
				</Card>
				<Card class="grid w-full grid-cols-2">
					<div class="px-6 py-5">
						<h2 class="mb-2 text-2xl font-medium">{step.title}</h2>
						<p>{step.description}</p>
					</div>
					<img src={step.image} />
				</Card>
			</div>
		{/each}
	</div>
	{#if data.howTo.user_id === data.user?.id}
		<div
			class="sticky bottom-0 flex w-full flex-row items-center justify-center gap-x-10 border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<Button variant="outline" href="/how-to/{data.howTo.id}/edit">
				<Pen class="mr-2 h-4 w-4" />
				Edit
			</Button>
			<Button variant="destructive" on:click={() => (openDeleteDialog = true)}>
				<Trash class="mr-2 h-4 w-4" />
				Delete
			</Button>
		</div>
	{/if}
	<div class="flex flex-col items-center gap-y-2">
		<span class="text-sm text-muted-foreground">Updated on dd/mm/yyyy</span>
		<Button variant="secondary" size="sm" href="/user/0">
			<CircleUser class="mr-2 h-4 w-4" />
			User Lorem Ipsum
		</Button>
	</div>
</div>

<HowToDeleteDialog howToId={data.howTo.id} data={data.deleteForm} bind:open={openDeleteDialog} />
