<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Avatar from '@/components/ui/avatar';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { UserProfile, UserRole } from '@/types/types';
	import { firstAndLastInitials } from '@/utils';

	export let profile: UserProfile;
	export let role: UserRole;

	let signOutForm: HTMLFormElement;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src={profile.avatar} alt={profile.display_name} />
				<Avatar.Fallback>{firstAndLastInitials(profile.display_name)}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-48" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{profile.display_name}</p>
				<p class="text-xs leading-none text-muted-foreground">{profile.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/users/me">Perfil</DropdownMenu.Item>
			<DropdownMenu.Item href="/settings">Configurações</DropdownMenu.Item>
			{#if role === 'moderator' || role === 'admin'}
				<DropdownMenu.Item href="/moderation/signs">Moderação</DropdownMenu.Item>
			{/if}
			{#if role === 'admin'}
				<DropdownMenu.Item href="/admin">Administração</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<form method="post" action="/?/signout" use:enhance bind:this={signOutForm}>
			<DropdownMenu.Item on:click={() => signOutForm.requestSubmit()}>Sair</DropdownMenu.Item>
		</form>
	</DropdownMenu.Content>
</DropdownMenu.Root>
