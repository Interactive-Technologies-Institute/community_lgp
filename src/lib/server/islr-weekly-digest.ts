import { env } from '$env/dynamic/private';

// Must match signUnsubscribeToken in
// supabase/functions/send-islr-weekly-digest/index.ts, which signs the
// unsubscribe links put in the weekly digest email.
async function signUnsubscribeToken(contributorId: string, secret: string) {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign(
		'HMAC',
		key,
		new TextEncoder().encode(`islr-weekly-digest-unsubscribe:${contributorId}`)
	);
	return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function isValidUnsubscribeToken(contributorId: string, token: string) {
	const secret = env.ISLR_DIGEST_SECRET;
	if (!secret) {
		console.error('ISLR_DIGEST_SECRET is not set');
		return false;
	}

	const expected = await signUnsubscribeToken(contributorId, secret);
	if (expected.length !== token.length) return false;

	let diff = 0;
	for (let i = 0; i < expected.length; i++) {
		diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
	}
	return diff === 0;
}
