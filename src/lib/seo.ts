// Open Graph / Twitter defaults used for link previews (Facebook, WhatsApp, LinkedIn, X).
// These crawlers do not run JavaScript, so these values must be rendered server-side
// (via <MetaTags> in a +page.svelte, which SvelteKit SSR injects into %sveltekit.head%).
export const SITE_URL = 'https://dclgp.dcitizens.eu';

export const SITE_TITLE = 'Dicionário LGP';
export const SITE_DESCRIPTION = 'O Dicionário Online de Língua Gestual Portuguesa';

export const OG_IMAGE = {
	url: `${SITE_URL}/og-image.png`,
	width: 1200,
	height: 630,
	alt: 'Logótipo do Dicionário LGP',
	type: 'image/png',
};
