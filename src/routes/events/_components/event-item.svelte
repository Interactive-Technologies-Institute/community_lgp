<script lang="ts">
	import { Card } from '@/components/ui/card';
	import type { Event } from '@/types/types';
	import dayjs from 'dayjs';

	export let event: Event;

	$: date = dayjs(event.date);
</script>

<a href="/events/{event.id}">
	<Card class="flex max-w-full flex-row items-center gap-x-4 px-4 py-4">
		<p class="px-8 text-center text-2xl font-bold">
			{date.format('DD')}
			<br />
			{date.format('MMM')}
		</p>
		<div class="min-w-0 flex-1">
			<h2 class="pb-1 text-lg font-medium">{event.title}</h2>
			<p class="truncate text-muted-foreground">{event.description}</p>
		</div>
	</Card>
</a>
