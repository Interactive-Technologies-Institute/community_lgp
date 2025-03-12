<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let order: string = 'last_altered';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}>Ordenar</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value={order}>
			<DropdownMenu.RadioItem value="last_altered">Data de Última Alteração</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="upload_date">Data de Upload</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="state">Estado</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="alphabetical">Alfabética</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
