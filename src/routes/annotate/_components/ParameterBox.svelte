<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	export let data;
	let parameters = data.parameters;
	export let currentTab: string;
</script>

{#each parameters as p}
	{#if currentTab == p.type}
		{#if p.is_parent}
			{#if p.children?.length == 0}
				<Card.Root
					class="flex h-max w-96 flex-col items-center justify-center gap-3 pt-2"
					style="border: 2px solid #0096FF;"
				></Card.Root>
            
			{/if}
		{:else}
			<Card.Root class="flex aspect-square w-32 items-center justify-center">
				<Card.Content class="flex flex-col gap-2">
					<div class="flex flex-col items-center justify-center">
						{#if p.image == null}
							{#if p.name != null}
								{p.name}
								{p.code}
							{:else}
								{p.code}
							{/if}
						{:else}
							<img class="flex w-14" src={p.image} alt="" />

							{p.name}
							{p.code}
						{/if}
					</div></Card.Content
				>
			</Card.Root>
        
		{/if}
	{/if}
{/each}
