<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '@/components/ui/avatar';
	import { firstAndLastInitials } from '@/utils';
	import dayjs from 'dayjs';
	export let signs;
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
					<div class="mt-2 flex flex-wrap gap-2">
						{#if sign.user}
							<div class="flex items-center gap-3 pt-3">
								<Avatar.Root>
									<Avatar.Image src={sign.user.avatar} alt="{sign.user.display_name}'s avatar" />
									<Avatar.Fallback>{firstAndLastInitials(sign.user.display_name)}</Avatar.Fallback>
								</Avatar.Root>

								<span class="text-sm text-gray-600">{sign.user.display_name}</span>
								<div class="flex flex-col items-start justify-start pl-6">
									<span class="text-sm text-gray-600"
										>Número total de comentários: {sign.total_comments}</span
									>
									<span class="text-sm text-gray-600"
										>Número total de votos: {sign.positive_votes + sign.negative_votes}</span
									>
								</div>
							</div>
							<span class="my-1 text-sm text-gray-700 underline"
								>Submetido a {dayjs(signs.created_at).format('DD/MM/YY')}</span
							>
						{/if}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
