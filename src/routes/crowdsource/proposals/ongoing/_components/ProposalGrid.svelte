<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Sign } from '@/types/types';
	import * as Avatar from '@/components/ui/avatar';
	import { firstAndLastInitials } from '@/utils';
	export let signs: Sign[];
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
	{#each signs as sign (sign.id)}
		<Card.Root class="rounded-2xl">
			<Card.Content class="flex items-center justify-center p-3">
				<div class="flex w-full flex-col">
					<video class="aspect-video w-full rounded-xl" controls muted>
						<source src={sign.video} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
					<a href="/dictionary/sign/{sign.id}" class="pt-4 text-lg">{sign.name}</a>
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
	{/each}
</div>
