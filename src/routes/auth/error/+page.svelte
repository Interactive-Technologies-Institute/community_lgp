<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { requestNewInviteSchema } from '@/schemas/request-new-invite';
	import { Loader2 } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	// Only the contributor-invite flow (type=invite) gets special handling
	// here - everything else (expired signup confirmation, or any other/
	// missing type) falls back to a generic message, same as before this
	// page existed, just without the 404.
	//
	// Reactive (not const): a client-side nav to this same route with a
	// different ?type= (e.g. browser back/forward) updates `data` without
	// remounting the component, and this needs to follow it.
	$: isInvite = data.type === 'invite';

	const inviteForm = superForm(data.requestNewInviteForm, {
		id: 'request-new-invite',
		validators: zodClient(requestNewInviteSchema),
		taintedMessage: true,
	});
	const { form: inviteFormData, enhance: inviteEnhance, submitting: inviteSubmitting } = inviteForm;
</script>

<MetaTags title="Link inválido ou expirado" description="Este link já não é válido." />

{#if isInvite}
	<div class="mx-auto flex max-w-[880px] flex-col gap-8 px-6 pb-[72px] pt-14">
		<div class="flex flex-col items-center gap-2 text-center">
			<h1 class="text-[34px] font-extrabold text-brand-dark dark:text-foreground">
				Este convite já não é válido
			</h1>
			<p class="max-w-[560px] text-base text-foreground">
				O link expirou ou já foi usado. Escolha a opção que se aplica a si.
			</p>
		</div>

		<div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
			<!-- Same blue accent pattern (border-brand-blue/70 + bg-brand-blue/30) as the
			     "Adicionados recentemente" card on /dictionary, so dark mode matches it. -->
			<div
				class="flex flex-col gap-4 rounded-[18px] border border-brand-blue/70 bg-brand-blue/30 p-7 shadow-sm"
			>
				<h2 class="text-[22px] font-extrabold text-brand-dark dark:text-foreground">
					Já criei a minha conta
				</h2>
				<p class="flex-1 text-[15px] text-foreground">
					Não precisa de um novo convite. Entre diretamente.
				</p>
				<Button
					href="/sign-in"
					variant="outline"
					class="h-14 w-full rounded-[10px] border-brand-blue/40 text-base font-bold text-brand-dark hover:bg-brand-blue/10 dark:text-foreground"
				>
					Entrar
				</Button>
			</div>

			<!-- Same yellow accent pattern (border-brand-yellow/70 + bg-brand-yellow/30) as
			     "Gestos do dia" on /dictionary, so dark mode matches it. -->
			<div
				class="flex flex-col gap-4 rounded-[18px] border border-brand-yellow/70 bg-brand-yellow/30 p-7 shadow-sm"
			>
				<h2 class="text-[22px] font-extrabold text-brand-dark dark:text-foreground">
					Ainda não criei conta
				</h2>
				<p class="text-[15px] text-foreground">Enviamos-lhe um novo convite por email.</p>
				<form
					method="POST"
					action="?/requestInvite"
					use:inviteEnhance
					class="flex flex-1 flex-col justify-end gap-4"
				>
					<Form.Field form={inviteForm} name="email">
						<Form.Control let:attrs>
							<Form.Label class="sr-only">Email</Form.Label>
							<Input
								{...attrs}
								type="email"
								autocomplete="email"
								inputmode="email"
								placeholder="O seu email"
								aria-label="Email"
								bind:value={$inviteFormData.email}
								class="h-14 rounded-[10px] border-brand-yellow/50 bg-background text-base"
							/>
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Button
						class="h-14 w-full rounded-[10px] bg-brand-blue text-base font-bold text-brand-white shadow-[0_4px_12px_rgba(58,150,247,0.35)] hover:bg-brand-blue/90"
						disabled={$inviteSubmitting}
					>
						{#if $inviteSubmitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Pedir novo convite
					</Form.Button>
				</form>
			</div>
		</div>

		<p class="text-center text-sm text-muted-foreground">
			Dúvidas: <a href="mailto:joana.peixinho@tecnico.ulisboa.pt" class="text-brand-blue"
				>joana.peixinho@tecnico.ulisboa.pt</a
			>
		</p>
	</div>
{:else}
	<div class="mx-auto max-w-[760px] px-4 pb-12 pt-8">
		<div class="flex flex-col items-start gap-5">
			<div class="flex flex-col gap-1.5">
				<h1 class="text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">
					Este link já não é válido
				</h1>
				<p class="leading-7 text-foreground">O link pode ter expirado ou já ter sido usado.</p>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<Button
					href="/forgot-password"
					class="h-12 whitespace-nowrap bg-brand-blue px-6 font-bold text-brand-white hover:bg-brand-blue/90"
				>
					Pedir novo link de recuperação de password
				</Button>
				<Button
					href="/sign-in"
					variant="outline"
					class="h-12 whitespace-nowrap border-brand-blue/70 px-6 font-semibold text-brand-blue hover:bg-brand-blue/5"
				>
					Voltar ao login
				</Button>
			</div>
		</div>
	</div>
{/if}
