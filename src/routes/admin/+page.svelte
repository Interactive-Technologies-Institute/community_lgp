<script lang="ts">
	import PageHeader from '@/components/page-header.svelte';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
</script>

<PageHeader title="Admin" subtitle="Configure the platform" />
<div class="container mx-auto mb-20 flex flex-col gap-y-10">
	<Card.Root>
		<Card.Header>
			<Card.Title>Features</Card.Title>
			<Card.Description>Lorem Ipsum</Card.Description>
		</Card.Header>
		<Card.Content></Card.Content>
		<Card.Footer>
			<Button>Save Settings</Button>
		</Card.Footer>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Branding</Card.Title>
			<Card.Description>Lorem Ipsum</Card.Description>
		</Card.Header>
		<Card.Content></Card.Content>
		<Card.Footer>
			<Button>Save Settings</Button>
		</Card.Footer>
	</Card.Root>
</div>
