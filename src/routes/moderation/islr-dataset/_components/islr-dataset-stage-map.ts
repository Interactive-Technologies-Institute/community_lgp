import type { ContributorStage } from '@/types/types';

export const stageMap: Record<
	ContributorStage,
	{ label: string; description: string; class: string }
> = {
	pending: {
		label: 'Convite por aceitar',
		description: 'Recebeu o convite mas ainda não abriu o link.',
		class: 'border-brand-border bg-brand-surface dark:bg-brand-border/60',
	},
	accepted: {
		label: 'Falta consentimento',
		description: 'Aceitou o convite mas ainda não deu consentimento para gravar.',
		class: 'border-brand-yellow bg-brand-yellow/20',
	},
	consented: {
		label: 'Ainda não gravou',
		description: 'Deu consentimento mas ainda não gravou nenhum vídeo.',
		class: 'border-brand-blue/40 bg-brand-blue/5',
	},
	recording: {
		label: 'A gravar',
		description: 'Já gravou pelo menos um vídeo.',
		class: 'border-brand-blue bg-brand-blue/20',
	},
};
