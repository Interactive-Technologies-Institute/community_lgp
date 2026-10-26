import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { buildContributorAccessEmail, SUBJECT } from './content.ts';

const GMAIL_USER = Deno.env.get('GMAIL_USER');
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');
// Same secret the weekly digest uses, already shared with the SvelteKit app.
const ISLR_DIGEST_SECRET = Deno.env.get('ISLR_DIGEST_SECRET');
const SITE_URL = Deno.env.get('SITE_URL')?.replace(/\/$/, '');

Deno.serve(async (req) => {
	if (req.method !== 'POST') {
		return json({ error: 'Method not allowed' }, 405);
	}

	if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ISLR_DIGEST_SECRET || !SITE_URL) {
		console.error('A required secret for send-contributor-access-email is not set');
		return json({ error: 'Mail sending is not configured.' }, 500);
	}

	// Only the app's server calls this. With verify_jwt any signed-in user could
	// use it to mail arbitrary addresses, so it checks a shared secret instead.
	if (!timingSafeEqual(req.headers.get('x-islr-secret') ?? '', ISLR_DIGEST_SECRET)) {
		return json({ error: 'Unauthorized' }, 401);
	}

	let email: unknown;
	try {
		({ email } = await req.json());
	} catch {
		return json({ error: 'Invalid JSON body.' }, 400);
	}

	if (typeof email !== 'string' || !email.includes('@')) {
		return json({ error: 'Missing required fields.' }, 400);
	}

	const client = new SMTPClient({
		connection: {
			hostname: 'smtp.gmail.com',
			port: 465,
			tls: true,
			auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
		},
	});

	try {
		await client.send({
			from: GMAIL_USER,
			to: email,
			subject: SUBJECT,
			content: 'auto',
			html: buildContributorAccessEmail(SITE_URL),
		});
		await client.close();
	} catch (error) {
		console.error('Failed to send contributor access email:', error);
		return json({ error: 'Failed to send email.' }, 502);
	}

	return json({ ok: true });
});

function timingSafeEqual(a: string, b: string) {
	const aBytes = new TextEncoder().encode(a);
	const bBytes = new TextEncoder().encode(b);
	let diff = aBytes.length ^ bBytes.length;
	for (let i = 0; i < Math.max(aBytes.length, bBytes.length); i++) {
		diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
	}
	return diff === 0;
}

function json(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
