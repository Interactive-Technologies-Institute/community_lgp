import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { buildConsentPdf } from './pdf.ts';

const GMAIL_USER = Deno.env.get('GMAIL_USER');
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');

const CHOICE_LABELS: Record<string, string> = {
	accept: 'Li e compreendi a informação e autorizo a gravação de vídeos para fins de investigação científica e para a construção do conjunto de dados.',
	decline: 'Li a informação e não autorizo a gravação de vídeos.',
};

interface RequestBody {
	email: string;
	name: string;
	consentText: string;
	signedAt: string;
	choice: 'accept' | 'decline';
}

function isValidBody(body: unknown): body is RequestBody {
	if (typeof body !== 'object' || body === null) return false;
	const b = body as Record<string, unknown>;
	return (
		typeof b.email === 'string' &&
		typeof b.name === 'string' &&
		typeof b.consentText === 'string' &&
		typeof b.signedAt === 'string' &&
		(b.choice === 'accept' || b.choice === 'decline')
	);
}

Deno.serve(async (req) => {
	if (req.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
		console.error('GMAIL_USER or GMAIL_APP_PASSWORD secret is not set');
		return new Response(JSON.stringify({ error: 'Mail sending is not configured.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!isValidBody(body)) {
		return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const { email, name, consentText, signedAt, choice } = body;

	const formattedDate = new Date(signedAt).toLocaleString('pt-PT', {
		dateStyle: 'long',
		timeStyle: 'short',
		timeZone: 'Europe/Lisbon',
	});

	const choiceLabel = CHOICE_LABELS[choice];

	let pdfBytes: Uint8Array;
	try {
		pdfBytes = await buildConsentPdf({
			name,
			email,
			signedAt: formattedDate,
			choiceLabel,
			paragraphs: consentText.split('\n\n'),
		});
	} catch (error) {
		console.error('Failed to build consent PDF:', error);
		return new Response(JSON.stringify({ error: 'Failed to build PDF.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const client = new SMTPClient({
		connection: {
			hostname: 'smtp.gmail.com',
			port: 465,
			tls: true,
			auth: {
				username: GMAIL_USER,
				password: GMAIL_APP_PASSWORD,
			},
		},
	});

	try {
		await client.send({
			from: GMAIL_USER,
			to: email,
			subject: 'Cópia do seu consentimento: Dataset ISLR de LGP',
			content: 'auto',
			html: `
				<p>Olá ${escapeHtml(name)},</p>
				<p>Confirmamos o registo do seu consentimento para o Dataset ISLR de Língua Gestual Portuguesa em ${escapeHtml(formattedDate)}.</p>
				<p>Em anexo encontra uma cópia em PDF do texto do consentimento e da opção que assinou.</p>
			`,
			attachments: [
				{
					filename: 'consentimento-islr.pdf',
					contentType: 'application/pdf',
					encoding: 'binary',
					content: pdfBytes,
				},
			],
		});
		await client.close();
	} catch (error) {
		console.error('Failed to send consent email:', error);
		return new Response(JSON.stringify({ error: 'Failed to send email.' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
});

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
