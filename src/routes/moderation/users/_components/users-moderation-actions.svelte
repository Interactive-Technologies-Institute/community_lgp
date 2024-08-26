<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Ellipsis } from 'lucide-svelte';

	export let id: string;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item href="/how-to/{id}">Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.RadioGroup value="user">
			<DropdownMenu.RadioItem value="user">User</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="moderator">Moderator</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="admin">Admin</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
