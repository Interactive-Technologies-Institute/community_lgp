<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Inbox } from 'lucide-svelte';
</script>

<Button variant="outline" size="icon-sm">
	<div class="relative">
		<Inbox class="h-4 w-4" />
		<div class="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-primary"></div>
	</div>
</Button>
