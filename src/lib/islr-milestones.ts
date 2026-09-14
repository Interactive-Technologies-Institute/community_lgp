// Personal video-count milestones shown as badges on the ISLR dataset dashboard
// (and reused on the recording screen). Shared between server and client code,
// so it must not import anything server-only.
export const PERSONAL_MILESTONES = [5, 30, 60, 100, 300, 600] as const;

export const PERSONAL_MILESTONE_LABELS: Record<(typeof PERSONAL_MILESTONES)[number], string> = {
	5: 'Primeiros Gestos',
	30: 'Contribuidor Nato',
	60: 'Contribuidor Veterano',
	100: 'Contribuidor Experiente',
	300: 'Super Contribuidor',
	600: 'Pilar da Comunidade',
};
