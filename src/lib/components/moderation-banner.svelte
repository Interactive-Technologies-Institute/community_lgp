<script lang="ts">
	import type { ModerationInfo } from '@/types/types';

	import { Info } from 'lucide-svelte';
	import * as Alert from './ui/alert';

	export let moderation: ModerationInfo;

	let variant: Alert.Variant = 'default';
	$: variant = moderation.status === 'rejected' ? 'destructive' : 'default';
</script>

<Alert.Root {variant} class="mx-auto max-w-xl">
	<Info class="mr-2 h-4 w-4" />
	<Alert.Title>
		{#if moderation.status === 'rejected'}
			Rejected (marked for deletetion)
		{:else if moderation.status === 'pending'}
			Pending Moderation
		{:else if moderation.status === 'changes_requested'}
			Changes Requested
		{/if}
	</Alert.Title>
	<Alert.Description>{moderation.comment}</Alert.Description>
</Alert.Root>
