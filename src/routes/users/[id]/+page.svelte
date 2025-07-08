<script lang="ts">
	import { page } from '$app/stores';
	import FeatureWrapper from '@/components/feature-wrapper.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { firstAndLastInitials } from '@/utils';
	import { Mail, Map, SquareArrowOutUpRight } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;
	console.log(data);
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
						{data.userProfile.type}
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
							<Button href="/signs/{sign.id}" variant="outline" class="max-w-full">
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
							<Button href="/signs/{sign.id}" variant="outline" class="max-w-full">
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
</div>
