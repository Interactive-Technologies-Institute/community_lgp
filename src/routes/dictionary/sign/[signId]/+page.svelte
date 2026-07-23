<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_R2_PUBLIC_URL } from '$env/static/public';
	import Badge from '@/components/ui/badge/badge.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as Accordion from '@/components/ui/accordion';
	import * as Avatar from '@/components/ui/avatar';
	import * as Card from '@/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { Parameter, Sign, Notification, UserProfile, UserRole } from '@/types/types';
	import { firstAndLastInitials } from '@/utils';
	import { format, formatDistanceToNow } from 'date-fns';
	import { pt } from 'date-fns/locale';
	import { ArrowLeft, MessageSquare, PlusCircle, Pencil } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import CommentDisplay from './_components/CommentDisplay.svelte';
	import CommentForm from './_components/comment-form.svelte';
	import DistrictMap from './_components/DistrictMap.svelte';

	import FavoriteButton from './_components/favorite-button.svelte';
	import SignRatingButton from './_components/SignRatingButton.svelte';

	export let data;
	export let sign: Sign | null = data.sign;

	let createdByUser = data.created_by_user;
	let annotatedByUser = data.annotated_by_user;
	$: posts = data.posts;
	let mainSign = data.mainSign;
	let signVariants = data.signVariants ?? [];

	const parameterGroups: { tipo: string; label: string }[] = [
		{ tipo: 'configuracao', label: 'Configuração' },
		{ tipo: 'localizacao', label: 'Localização' },
		{ tipo: 'orientacao', label: 'Orientação' },
		{ tipo: 'movimento', label: 'Movimento' },
		{ tipo: 'expressao facial', label: 'Expressão Facial' },
	];

	$: parameterCards = parameterGroups.map((group) => ({
		...group,
		parameters: ((data.parameters ?? []) as Parameter[]).filter(
			(parameter) => parameter.tipo === group.tipo && parameter.code !== 'F000'
		),
	}));

	function goToUserProfile(id: string) {
		goto(`/users/${id}`);
	}

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		goto('/dictionary');
	}

	function capitalize(district: string) {
		return district[0].toUpperCase() + district.slice(1);
	}

	function formatCommentDate(dateString: string) {
		return formatDistanceToNow(new Date(dateString), {
			addSuffix: true,
			locale: pt,
		});
	}

	function formatTimestamp(dateString: string) {
		return format(new Date(dateString), 'dd/MM/yyyy');
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
	<div>
		<section class="rounded-b-[2rem] bg-brand-surface shadow-md">
			<div class="container mx-auto p-4">
				<Button
					variant="ghost"
					size="icon"
					class="h-10 w-10 rounded-full text-foreground hover:bg-transparent hover:text-foreground/80"
					aria-label="Voltar"
					on:click={goBack}
				>
					<ArrowLeft class="h-6 w-6" />
				</Button>

				<div class="mt-2 flex flex-col gap-5 lg:mt-6 lg:flex-row-reverse lg:gap-10">
					<!-- Sign Card -->
					<Card.Root class="w-full rounded-2xl border-brand-border bg-brand-white p-4 shadow-none">
						<div class="flex h-full flex-col gap-6 lg:gap-10">
							<!-- Sign Name + Buttons -->
							<div class="flex flex-col gap-4">
								<h1 class="font-heading text-3xl font-bold leading-none text-brand-dark md:text-4xl w-full">
									{sign?.name}
								</h1>

								<!-- Buttons -->
								<div class="flex h-full flex-col md:flex-row gap-4">
									<Button
										on:click={() => goto(`${sign.id}/create`)}
										class="mt-auto w-full rounded-lg bg-brand-blue text-brand-white hover:bg-brand-blue/90"
									>
										<PlusCircle class="mr-2 h-4 w-4" />Propor variante de gesto
									</Button>

									{#if data.user?.role === 'admin' || data.user?.role === 'moderator'}
										<Button
											on:click={() => goto(`/annotate/${sign.id}`)}
											class="mt-auto w-full rounded-lg border border-brand-blue bg-brand-white text-brand-blue hover:bg-brand-blue/20"
										>
											<Pencil class="mr-2 h-4 w-4" />Anotar gesto
										</Button>
									{/if}
								</div>
							</div>

							<!-- Themes -->
							<div class="space-y-4">
								<p class="text-base font-semibold text-brand-grey">Temas</p>
								<div class="flex flex-wrap gap-2">
									{#if sign?.theme && sign.theme.length > 0}
										{#each sign?.theme as t}
											<Badge
												variant="outline"
												class="text-brand-foreground rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-sm font-semibold dark:bg-brand-border/80"
											>
												{t}
											</Badge>
										{/each}
									{:else}
										<p class="text-sm text-brand-grey/60">Sem temas atribuídos.</p>
									{/if}
								</div>
							</div>

							<!-- District -->
							<div class="space-y-4 lg:pt-4">
								{#if sign?.district}
									{#if mainSign}
										<p class="pt-5 text-sm leading-relaxed text-brand-grey">
											Esta entrada é uma variante do gesto
											<a
												href={`/dictionary/sign/${mainSign.id}`}
												class="font-semibold text-brand-blue hover:underline"
												rel="external"
											>
												{mainSign.name}
											</a>
											relativa ao distrito de
										</p>
									{:else}
										<p class="text-base font-semibold text-brand-grey">Este gesto é usado em</p>
									{/if}
									<Badge
										variant="outline"
										class="text-brand-foreground rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-sm font-semibold dark:bg-brand-border/80"
									>
										{district}
									</Badge>
									<div class="flex justify-center">
										<DistrictMap {district} />
									</div>
								{/if}
							</div>

							<!-- Variants -->
							{#if signVariants.length >= 1}
								<div class="flex flex-1 space-y-2">
									<Accordion.Root class="px-3">
										<Accordion.Item value="variants" class="border-0">
											<Accordion.Trigger class="font-semibold">
												Variantes deste gesto
											</Accordion.Trigger>
											<Accordion.Content>
												<Carousel.Root
													opts={{
														align: 'start',
													}}
													class="w-full"
												>
													<Carousel.Content>
														{#each signVariants as sign (sign.id)}
															<Carousel.Item class="basis-full">
																<Card.Root
																	class="w-full rounded-lg border-brand-border shadow-none"
																>
																	<!-- svelte-ignore a11y-media-has-caption -->
																	<Card.Content class="flex w-full items-center justify-center p-3">
																		<div class="flex flex-col gap-4">
																			<video class="aspect-video w-full rounded-lg" controls muted>
																				<source src={sign.video} type="video/mp4" />
																				Your browser does not support the video tag.
																			</video>

																			<a
																				href="/dictionary/sign/{sign.id}"
																				rel="external"
																				class="text-lg font-medium">{sign.name}</a
																			>

																			<Badge
																				class="w-fit rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-sm font-semibold dark:bg-brand-border/80"
																				variant="outline">{sign.district}</Badge
																			>
																		</div>
																	</Card.Content>
																</Card.Root>
															</Carousel.Item>
														{/each}
													</Carousel.Content>
													<Carousel.Previous />
													<Carousel.Next />
												</Carousel.Root>
											</Accordion.Content>
										</Accordion.Item>
									</Accordion.Root>
								</div>
							{/if}

							<!-- Community actions -->
							<div class="space-y-3 flex flex-1 items-end">
								<div class="grid grid-cols-1 gap-5 sm:grid-cols-[2fr_1fr]">
									{#if sign.theme_flattened.includes('Proposta')}
										<SignRatingButton
											data={data.toggleRatingForm}
											currentValue={data.currentRating}
											positiveNumber={data.numberOfPositives ?? 0}
											negativeNumber={data.numberOfNegatives ?? 0}
										/>
									{/if}
									<FavoriteButton
										count={data.numberOfFavorites ?? 0}
										data={data.toggleSignFavoriteForm}
									/>
								</div>
							</div>
							
						</div>
					</Card.Root>

					<!-- Video + Parameters -->
					<div class="flex flex-col space-y-16 w-full">
						<!-- svelte-ignore a11y-media-has-caption -->
						<video
							class="aspect-video w-full rounded-2xl bg-brand-border object-contain shadow-sm"
							controls
							playsinline
						>
							<source src={sign?.video} type="video/mp4" />
							Your browser does not support the video tag.
						</video>

						<!-- Parameters -->
						{#if !sign?.theme_flattened?.includes('Proposta')}
							<div class="relative mt-20 space-y-2">
								<img
									src="/branding/curve-yellow.svg"
									alt="Curve Yellow"
									class="absolute -top-10 h-12 w-12"
								/>
								<h2
									class="pb-5 text-3xl font-bold leading-none text-brand-dark dark:text-foreground"
								>
									Parâmetros do gesto
								</h2>
								<div class="grid grid-cols-3 gap-3 lg:grid-cols-5">
									{#each parameterCards as group}
										<Card.Root class="rounded-2xl border-brand-border bg-brand-white p-3 shadow-sm">
											<div class="flex items-center justify-center pb-4 text-center">
												<p class="font-semibold text-brand-grey">{group.label}</p>
											</div>
											<div class="flex flex-wrap items-center justify-center gap-3">
												{#if group.parameters && group.parameters.length > 0}
													{#each group.parameters as parameter}
														{#if parameter?.image}
															<img
																src={parameter?.image}
																alt={parameter?.name ?? group.label}
																class="aspect-square h-24 w-24"
															/>
														{:else}
															<p class="text-center text-sm text-brand-grey">
																{parameter.name ?? parameter.code}
															</p>
														{/if}
													{/each}
												{:else}
													<p class="px-2 text-center align-middle text-sm text-brand-grey">
														O gesto não tem este parâmetro associado.
													</p>
												{/if}
											</div>
										</Card.Root>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Description -->
						{#if sign?.description?.includes(PUBLIC_R2_PUBLIC_URL) && sign?.theme_flattened?.includes('Proposta')}
							<div class="space-y-2">
								<p class="text-base font-semibold">Descrição da Proposta em Vídeo</p>
								<video
									class="aspect-video w-full rounded-2xl bg-brand-border object-contain shadow-sm"
									controls
									playsinline
								>
									<source src={sign?.description} />
									Your browser does not support the video tag.
								</video>
							</div>
						{/if}
					</div>
				</div>

				<!-- Created By and Annotated By -->
				<div class="flex flex-wrap items-center justify-start gap-x-5 gap-y-4 pb-5 pt-20">
					{#if createdByUser}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="flex items-center gap-3">
							<p>Gesto criado por</p>
							<Avatar.Root class="h-9 w-9">
								<Avatar.Image
									src={createdByUser.avatar}
									alt="{createdByUser.display_name}'s avatar"
								/>
								<Avatar.Fallback class="bg-brand-border text-xs font-bold">
									{firstAndLastInitials(createdByUser.display_name)}</Avatar.Fallback
								>
							</Avatar.Root>
							<button
								type="button"
								on:click={() => goToUserProfile(createdByUser.id)}
								class="font-medium hover:text-brand-blue hover:underline"
							>
								{createdByUser?.display_name}
							</button>
						</div>
					{/if}

					{#if createdByUser && annotatedByUser}
						<Separator orientation="vertical" class="hidden h-8 bg-brand-grey/30 sm:block" />
					{/if}

					{#if annotatedByUser}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="flex items-center gap-3">
							<p>Gesto anotado por</p>
							<Avatar.Root class="h-9 w-9">
								<Avatar.Image
									src={annotatedByUser.avatar}
									alt="{annotatedByUser.display_name}'s avatar"
								/>
								<Avatar.Fallback class="bg-brand-border text-xs font-bold">
									{firstAndLastInitials(annotatedByUser.display_name)}</Avatar.Fallback
								>
							</Avatar.Root>
							<button
								on:click={() => goToUserProfile(annotatedByUser.id)}
								class="font-medium hover:text-brand-blue hover:underline"
							>
								{annotatedByUser?.display_name}
							</button>
						</div>
					{/if}

					{#if sign?.last_changed}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="flex flex-1 items-center justify-end gap-3">
							<p class="text-brand-blue">Última atualização</p>
							<p>{formatTimestamp(sign.last_changed)}</p>
						</div>
					{/if}
				</div>
			</div>
		</section>

		<!-- Context Video -->
		{#if sign?.context_video?.includes(PUBLIC_R2_PUBLIC_URL) && sign?.sentence}
			<section class="container mx-auto px-4 pb-10 pt-20">
				<div class="relative space-y-2">
					<img src="/branding/curve-blue.svg" alt="Curve Blue" class="absolute -top-10 h-12 w-12" />
					<h2 class="pb-5 text-3xl font-bold leading-none text-brand-dark dark:text-foreground">
						Em contexto
					</h2>
				</div>

				<div class="flex flex-wrap gap-10">
					<div class="flex w-full flex-col gap-4">
						<!-- svelte-ignore a11y-media-has-caption -->
						<video
							class="aspect-video rounded-2xl bg-brand-border object-contain shadow-sm lg:w-1/2"
							controls
							playsinline
						>
							<source src={sign?.context_video} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
						<p>
							{sign.sentence}
						</p>
					</div>
				</div>
			</section>
		{/if}

		<section class="container mx-auto px-4 py-20">
			<div class="space-y-6">
				<CommentForm />
				<Separator class="bg-foreground/20" />
				<p>{posts?.length || 0} Comentários</p>

				{#if posts && posts.length > 0}
					{#each posts as comment}
						<CommentDisplay {comment} signId={sign?.id?.toString() || ''} {formatCommentDate} />
					{/each}
				{:else}
					<div class="flex flex-col items-center justify-center gap-2 pt-10">
						<img
							src="/branding/comments-empty-state.svg"
							alt=""
							aria-hidden="true"
							class="h-32 lg:h-40"
						/>
						<p class="pt-8 text-center">Ainda não existem comentários</p>
						<p class="pb-8 text-center text-gray-500">Seja o primeiro a partilhar a sua opinião</p>
					</div>
				{/if}
			</div>
		</section>
	</div>
{/if}
