<script lang="ts">

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { Sign } from '@/types/types';
	import Badge from '@/components/ui/badge/badge.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { firstAndLastInitials } from '@/utils';
	import { goto } from '$app/navigation';
	import { Button } from '@/components/ui/button';
	import { Plus } from 'lucide-svelte';

    export let signs: Sign[];

	let sign;
	$: sign;

	
</script>

<div class="flex flex-col items-start justify-start">
	<Carousel.Root
		opts={{
			align: 'start',
		}}
		class="w-full max-w-[1250px]"
	>
		<Carousel.Content>
			{#each signs as sign}
				<Carousel.Item class="md:basis-2/3 lg:basis-1/4">
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
                                    <!-- Add user info here -->
                                    {#if sign.user}
                                        <div class="flex items-center gap-3 pt-3">
                                            
                                                <Avatar.Root>
                                                    <Avatar.Image
                                                src={sign.user.avatar}
                                                alt="{sign.user.display_name}'s avatar"
                                            />
                                                <Avatar.Fallback
                                                    >{firstAndLastInitials(sign.user.display_name)}</Avatar.Fallback
                                                >
                                                </Avatar.Root>
                                            
                                                
                                            
                                            <span class="text-sm text-gray-600">{sign.user.display_name}</span>
                                        </div>
                                    {/if}
								</div>
							</Card.Content>
						</Card.Root>
					</div>
				</Carousel.Item>
			{/each}
			<Carousel.Item class="md:basis-2/3 lg:basis-1/4">
                    <div class="p-1">
						<a href='/crowdsource/proposals/ongoing/' class="block w-full h-full no-underline">
                        <Card.Root class="rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                            <Card.Content class="flex items-center justify-center p-3 min-h-[300px]">
                                <div class="flex flex-col items-center justify-center text-center space-y-4">
                                    <!-- Icon -->
                                    <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Plus class="text-primary"></Plus>
                                    </div>
                                    
                                    <!-- Text -->
                                    <div class="space-y-2">
                                        <h3 class="text-lg font-semibold text-gray-800">Ver todas as propostas</h3>
                                        <p class="text-sm text-gray-600">Explore todas as propostas da comunidade</p>
                                    </div>
                                    
                                    <!-- Button -->
                                    <div class="pt-2">
                                        <Button>Ver mais</Button>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card.Root>
						</a>
                    </div>
                </Carousel.Item>
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
