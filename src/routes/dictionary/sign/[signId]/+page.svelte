<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';
	import type { CSComment, Sign } from '@/types/types';
	import AnnotationShowcase from '../../../../lib/components/dictionary/AnnotationShowcase.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Card from '@/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { firstAndLastInitials } from '@/utils';
	import { MetaTags } from 'svelte-meta-tags';
	import DistrictMap from './_components/DistrictMap.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import * as Accordion from '@/components/ui/accordion';
	import { Smile } from 'lucide-svelte';
	import { Meh } from 'lucide-svelte';
	import { Frown } from 'lucide-svelte';
	import SignRatingButton from './_components/SignRatingButton.svelte';
	import { formatDistanceToNow } from 'date-fns';
	import { pt } from 'date-fns/locale';
	import CommentForm from './_components/comment-form.svelte';
	export let data;
	export let sign: Sign | null = data.sign;
	let createdByUser = data.created_by_user;
	let annotatedByUser = data.annotated_by_user;
	let posts: CSComment[] | null = data.posts;
	let mainSign = data.mainSign;
	let signVariants = data.signVariants ?? [];

	function goToUserProfile(id: string) {
		goto(`/users/${id}`);
	}

	console.log(data.posts)

	function capitalize(district: string) {
		return district[0].toUpperCase() + district.slice(1);
	}

	function formatCommentDate(dateString: string) {
	return formatDistanceToNow(new Date(dateString), { 
		addSuffix: true, 
		locale: pt 
	});
}

	let district = capitalize(sign?.district ?? 'Geral');
</script>

