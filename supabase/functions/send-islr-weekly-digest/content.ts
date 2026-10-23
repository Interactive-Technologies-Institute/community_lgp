// Builds the weekly digest email for one contributor by filling the HTML
// templates in templates.ts. Kept free of I/O so it can be previewed with
// dryRun without touching the data-gathering code in index.ts.

import { CONTINUE_TEMPLATE, FIRST_SIGN_TEMPLATE } from './templates.ts';

// Keep in sync with src/lib/islr-milestones.ts - Edge Functions can't import
// from the SvelteKit app.
export const PERSONAL_MILESTONES = [5, 15, 30, 60, 150, 300] as const;

export const PERSONAL_MILESTONE_LABELS: Record<(typeof PERSONAL_MILESTONES)[number], string> = {
	5: 'Primeiros Gestos',
	15: 'Contribuidor Nato',
	30: 'Contribuidor Veterano',
	60: 'Contribuidor Experiente',
	150: 'Super Contribuidor',
	300: 'Pilar da Comunidade',
};

export interface DigestInput {
	firstName: string | null;
	videosThisWeek: number;
	totalVideos: number;
	links: {
		record: string;
		tutorial: string;
		dashboard: string;
		unsubscribe: string;
		// Base URL of the milestone badge PNGs (static/img/badges/<milestone>.png).
		badges: string;
	};
}

export interface DigestEmail {
	kind: 'continue' | 'first-sign';
	subject: string;
	html: string;
}

const NEXT_MILESTONE_BLOCK =
	/<!-- INÍCIO bloco_proximo_marco[\s\S]*?<!-- FIM bloco_proximo_marco -->/;

export function buildDigestEmail(input: DigestInput): DigestEmail {
	const common = {
		link_gravar: input.links.record,
		link_tutorial: input.links.tutorial,
		link_progresso: input.links.dashboard,
		link_cancelar: input.links.unsubscribe,
	};

	if (input.totalVideos === 0) {
		return {
			kind: 'first-sign',
			subject: 'A sua contribuição seria muito valiosa',
			html: fill(withGreeting(FIRST_SIGN_TEMPLATE, input.firstName), {
				...common,
				proximo_marco_imagem: `${input.links.badges}/${PERSONAL_MILESTONES[0]}.png`,
			}),
		};
	}

	const next = PERSONAL_MILESTONES.find((m) => input.totalVideos < m);
	let template = withGreeting(CONTINUE_TEMPLATE, input.firstName);
	if (next === undefined) template = template.replace(NEXT_MILESTONE_BLOCK, '');

	return {
		kind: 'continue',
		subject: 'Continue a gravar gestos',
		html: fill(template, {
			...common,
			videos_semana: String(input.videosThisWeek),
			videos_semana_rotulo: input.videosThisWeek === 1 ? 'vídeo' : 'vídeos',
			total_videos: String(input.totalVideos),
			total_videos_rotulo: input.totalVideos === 1 ? 'vídeo' : 'vídeos',
			...(next !== undefined && {
				proximo_marco_nome: PERSONAL_MILESTONE_LABELS[next],
				proximo_marco_faltam: String(next - input.totalVideos),
				proximo_marco_imagem: `${input.links.badges}/${next}.png`,
			}),
		}),
	};
}

// The templates say "Olá {{nome}},"; without a name it becomes just "Olá,".
function withGreeting(template: string, firstName: string | null) {
	return firstName
		? template.replaceAll('{{nome}}', () => escapeHtml(firstName))
		: template.replaceAll('Olá {{nome}},', 'Olá,');
}

function fill(template: string, values: Record<string, string>) {
	const html = template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
		key in values ? escapeHtml(values[key]) : match
	);
	const missing = html.match(/\{\{\w+\}\}/g);
	if (missing) throw new Error(`Unfilled placeholders in digest email: ${missing.join(', ')}`);
	return html;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
