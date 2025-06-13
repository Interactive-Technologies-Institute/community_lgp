<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { deleteSignSchema, type DeleteSignSchema } from '@/schemas/sign';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let open = false;
	export let signId: number;
	export let data: SuperValidated<Infer<DeleteSignSchema>>;

	const form = superForm(data, {
		validators: zodClient(deleteSignSchema),
	});

	const { enhance } = form;
</script>

<AlertDialog.Root bind:open>
	<form method="POST" action="?/delete" use:enhance class="hidden">
		<input type="hidden" name="id" value={signId} />
	</form>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Tem toda a certeza?</AlertDialog.Title>
			<AlertDialog.Description>
				Esta ação não é reversível. Ao realizar esta ação, irá ser apagada a entrada de gesto 
                e todas as suas anotações associadas da nossa base de dados.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<AlertDialog.Action on:click={form.submit}>Apagar</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
