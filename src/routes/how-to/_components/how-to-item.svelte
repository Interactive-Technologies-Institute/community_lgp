<script lang="ts">
	import { page } from '$app/stores';
	import { AspectRatio } from '@/components/ui/aspect-ratio';
	import { Card } from '@/components/ui/card';
	import type { HowTo } from '@/types/types';

	export let howTo: HowTo;

	$: imageUrl = $page.data.supabase.storage.from('howtos').getPublicUrl(howTo.image).data.publicUrl;
</script>

<a href="/how-to/{howTo.id}">
	<Card class="overflow-hidden">
		<AspectRatio ratio={4 / 3}>
			{#if imageUrl}
				<img src={imageUrl} class="object-cover" />
			{/if}
		</AspectRatio>
		<div class=" flex flex-col px-4 py-2">
			<div class="mb-5">
				<h2 class="text-lg font-medium">{howTo.title}</h2>
				<p class="text-muted-foreground">{howTo.description}</p>
			</div>
			<div class="flex gap-x-1">
				{#each howTo.tags as tag}
					<span>#{tag}</span>
				{/each}
			</div>
		</div>
	</Card>
</a>
