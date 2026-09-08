import { PUBLIC_MAINTENANCE_MODE } from '$env/static/public';
import type { Reroute } from '@sveltejs/kit';

const hasFileExtension = /\/[^/]+\.[^/]+$/;

export const reroute: Reroute = ({ url }) => {
	if (PUBLIC_MAINTENANCE_MODE !== 'true') return;

	// Assets must remain reachable so that the maintenance page keeps the
	// platform's fonts, branding and compiled CSS/JavaScript.
	if (
		url.pathname === '/maintenance' ||
		url.pathname.startsWith('/_app/') ||
		hasFileExtension.test(url.pathname)
	) {
		return;
	}

	return '/maintenance';
};