{#if sign}
	<MetaTags
		title={sign.name}
		description={`Página do gesto ${sign.name}`}
		openGraph={{
			title: sign.name,
			description: `Página do gesto ${sign.name}`,
		}}
		twitter={{
			cardType: 'summary_large_image',
			title: sign.name,
			description: `Página do gesto ${sign.name}`,
		}}
	/>

	<!-- svelte-ignore a11y-media-has-caption -->
	<div class="mx-72 flex justify-start gap-8 py-10">
		<div class="flex w-[600px] flex-col space-y-4">
			<video class="h-auto w-full rounded-2xl" controls playsinline>
				<source src={sign?.video} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<AnnotationShowcase data={data.parameters} />

			{#if sign?.context_video}
				<video class="h-auto w-full rounded-2xl" controls playsinline>
					<source src={sign?.context_video} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			{/if}
		</div>

		<div class="ml-10 flex flex-col justify-start">
			<h1 class="text-2xl font-bold">{sign?.name}</h1>

			<h2 class="mt-2 text-lg">
				{#if sign?.theme}
					{#each sign?.theme as t}
						<Badge variant="outline" class="m-1">{t}</Badge>
					{/each}
				{:else}
					Sem temas atribuídos.
				{/if}
			</h2>

			<h2 class="my-2 text-lg">
				{#if sign?.district}
					<div class="flex items-center justify-start">
						{#if mainSign}
							<div class="flex flex-col">
								<div class="text-sm">
									Esta entrada de gesto é uma variante do gesto
									<a
										href={`/dictionary/sign/${mainSign.id}`}
										class="cursor-pointer text-primary hover:underline"
										rel="external"
									>
										{mainSign.name}
									</a>
								</div>
								<div class="text-sm">
									relativa ao distrito de:
									<div class="flex items-center space-x-2 py-2">
										<DistrictMap {district} />
										<Badge variant="outline" class="px-2 py-1">
											{district}
										</Badge>
									</div>
								</div>
							</div>
						{:else}
							<div class="flex flex-col">
								<div class="flex items-center space-x-2 py-2">
									<DistrictMap {district} />
									<Badge variant="outline" class="px-2 py-1">
										{district}
									</Badge>
								</div>
								{#if signVariants.length >= 1}
									<Accordion.Root>
										<Accordion.Item value="item-1">
											<Accordion.Trigger>Variantes</Accordion.Trigger>
											<Accordion.Content>
												<Carousel.Root
													opts={{
														align: 'start',
													}}
													class="w-full max-w-[1250px]"
												>
													<Carousel.Content>
														{#each signVariants as sign (sign.id)}
															<Carousel.Item class="">
																<div class="p-1">
																	<Card.Root class="rounded-2xl">
																		<!-- svelte-ignore a11y-media-has-caption -->
																		<Card.Content class="flex  items-center justify-center p-3">
																			<div class="flex flex-col">
																				<video
																					class="aspect-video w-full rounded-xl"
																					controls
																					muted
																				>
																					<source src={sign.video} type="video/mp4" />
																					Your browser does not support the video tag.
																				</video>

																				<a
																					href="/dictionary/sign/{sign.id}"
																					rel="external"
																					class="text-l py-5 pt-9">{sign.name}</a
																				>

																				<Badge class="w-fit" variant="outline"
																					>{sign.district}</Badge
																				>
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
											</Accordion.Content>
										</Accordion.Item>
									</Accordion.Root>
								{/if}
							</div>
						{/if}
					</div>
				{:else}
					<div class="flex flex-col">
						<div class="flex items-center space-x-2 py-2">
							<DistrictMap {district} />
							<Badge variant="outline" class="px-2 py-1">
								{district}
							</Badge>
						</div>
						{#if signVariants.length >= 1}
							<Accordion.Root>
								<Accordion.Item value="item-1">
									<Accordion.Trigger>Variantes</Accordion.Trigger>
									<Accordion.Content>
										<Carousel.Root
											opts={{
												align: 'start',
											}}
											class="w-full max-w-[1250px]"
										>
											<Carousel.Content>
												{#each signVariants as sign (sign.id)}
													<Carousel.Item class="">
														<div class="p-1">
															<Card.Root class="rounded-2xl">
																<!-- svelte-ignore a11y-media-has-caption -->
																<Card.Content class="flex  items-center justify-center p-3">
																	<div class="flex flex-col">
																		<video class="aspect-video w-full rounded-xl" controls muted>
																			<source src={sign.video} type="video/mp4" />
																			Your browser does not support the video tag.
																		</video>

																		<a
																			href="/dictionary/sign/{sign.id}"
																			rel="external"
																			class="text-l py-5 pt-9">{sign.name}</a
																		>

																		<Badge class="w-fit" variant="outline">{sign.district}</Badge>
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
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>
						{/if}
					</div>
				{/if}
			</h2>
			<Card.Root class="rounded-3xl px-3 py-2">
				<div class="flex items-start justify-start">
					{#if createdByUser}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<h3 class="flex items-center gap-2 text-sm">
							Gesto criado por:
							<Avatar.Root class="rounded-3xl">
								<Avatar.Image
									src={createdByUser.avatar}
									alt="{createdByUser.display_name}'s avatar"
								/>
								<Avatar.Fallback>{firstAndLastInitials(createdByUser.display_name)}</Avatar.Fallback
								>
							</Avatar.Root>
							<span
								on:click={() => goToUserProfile(createdByUser.id)}
								class="cursor-pointer text-primary hover:underline"
							>
								{createdByUser?.display_name}
							</span>
						</h3>
					{/if}
					<div class="flex items-start justify-start px-3">
						{#if createdByUser && annotatedByUser}
							<Separator orientation="vertical" class="h-10" />
						{/if}
					</div>

					{#if annotatedByUser}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<h3 class="flex items-center gap-2 text-sm">
							Gesto anotado por:
							<Avatar.Root class="rounded-3xl">
								<Avatar.Image
									src={annotatedByUser.avatar}
									alt="{annotatedByUser.display_name}'s avatar"
								/>
								<Avatar.Fallback
									>{firstAndLastInitials(annotatedByUser.display_name)}</Avatar.Fallback
								>
							</Avatar.Root>
							<span
								on:click={() => goToUserProfile(annotatedByUser.id)}
								class="cursor-pointer text-primary hover:underline"
							>
								{annotatedByUser?.display_name}
							</span>
						</h3>
					{/if}
				</div>
			</Card.Root>

			<div class="my-5">
				<Card.Root class="p-0 rounded-2xl">
					<Card.Content class="mt-5">
						<SignRatingButton data={data.toggleRatingForm} currentValue={data.currentRating} positiveNumber={data.numberOfPositives} />
					</Card.Content>
			</Card.Root>
				</div>
			<h2 class="mt-[360px] text-xl">
				{#if sign?.description}
					{sign?.description}
				{/if}
			</h2>

			<h2 class="mt-[300px] text-xl">
				{#if sign?.sentence}
					{sign?.sentence}
				{/if}
			</h2>
		</div>
		{#if sign.district == null || sign?.district == 'geral'}
			<Button
				on:click={() => goto(`${sign.id}/create`)}
				class=" w-10 p-0 sm:w-auto sm:px-4 sm:py-2"
			>
				<PlusCircle class="h-4 w-4 sm:mr-2" />
				<span>Propor variante de gesto</span>
			</Button>
		{/if}
	</div>

<div class="flex items-center justify-center py-5">
	<div class="w-full max-w-4xl">
		<Collapsible.Root>
			<Collapsible.Trigger class="flex w-full items-center justify-center space-x-2">
				<div class="flex items-center space-x-2">
					<Separator class="w-16" />
					<span>Comentários ({posts?.length || 0})</span>
					<Separator class="w-16" />
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content class="w-full py-5 transition-all duration-300">
				<!-- Comment Form -->
				<div class="mb-8 flex justify-center">
					<CommentForm signId={sign?.id?.toString() || ''} />
				</div>

				<!-- Comments List -->
				<div class="space-y-4">
					{#if posts && posts.length > 0}
						{#each posts as comment}
							<Card.Root class="w-full">
								<Card.Content class="p-4">
									<div class="flex items-start space-x-4">
										<!-- User Avatar -->
										<Avatar.Root class="w-10 h-10">
											<Avatar.Image 
												src={comment.user?.avatar} 
												alt={comment.user?.display_name || 'User'} 
											/>
											<Avatar.Fallback>
												{comment.user?.display_name?.[0] || 'U'}
											</Avatar.Fallback>
										</Avatar.Root>

										<div class="flex-1">
											<!-- User Info -->
											<div class="flex items-center space-x-2 mb-2">
												<span class="font-medium text-sm">
													{comment.user?.display_name || 'Utilizador Anónimo'}
												</span>
												<span class="text-xs text-gray-500">
													{formatCommentDate(comment.created_at)}
												</span>
												{#if comment.last_edited_at !== comment.created_at}
													<span class="text-xs text-gray-400">(editado)</span>
												{/if}
											</div>

											<!-- Comment Content -->
											<div class="space-y-2">
												{#if comment.content_text}
													<p class="text-sm leading-relaxed whitespace-pre-wrap">
														{comment.content_text}
													</p>
												{/if}

												{#if comment.content_video}
													<!-- svelte-ignore a11y-media-has-caption -->
													<video 
														class="w-full max-w-md rounded-lg"
														controls
														preload="metadata"
													>
														<source src={comment.content_video} type="video/mp4" />
														<source src={comment.content_video} type="video/webm" />
														O seu navegador não suporta vídeos.
													</video>
												{/if}
											</div>
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						{/each}
					{:else}
						<div class="text-center py-8">
							<p class="text-gray-500 mb-4">Este gesto ainda não tem comentários.</p>
							<p class="text-sm text-gray-400">Seja o primeiro a partilhar a sua opinião!</p>
						</div>
					{/if}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</div>
</div>
{/if}
