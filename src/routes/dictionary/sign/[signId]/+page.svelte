<script lang="ts">
	export let data;
	import * as Card from '$lib/components/ui/card';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Accordion from '$lib/components/ui/accordion';
	import Badge from '@/components/ui/badge/badge.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Carousel from '$lib/components/ui/carousel';
	//ICONS//
	import { ThumbsUp } from 'lucide-svelte';
	import { ThumbsDown } from 'lucide-svelte';
	import { MessageSquareText } from 'lucide-svelte';
	import { page } from '$app/stores';

	console.log(data);
</script>

<div class="py-5">
	<Card.Root class="mx-auto w-[350px] items-center justify-center align-middle ">
		<ScrollArea>
			<div class="min-h-scree flex items-center justify-center">
				<div class="space-y-4 text-center">
					{#if data.sign}
						<Card.Header class="w-[350px] rounded-md border">
							<Card.Title class="text-3xl font-bold">
								{data.sign.name}
							</Card.Title>
							<Card.Description class="space-x-1 space-y-3 text-lg">
								Temas do gesto:
								<p></p>
								{#each data.sign.theme as tag}
									<Badge>{tag}</Badge>
								{/each}
							</Card.Description>
						</Card.Header>
						<Accordion.Root>
							<Accordion.Item value="value-1">
								<Accordion.Trigger class="flex items-center justify-center text-lg">
									Como o fazer
								</Accordion.Trigger>
								<Accordion.Content>
									<div>
										<video class="mx-auto aspect-video rounded-lg pt-2" controls>
											<track kind="captions" />
											<source src={data.sign.video} type="video/mp4" />
											Your browser does not support the video tag.
										</video>
									</div>

									<div class="mx-auto flex items-center justify-center gap-2 pb-4 pt-4">
										<div class="flex items-center gap-1">
											<span>3523</span>
											<ThumbsUp />
										</div>
										<div class="ml-4 flex items-center gap-1">
											<span>231</span>
											<ThumbsDown />
										</div>
									</div>

									<Dialog.Root>
										<Dialog.Trigger>
											<Button class="justify-right tracking-wide">
												<MessageSquareText /> 300
											</Button>
										</Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>Comentários</Dialog.Title>
												<Dialog.Description>
													<Carousel.Root
														opts={{
															align: 'start',
														}}
														class="mx-auto w-full max-w-sm"
													>
														<Carousel.Content>
															{#each Array(5) as _, i (i)}
																<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
																	<div class="p-1">
																		<Card.Root>
																			<Card.Content
																				class="flex aspect-square items-center justify-center p-6"
																			>
																				<span class="font-semibold">
																					Bastante simples e eficaz.
																				</span>
																			</Card.Content>
																		</Card.Root>
																	</div>
																</Carousel.Item>
															{/each}
														</Carousel.Content>
														<Carousel.Previous />
														<Carousel.Next />
													</Carousel.Root>
												</Dialog.Description>
											</Dialog.Header>
										</Dialog.Content>
									</Dialog.Root>

									<div class="mx-auto flex items-center justify-end pr-5 pt-4">
										Submetido por: &nbsp;
										<a
											href="http://localhost:5173/dictionary/sign/10/mockup/utilizador/"
											class="underline">utilizador</a
										>
									</div>
									<div class="mx-auto flex items-center justify-end pr-5">
										Aprovado por: &nbsp;
										<a
											href="http://localhost:5173/dictionary/sign/10/mockup/linguista/"
											class="underline">linguista</a
										>
									</div>
								</Accordion.Content>
							</Accordion.Item>
							<Accordion.Item value="value-2">
								<Accordion.Trigger class="flex items-center justify-center text-lg">
									Variações do Gesto
								</Accordion.Trigger>
								<Accordion.Content>
									<Carousel.Root
										opts={{
											align: 'start',
										}}
										class="mx-auto w-full max-w-md px-2"
									>
										<Carousel.Content>
											{#each Array(5) as _}
												<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
													<div class="p-1">
														<Card.Root>
															<Card.Content
																class="flex aspect-square items-center justify-center p-0"
															>
																<span class="flex h-full w-full">
																	<video class="h-full w-full object-cover" controls>
																		<track kind="captions" />
																		<source
																			src="https://gncgottiijvjagbqpuph.supabase.co/storage/v1/object/public/Signs/Porco.mp4?t=2024-05-31T12%3A18%3A06.046Z"
																			type="video/mp4"
																		/>
																		Your browser does not support the video tag.
																	</video>
																</span>
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
							<Accordion.Item value="value-3">
								<Accordion.Trigger class="flex items-center justify-center text-lg">
									Outras Informações
								</Accordion.Trigger>
								<Accordion.Content>
									<p class="text-lg">Sign was last changed at: {data.sign.last_changed}</p>
									<p class="text-lg">Sign was created in: {data.sign.created_at}</p>
								</Accordion.Content>
							</Accordion.Item>
						</Accordion.Root>
					{/if}
				</div>
			</div>
		</ScrollArea>
	</Card.Root>
	<div class="flex items-center justify-center py-5">
		<Button href="{$page.url.pathname}/anotate" >Anotar</Button>
	</div>
</div>
