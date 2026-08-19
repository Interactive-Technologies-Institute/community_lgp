<script lang="ts">
	import { Button } from '@/components/ui/button';
	import PageHeader from '@/components/page-header.svelte';
	import { submitIslrVoteSchema, type SubmitIslrVoteSchema } from '@/schemas/islr-vote';
	import { Check, X } from 'lucide-svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { tick } from 'svelte';

	type CurrentItem = {
		id: number;
		signName: string;
		referenceVideo: string;
		submissionVideo: string;
	};

	export let data: {
		queueEmpty: boolean;
		currentItem?: CurrentItem;
		queueLength?: number;
		voteForm: SuperValidated<Infer<SubmitIslrVoteSchema>>;
	};

	$: ({ queueEmpty, currentItem, queueLength } = data);

	const form = superForm(data.voteForm, {
		validators: zodClient(submitIslrVoteSchema),
		taintedMessage: null,
	});

	const { form: formData, enhance, submitting, submit } = form;

	$: if (currentItem && $formData.submissionId !== currentItem.id) {
		$formData.submissionId = currentItem.id;
	}

	async function vote(decision: 'accept' | 'reject') {
		$formData.decision = decision;
		await tick();
		submit();
	}
</script>

<MetaTags
	title="Rever Sinal - Dataset ISLR"
	description="Ajude a rever os vídeos submetidos por outros contribuidores do dataset ISLR."
/>

{#if queueEmpty || !currentItem}
	<PageHeader title="Rever Sinais" subtitle="Não há vídeos para rever de momento." />
	<div class="container mx-auto max-w-3xl space-y-6 pb-10 text-center">
		<p class="text-lg text-foreground">
			Não há vídeos para rever de momento. Volta mais tarde para ajudar a validar novas
			contribuições.
		</p>
	</div>
{:else}
	{#key currentItem.id}
		<PageHeader title="Rever Sinal" subtitle={`${queueLength} vídeos por rever.`} />

		<div class="container mx-auto max-w-5xl space-y-6 pb-10">
			<h2 class="text-center text-2xl font-bold text-brand-dark">{currentItem.signName}</h2>

			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<p class="text-center text-sm font-semibold text-brand-grey">Vídeo de referência</p>
					<!-- svelte-ignore a11y-media-has-caption -->
					<video class="h-auto w-full rounded-2xl" controls playsinline>
						<source src={currentItem.referenceVideo} type="video/mp4" />
						O seu navegador não suporta a reprodução deste vídeo.
					</video>
				</div>

				<div class="space-y-2">
					<p class="text-center text-sm font-semibold text-brand-grey">Vídeo submetido</p>
					<!-- svelte-ignore a11y-media-has-caption -->
					<video class="h-auto w-full rounded-2xl" controls playsinline>
						<source src={currentItem.submissionVideo} type="video/mp4" />
						O seu navegador não suporta a reprodução deste vídeo.
					</video>
				</div>
			</div>

			<form method="POST" action="?/vote" use:enhance class="flex flex-col items-center gap-3">
				<input type="hidden" name="submissionId" value={$formData.submissionId} />
				<input type="hidden" name="decision" value={$formData.decision} />

				<div class="flex w-full max-w-md gap-3">
					<Button
						type="button"
						disabled={$submitting}
						on:click={() => vote('accept')}
						class="h-16 flex-1 gap-3 bg-brand-blue text-lg font-bold text-brand-white shadow-md hover:bg-brand-blue/90"
					>
						<Check class="h-6 w-6" />
						Aceitar
					</Button>

					<Button
						type="button"
						disabled={$submitting}
						variant="destructive"
						on:click={() => vote('reject')}
						class="h-16 flex-1 gap-3 text-lg font-bold shadow-md"
					>
						<X class="h-6 w-6" />
						Rejeitar
					</Button>
				</div>
			</form>
		</div>
	{/key}
{/if}
