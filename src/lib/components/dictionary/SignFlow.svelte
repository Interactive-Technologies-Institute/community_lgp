<script lang="ts">
	export let signs: Sign[];
	export let theme;
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { Sign } from '@/types/types';
	import Badge from '@/components/ui/badge/badge.svelte';

	let sign;
	$: sign;
</script>

<div class="flex flex-col items-start justify-start">
	<h1 class="py-3 pl-2 text-left text-xl">{theme}</h1>
	<Carousel.Root
		opts={{
			align: 'start',
		}}
		class="w-full max-w-[1250px]"
	>
		<Carousel.Content>
			{#each signs.filter((sign) => sign.theme.includes(theme)) as sign (sign.id)}
				<Carousel.Item class="md:basis-2/3 lg:basis-1/3">
					<div class="p-1">
						<Card.Root class="rounded-2xl">
							<!-- svelte-ignore a11y-media-has-caption -->
							<Card.Content class="flex  items-center justify-center p-3">
								<div class="flex flex-col">
									<video class="aspect-video w-full rounded-xl" controls muted>
										<source src={sign.video} type="video/mp4" />
										Your browser does not support the video tag.
									</video>

									<a href="/dictionary/sign/{sign.id}" class="text-l py-5 pt-9">{sign.name}</a>
									{#each sign.theme as t}
										{#if t}
											<Badge class="w-fit" variant="outline">{t}</Badge>
										{/if}
									{/each}
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
