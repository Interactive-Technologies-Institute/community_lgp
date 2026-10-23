import { describe, expect, it } from 'vitest';
import { PERSONAL_MILESTONE_LABELS, PERSONAL_MILESTONES } from './islr-milestones';
import {
	buildDigestEmail,
	PERSONAL_MILESTONE_LABELS as DIGEST_MILESTONE_LABELS,
	PERSONAL_MILESTONES as DIGEST_MILESTONES,
	type DigestInput,
} from '../../supabase/functions/send-islr-weekly-digest/content';

const links: DigestInput['links'] = {
	record: 'https://example.pt/islr-dataset/record',
	tutorial: 'https://example.pt/islr-dataset/tutorial',
	dashboard: 'https://example.pt/islr-dataset/dashboard',
	unsubscribe: 'https://example.pt/islr-dataset/unsubscribe?u=abc&t=123',
	badges: 'https://example.pt/img/badges',
};

function build(totalVideos: number, videosThisWeek = 0, firstName: string | null = 'Ana') {
	return buildDigestEmail({ firstName, totalVideos, videosThisWeek, links });
}

describe('weekly digest email', () => {
	// The Edge Function keeps its own copy because it can't import from the app.
	it('uses the same milestones as the app', () => {
		expect(DIGEST_MILESTONES).toEqual(PERSONAL_MILESTONES);
		expect(DIGEST_MILESTONE_LABELS).toEqual(PERSONAL_MILESTONE_LABELS);
	});

	it('renders every total without leftover placeholders or broken links', () => {
		for (let total = 0; total <= 320; total++) {
			for (const firstName of ['Ana', null]) {
				const { html, subject } = build(total, Math.min(total, 3), firstName);
				expect(subject).not.toBe('');
				expect(html).not.toMatch(/\{\{|\}\}/);
				expect(html).toContain(`href="${links.record}"`);
				expect(html).toContain(
					'href="https://example.pt/islr-dataset/unsubscribe?u=abc&amp;t=123"'
				);
				expect(html).toContain(firstName ? 'Olá Ana,' : 'Olá,');
			}
		}
	});

	it('sends the first-sign email only to people who never recorded', () => {
		expect(build(0).kind).toBe('first-sign');
		expect(build(0).subject).toBe('A sua contribuição seria muito valiosa');
		expect(build(0).html).toContain(`src="${links.badges}/5.png"`);
		expect(build(1).kind).toBe('continue');
		expect(build(1).subject).toBe('Continue a gravar gestos');
	});

	it('shows the next milestone and how many videos are missing', () => {
		const { html } = build(27, 2);
		expect(html).toContain('Contribuidor Veterano');
		expect(html).toContain('Vídeos em falta: <strong>3</strong>');
		expect(html).toContain(`src="${links.badges}/30.png"`);
	});

	it('hides the next milestone block once every milestone is reached', () => {
		const { html } = build(300, 1);
		expect(html).not.toContain('Próximo marco');
		expect(html).not.toContain('<img');
	});

	it('uses the singular for one video', () => {
		const { html } = build(1, 1);
		expect(html).toMatch(/>1<\/p>\s*<p[^>]*>vídeo<\/p>/);
		expect(build(2, 0).html).toMatch(/>0<\/p>\s*<p[^>]*>vídeos<\/p>/);
	});

	it('escapes the name', () => {
		const { html } = build(5, 1, 'Jo$& <b>');
		expect(html).toContain('Olá Jo$&amp; &lt;b&gt;,');
	});
});
