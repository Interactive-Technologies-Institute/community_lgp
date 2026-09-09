// Personal video-count milestones shown as badges on the ISLR dataset dashboard
// (and reused on the recording screen). Shared between server and client code,
// so it must not import anything server-only.
export const PERSONAL_MILESTONES = [5, 50, 300, 600, 1000, 2000] as const;

export const PERSONAL_MILESTONE_LABELS: Record<(typeof PERSONAL_MILESTONES)[number], string> = {
	5: 'Primeiros Gestos',
	50: 'Contribuidor Iniciante',
	300: 'Contribuidor Nato',
	600: 'Contribuidor Veterano',
	1000: 'Super Contribuidor',
	2000: 'Pilar da Comunidade',
};
