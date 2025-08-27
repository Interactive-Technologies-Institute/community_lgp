<script lang="ts">
	import { page } from '$app/stores';
	import FeatureWrapper from '@/components/feature-wrapper.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { firstAndLastInitials } from '@/utils';
	import { Mail, Map, Phone, SquareArrowOutUpRight } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
</script>

<MetaTags title="Detalhes do Utilizador" description="" />

<PageHeader
	title="Detalhes do Utilizador"
	subtitle="Veja os detalhes do Utilizador e as suas contribuições"
/>
<div class="container mx-auto mb-20 flex max-w-3xl flex-col gap-y-8 md:gap-y-10">
	<Card.Root>
		<Card.Header>
			<div class="flex flex-row items-center gap-x-4">
				<Avatar.Root class="h-20 w-20">
					<Avatar.Image src={data.userProfile.avatar} alt={data.userProfile.display_name} />
					<Avatar.Fallback>{firstAndLastInitials(data.userProfile.display_name)}</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<Card.Title class="text-xl">{data.userProfile.display_name}</Card.Title>
					<Card.Description class="text-lg">
						{data.userProfile.age ?? 'Idade desconhecida'}
						| {data.userProfile.gender ?? 'Género Desconhecido'}
						| {data.userProfile.language ?? 'Línguas de comunicação desconhecidas'}
						| {data.userProfile.profession ?? 'Profissão Desconhecida'}
					</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			<p>{data.userProfile.description ?? 'Sem descrição dada'}</p>
			<div class="flex flex-row gap-x-4">
				<Button href="mailto:{data.userProfile.email}" variant="outline">
					<Mail class="mr-2 h-4 w-4" />
					Email
				</Button>
				{#if data.userProfile.cnum && (data.user?.role === 'moderator' || data.user?.role === 'admin')}
					<Button variant="outline">
						<Phone class="mr-2 h-4 w-4" />
						{data.userProfile.cnum}
					</Button>
				{/if}
				{#if data.mapPin}
					<Button href="/map?id={data.mapPin.id}&zoom=10" variant="outline">
						<Map class="mr-2 h-4 w-4" />
						Ver no mapa
					</Button>
				{/if}
			</div>
			{#if $page.url.pathname === '/users/me'}
				<Button href="/users/me/edit">Editar Perfil</Button>
			{/if}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Nome Gestual</Card.Title>
		</Card.Header>
		<Card.Content>
			<!-- svelte-ignore a11y-media-has-caption -->
			{#if data.userProfile.sign_name}
				<video class="h-auto w-full rounded-2xl" controls playsinline>
					<source src={data.userProfile.sign_name} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			{/if}
		</Card.Content>
	</Card.Root>
	<FeatureWrapper feature="guides">
		<Card.Root>
			<Card.Header>
				<Card.Title>Guias ({data.guides.length})</Card.Title>
				<Card.Description>Lista de guias criados</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if data.guides && data.guides.length > 0}
					<div class="flex flex-wrap gap-4">
						{#each data.guides as guide}
							<Button href="/guides/{guide.id}" variant="outline" class="max-w-full">
								<span class="truncate">{guide.label}</span>
								<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
							</Button>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">O utilizador não criou nenhum guia.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</FeatureWrapper>
	<FeatureWrapper feature="events">
		<Card.Root>
			<Card.Header>
				<Card.Title>Eventos ({data.events.length})</Card.Title>
				<Card.Description>Lista de Eventos criados</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if data.events && data.events.length > 0}
					<div class="flex flex-wrap gap-4">
						{#each data.events as event}
							<Button href="/events/{event.id}" variant="outline" class="max-w-full">
								<span class="truncate">{event.label}</span>
								<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
							</Button>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">O utilizador não criou nenhum evento.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</FeatureWrapper>
	<FeatureWrapper feature="dictionary">
		<Card.Root>
			<Card.Header>
				<Card.Title>Gestos Criados ({data.signs.count})</Card.Title>
				<Card.Description>Lista de Gestos criados pelo utilizador</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if data.signs.signs.length > 0}
					<div class="flex flex-wrap gap-4">
						{#each data.signs.signs as sign}
							<Button href="/dictionary/sign/{sign.id}" variant="outline" class="max-w-full">
								<span class="truncate">{sign.name}</span>
								<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
							</Button>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">O utilizador não criou nenhum gesto.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</FeatureWrapper>
	{#if data.userProfile.role === 'moderator' || data.userProfile.role === 'admin'}
		<FeatureWrapper feature="annotate">
			<Card.Root>
				<Card.Header>
					<Card.Title>Gestos Anotados ({data.annotatedSigns.count})</Card.Title>
					<Card.Description>Lista de Gestos anotados pelo utilizador</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if data.annotatedSigns.annotatedSigns.length > 0}
						<div class="flex flex-wrap gap-4">
							{#each data.annotatedSigns.annotatedSigns as sign}
								<Button href="/dictionary/sign/{sign.id}" variant="outline" class="max-w-full">
									<span class="truncate">{sign.name}</span>
									<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
								</Button>
							{/each}
						</div>
					{:else}
						<p class="text-sm text-muted-foreground">O utilizador não anotou nenhum gesto.</p>
					{/if}
				</Card.Content>
			</Card.Root>
		</FeatureWrapper>
	{/if}

	<Card.Root>
		<Card.Header>
			<Card.Title>Gestos Favoritos ({data.favorites.count})</Card.Title>
			<Card.Description>Lista de Gestos adicionados aos favoritos pelo utilizador</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.favorites.favorites.length > 0}
				<div class="flex flex-wrap gap-4">
					{#each data.favorites.favorites as sign}
						<Button href="/dictionary/sign/{sign.sign_id}" variant="outline" class="max-w-full">
							<span class="truncate">{sign.name}</span>
							<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
						</Button>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">
					O utilizador não adicionou nenhum gesto aos seus favoritos.
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Gostos Dados ({data.likes.count})</Card.Title>
			<Card.Description>Lista de gestos que o utilizador gostou</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.likes.likes && data.likes.likes.length > 0}
				<div class="flex flex-wrap gap-4">
					{#each data.likes.likes as like}
						<div class="flex items-center gap-2">
							<Button href="/dictionary/sign/{like.sign_id}" variant="outline" class="max-w-full">
								<span class="truncate">{like.signs.name}</span>
								<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
							</Button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">O utilizador não deu gosto a nenhum gesto.</p>
			{/if}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Não-Gostos Dados ({data.dislikes.count})</Card.Title>
			<Card.Description>Lista de gestos que o utilizador não gostou</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.dislikes.dislikes && data.dislikes.dislikes.length > 0}
				<div class="flex flex-wrap gap-4">
					{#each data.dislikes.dislikes as dislike}
						<div class="flex items-center gap-2">
							<Button
								href="/dictionary/sign/{dislike.sign_id}"
								variant="outline"
								class="max-w-full"
							>
								<span class="truncate">{dislike.signs.name}</span>
								<SquareArrowOutUpRight class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
							</Button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">O utilizador não desgostou nenhum gesto.</p>
			{/if}
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Comentários ({data.comments.count})</Card.Title>
			<Card.Description>Lista de comentários feitos pelo utilizador</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if data.comments.comments && data.comments.comments.length > 0}
				<div class="space-y-4">
					{#each data.comments.comments as comment}
						<div class="rounded-lg border p-4">
							<div class="mb-2 flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium">Comentário no gesto:</span>
									<Button
										href="/dictionary/sign/{comment.signs.id}"
										variant="link"
										class="h-auto p-0 text-sm"
									>
										{comment.signs.name}
										<SquareArrowOutUpRight class="ml-1 h-3 w-3" />
									</Button>
								</div>
								<span class="text-sm text-muted-foreground">
									{new Date(comment.created_at).toLocaleDateString('pt-PT', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
							</div>

							<!-- Display either text content or video content -->
							{#if comment.content_text}
								<div class="prose prose-sm max-w-none">
									<p class="text-sm">{comment.content_text}</p>
								</div>
							{:else if comment.content_video}
								<div class="mt-2">
									<!-- svelte-ignore a11y-media-has-caption -->
									<video class="h-auto w-full max-w-md rounded-lg" controls playsinline>
										<source src={comment.content_video} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">O utilizador não fez nenhum comentário.</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
