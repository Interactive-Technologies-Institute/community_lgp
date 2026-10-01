<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	type Step = {
		number: number;
		title: string;
		description: string;
		note?: string;
		image: string;
		alt: string;
	};

	// Guardado como array para ser fácil trocar os prints (ou a ordem/texto dos passos) mais tarde.
	const steps: Step[] = [
		{
			number: 1,
			title: 'Abra "Contribuir Dataset"',
			description:
				'Entre na plataforma e clique em "Contribuir Dataset", no canto superior direito.',
			image: '/img/tutorial/1.png',
			alt: 'Botão "Contribuir Dataset" destacado no canto superior direito da plataforma.',
		},
		{
			number: 2,
			title: 'Aceite o consentimento',
			description: 'Veja o vídeo, marque a caixa e clique em "Aceitar e começar".',
			note: 'Só é preciso fazer isto uma vez.',
			image: '/img/tutorial/2.png',
			alt: 'Página de consentimento com a caixa de aceitação e o botão "Aceitar e começar" destacados.',
		},
		{
			number: 3,
			title: 'Clique em "Começar a gravar"',
			description: 'Na sua página de contribuição, clique no botão da caixa amarela.',
			image: '/img/tutorial/3.png',
			alt: 'Caixa amarela "Pronto para começar?" com o botão "Começar a gravar" destacado.',
		},
		{
			number: 4,
			title: 'Grave o gesto',
			description:
				'Veja o vídeo de referência, clique em "Gravar" e repita o gesto em frente à câmara.',
			note: 'Não conhece o gesto? Clique em "Saltar".',
			image: '/img/tutorial/4.png',
			alt: 'Página de gravação com o vídeo de referência à esquerda e o botão "Gravar" destacado à direita.',
		},
		{
			number: 5,
			title: 'Submeta e continue',
			description: 'Reveja o vídeo. Se estiver bem, clique em "Submeter". Se não, clique em "Repetir".',
			note: 'Depois segue para o próximo gesto. Grave quantos quiser.',
			image: '/img/tutorial/5.png',
			alt: 'Página de revisão do gesto gravado com o botão "Submeter" destacado.',
		},
	];
</script>

<MetaTags
	title="Como contribuir - Dataset ISLR"
	description="Cinco passos para gravar os seus primeiros gestos e contribuir para o dataset ISLR."
/>

<div class="tutorial-container mx-auto max-w-[1080px]">
	<div class="flex flex-col gap-1.5">
		<h1 class="text-2xl font-extrabold text-brand-dark dark:text-foreground sm:text-3xl">
			Como contribuir
		</h1>
		<p class="text-[16px] text-foreground">Cinco passos para gravar os seus primeiros gestos.</p>
	</div>

	<ol class="steps-list">
		{#each steps as step, i (step.number)}
			<li class="step-row">
				<div class="step-text">
					<div class="step-number font-heading bg-brand-dark text-brand-white">{step.number}</div>
					<h2 class="step-title font-heading text-brand-dark dark:text-foreground">
						{step.title}
					</h2>
					<p class="step-description text-foreground">{step.description}</p>
					{#if step.note}
						<p class="step-note text-muted-foreground">{step.note}</p>
					{/if}
				</div>
				<div class="step-image">
					<div class="step-image-frame border border-brand-border">
						<img
							src={step.image}
							alt={step.alt}
							width="1899"
							height="958"
							loading={i === 0 ? 'eager' : 'lazy'}
						/>
					</div>
				</div>
			</li>
		{/each}
	</ol>

	<div class="border-t border-brand-border pt-5">
		<p class="text-[14px] text-muted-foreground">
			Dúvidas: <a href="mailto:joana.peixinho@tecnico.ulisboa.pt" class="text-brand-blue"
				>joana.peixinho@tecnico.ulisboa.pt</a
			>
		</p>
	</div>
</div>

<style>
	.tutorial-container {
		display: flex;
		flex-direction: column;
		gap: 40px;
		padding: 40px 24px 64px;
	}

	.steps-list {
		display: flex;
		flex-direction: column;
		gap: 48px;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.step-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px 40px;
	}

	.step-text {
		display: flex;
		flex: 1 1 260px;
		flex-direction: column;
		gap: 10px;
	}

	.step-number {
		display: flex;
		height: 40px;
		width: 40px;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		font-size: 18px;
		font-weight: 700;
	}

	.step-title {
		font-size: 24px;
		font-weight: 700;
	}

	.step-description {
		font-size: 15px;
		line-height: 1.6;
	}

	.step-note {
		font-size: 14px;
	}

	.step-image {
		flex: 3 1 480px;
	}

	.step-image-frame {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		box-shadow: 0 8px 24px hsl(var(--brand-dark-blue) / 0.1);
	}

	.step-image-frame img {
		display: block;
		width: 100%;
		height: auto;
	}

	@media (max-width: 760px) {
		.step-row {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
