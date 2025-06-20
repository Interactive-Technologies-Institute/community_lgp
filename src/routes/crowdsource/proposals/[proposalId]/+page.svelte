<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { ArrowBigUp, MessageCircle } from 'lucide-svelte';
    import { ArrowBigDown } from 'lucide-svelte';
    import { Separator } from '@/components/ui/separator'
	  import { goto } from '$app/navigation';
    export let data;
    let proposal = data.proposal;
    let comments = data.comments;
    let user = data.user;
</script>

{#if proposal && user}
<div class="container mx-auto space-y-24 py-5">
<Card.Root class="w-full max-w-8xl">
  <Card.Header>
    <Card.Title>{proposal.title}</Card.Title>
    <Separator/>
  </Card.Header>
  <Card.Content>
    <!-- svelte-ignore a11y-media-has-caption -->
     <div class="pb-5">
    {#if proposal.content_video}
        <video class=" max-w-md rounded-2xl" controls playsinline>
				<source src={proposal?.content_video} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
    {/if}
    </div>
    <div class="pb-5"></div>
    {#if proposal.content_text}
            {proposal.content_text}
    {/if}
    <div class="flex items-center justify-between pt-4 border-t mt-4 text-muted-foreground">
    <div class="flex items-center space-x-2">
        <Button variant="ghost" size="icon" class="text-blue-500">
            <ArrowBigUp />
        </Button>
        <span class="text-sm font-medium">placeholder</span>
        <Button variant="ghost" size="icon"  class="text-red-500">
            <ArrowBigDown />
        </Button>
    </div>
    <Button variant="ghost" size="sm" class="ml-auto flex items-center space-x-1" on:click={() => goto(`/crowdsource/proposals/${proposal.id}/comment`)}>
        <MessageCircle class="w-4 h-4" />
        <span>Comentar</span>
    </Button>
</div>
  </Card.Content>
</Card.Root>
</div>
{/if}
