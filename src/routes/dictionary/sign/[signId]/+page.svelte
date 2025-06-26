<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';
	import type { Sign } from '@/types/types';
	import AnnotationShowcase from '../../../../lib/components/dictionary/AnnotationShowcase.svelte';
	import { goto } from '$app/navigation';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Card from '@/components/ui/card';
	import * as Avatar from '@/components/ui/avatar';
	import { firstAndLastInitials } from '@/utils';
	export let data;
	export let sign: Sign | null = data.sign;
	let createdByUser = data.created_by_user;
	let annotatedByUser = data.annotated_by_user;
	let posts = data.posts;
	console.log(createdByUser);

	function goToUserProfile(id: string) {
		goto(`/users/${id}`);
	}
</script>

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

		<h2 class="mt-2 text-lg">
			{#if sign?.district}
				<Badge variant="outline" class="m-1">{sign.district}</Badge>
			{/if}
		</h2>
		<Card.Root class="rounded-3xl px-3 py-2">
			<div class="flex items-start justify-start">
				{#if createdByUser}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<h2 class="text-md">
						Gesto criado por:
						<Avatar.Root class="rounded-3xl">
							<Avatar.Image
								src={createdByUser.avatar}
								alt="${createdByUser.display_name}'s avatar"
							/>
							<Avatar.Fallback>{firstAndLastInitials(createdByUser.display_name)}</Avatar.Fallback>
						</Avatar.Root>
						<span
							on:click={() => goToUserProfile(createdByUser.id)}
							class="cursor-pointer text-primary hover:underline"
						>
							{createdByUser?.display_name}
						</span>
					</h2>
				{/if}
				<div class="flex items-start justify-start px-3">
					{#if createdByUser && annotatedByUser}
						<Separator orientation="vertical" class="h-6" />
					{/if}
				</div>

				{#if annotatedByUser}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<h2 class="text-md">
						Gesto anotado por:
						<Avatar.Root class="rounded-3xl">
							<Avatar.Image
								src={annotatedByUser.avatar}
								alt="${annotatedByUser.display_name}'s avatar"
							/>
							<Avatar.Fallback>{firstAndLastInitials(annotatedByUser.display_name)}</Avatar.Fallback
							>
						</Avatar.Root>
						<span
							on:click={() => goToUserProfile(annotatedByUser.id)}
							class="cursor-pointer text-primary hover:underline"
						>
							{annotatedByUser?.display_name}
						</span>
					</h2>
				{/if}
			</div>
		</Card.Root>
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
</div>

<div class="flex items-center justify-center py-5">
	<Collapsible.Root>
		<Collapsible.Trigger class="flex w-full items-center justify-center space-x-2">
			<div class="flex items-center space-x-2">
				<Separator class="w-16" />
				<span>Comentários</span>
				<Separator class="w-16" />
			</div>
		</Collapsible.Trigger>
		<Collapsible.Content class="w-full py-5 text-center transition-all duration-300">
			{#if posts && posts.length > 0}
				{#each posts as p}
					{p}
				{/each}
			{:else}
				Este gesto ainda não tem comentários. Seja o primeiro!
			{/if}
		</Collapsible.Content>
	</Collapsible.Root>
</div>
