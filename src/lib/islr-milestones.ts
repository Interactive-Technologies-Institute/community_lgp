// Personal video-count milestones shown as badges on the ISLR dataset dashboard
// (and reused on the recording screen). Shared between server and client code,
// so it must not import anything server-only.
export const PERSONAL_MILESTONES = [5, 15, 30, 60, 150, 300] as const;

export const PERSONAL_MILESTONE_LABELS: Record<(typeof PERSONAL_MILESTONES)[number], string> = {
	5: 'Primeiros Gestos',
	15: 'Contribuidor Nato',
	30: 'Contribuidor Veterano',
	60: 'Contribuidor Experiente',
	150: 'Super Contribuidor',
	300: 'Pilar da Comunidade',
};
