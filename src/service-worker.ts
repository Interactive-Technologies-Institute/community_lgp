/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Minimal service worker so Chrome on Android treats the site as an installable app.
// It caches nothing: page navigations always go to the network, and only when the
// network fails do we show a small offline message. All other requests (API, videos,
// images) are left untouched.

const sw = self as unknown as ServiceWorkerGlobalScope;

const OFFLINE_HTML = `<!doctype html>
<html lang="pt">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Dicionário LGP</title>
	<style>
		body { margin: 0; min-height: 100vh; display: grid; place-items: center;
			font-family: system-ui, sans-serif; text-align: center; padding: 1rem; }
	</style>
</head>
<body>
	<div>
		<h1>Sem ligação à internet</h1>
		<p>Liga-te à internet para usar o Dicionário LGP.</p>
		<button onclick="location.reload()">Tentar de novo</button>
	</div>
</body>
</html>`;

sw.addEventListener('install', () => {
	sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(sw.clients.claim());
});

sw.addEventListener('fetch', (event) => {
	if (event.request.mode !== 'navigate') return;

	event.respondWith(
		fetch(event.request).catch(
			() =>
				new Response(OFFLINE_HTML, {
					status: 503,
					headers: { 'Content-Type': 'text/html; charset=utf-8' },
				})
		)
	);
});
