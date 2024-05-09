<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import * as Card from '@/components/ui/card';

	export let data;
</script>

<PageHeader
	title="User Profile"
	subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
/>
<div class="container mx-auto max-w-2xl pb-10">
	<Card.Root class="">
		<Card.Header>
			<Card.Title>{data.userProfile.display_name}</Card.Title>
			<Card.Description
				>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
				ut labore et dolore magna aliqua.
			</Card.Description>
		</Card.Header>
	</Card.Root>
</div>
