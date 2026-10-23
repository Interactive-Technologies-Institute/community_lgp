import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.45.4';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';
import { buildDigestEmail, type DigestInput } from './content.ts';

const GMAIL_USER = Deno.env.get('GMAIL_USER');
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
// Shared with the SvelteKit app: authenticates the cron call here and signs
// the unsubscribe links verified by /islr-dataset/unsubscribe.
const ISLR_DIGEST_SECRET = Deno.env.get('ISLR_DIGEST_SECRET');
const SITE_URL = Deno.env.get('SITE_URL')?.replace(/\/$/, '');

const PAGE_SIZE = 1000;
const ALLOWED_ROLES = new Set(['admin', 'moderator', 'contributor']);

interface RequestBody {
	// Build the emails and return them without sending or marking anything.
	dryRun?: boolean;
	// Restrict the run to these contributors (handy for testing).
	contributorIds?: string[];
}

Deno.serve(async (req) => {
	if (req.method !== 'POST') {
		return json({ error: 'Method not allowed' }, 405);
	}

	if (
		!GMAIL_USER ||
		!GMAIL_APP_PASSWORD ||
		!SUPABASE_URL ||
		!SUPABASE_SERVICE_ROLE_KEY ||
		!ISLR_DIGEST_SECRET ||
		!SITE_URL
	) {
		console.error('A required secret for send-islr-weekly-digest is not set');
		return json({ error: 'Weekly digest is not configured.' }, 500);
	}

	// verify_jwt is off for this function (pg_cron has no user JWT), so this
	// header is the only thing stopping anyone from triggering a mail-out.
	if (!timingSafeEqual(req.headers.get('x-digest-secret') ?? '', ISLR_DIGEST_SECRET)) {
		return json({ error: 'Unauthorized' }, 401);
	}

	let body: RequestBody = {};
	try {
		body = (await req.json()) ?? {};
	} catch {
		// An empty body is fine: it's what the cron job sends.
	}

	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false },
	});

	try {
		return await run(supabase, body);
	} catch (error) {
		console.error('Weekly digest failed:', error);
		return json({ error: 'Weekly digest failed.' }, 500);
	}
});

async function run(supabase: SupabaseClient, body: RequestBody) {
	const { data: flag, error: flagError } = await supabase
		.from('feature_flags')
		.select('enabled')
		.eq('id', 'islrdatasetcontribute')
		.maybeSingle();
	if (flagError) throw flagError;
	if (!flag?.enabled) {
		return json({ ok: true, skipped: 'ISLR feature is disabled.' });
	}

	// Runs on Monday morning and reports on the week that just ended
	// (Monday 00:00 to Sunday 23:59, UTC).
	const weekEnd = startOfWeek(new Date());
	const weekStart = new Date(weekEnd);
	weekStart.setUTCDate(weekStart.getUTCDate() - 7);
	const weekStartDate = weekStart.toISOString().slice(0, 10);

	let contributorsQuery = supabase
		.from('islr_contributors')
		.select('id, weekly_digest_last_sent_week')
		.eq('weekly_digest_enabled', true);
	if (body.contributorIds?.length) {
		contributorsQuery = contributorsQuery.in('id', body.contributorIds);
	}
	const { data: contributorRows, error: contributorsError } = await contributorsQuery;
	if (contributorsError) throw contributorsError;

	const contributors = contributorRows.filter(
		(c) => body.dryRun || c.weekly_digest_last_sent_week !== weekStartDate
	);
	if (contributors.length === 0) {
		return json({ ok: true, sent: 0 });
	}
	const contributorIds = contributors.map((c) => c.id);

	const [submissions, profiles, roles] = await Promise.all([
		getSubmissions(supabase, contributorIds),
		getRows(supabase, 'profiles', 'id, display_name, email', contributorIds),
		getRows(supabase, 'user_roles', 'id, role', contributorIds),
	]);

	// Same rule as the dashboard: status is ignored, since there is no peer
	// review and every submitted video counts.
	const totals = new Map<string, number>();
	const weekly = new Map<string, number>();

	for (const s of submissions) {
		const insertedAt = new Date(s.inserted_at);

		// Personal totals stop at the end of the reported week, so milestones
		// line up with it even if someone records early on Monday.
		if (insertedAt >= weekEnd) continue;
		totals.set(s.contributor_id, (totals.get(s.contributor_id) ?? 0) + 1);

		if (insertedAt < weekStart) continue;
		weekly.set(s.contributor_id, (weekly.get(s.contributor_id) ?? 0) + 1);
	}

	const profileById = new Map(profiles.map((p) => [p.id, p]));
	const roleById = new Map(roles.map((r) => [r.id, r.role]));

	const client = body.dryRun
		? null
		: new SMTPClient({
				connection: {
					hostname: 'smtp.gmail.com',
					port: 465,
					tls: true,
					auth: { username: GMAIL_USER!, password: GMAIL_APP_PASSWORD! },
				},
			});

	const results: {
		contributorId: string;
		status: string;
		kind?: string;
		subject?: string;
		html?: string;
	}[] = [];

	for (const contributor of contributors) {
		const id = contributor.id;

		// A contributor whose role was removed can no longer open the
		// recording page, so inviting them back would only lead to a redirect.
		if (!ALLOWED_ROLES.has(roleById.get(id) ?? '')) {
			results.push({ contributorId: id, status: 'skipped: role' });
			continue;
		}

		const email = profileById.get(id)?.email ?? (await getAuthEmail(supabase, id));
		if (!email) {
			results.push({ contributorId: id, status: 'skipped: no email' });
			continue;
		}

		const input: DigestInput = {
			firstName: profileById.get(id)?.display_name?.trim().split(' ')[0] || null,
			videosThisWeek: weekly.get(id) ?? 0,
			totalVideos: totals.get(id) ?? 0,
			links: {
				record: `${SITE_URL}/islr-dataset/record`,
				tutorial: `${SITE_URL}/islr-dataset/tutorial`,
				dashboard: `${SITE_URL}/islr-dataset/dashboard`,
				badges: `${SITE_URL}/img/badges`,
				unsubscribe: `${SITE_URL}/islr-dataset/unsubscribe?u=${id}&t=${await signUnsubscribeToken(id)}`,
			},
		};
		const digest = buildDigestEmail(input);

		if (!client) {
			results.push({
				contributorId: id,
				status: 'dry run',
				kind: digest.kind,
				subject: digest.subject,
				html: digest.html,
			});
			continue;
		}

		try {
			await client.send({
				from: GMAIL_USER!,
				to: email,
				subject: digest.subject,
				content: 'auto',
				html: digest.html,
			});
		} catch (error) {
			console.error(`Failed to send weekly digest to ${id}:`, error);
			results.push({ contributorId: id, status: 'failed' });
			continue;
		}

		const { error: markError } = await supabase
			.from('islr_contributors')
			.update({ weekly_digest_last_sent_week: weekStartDate })
			.eq('id', id);
		if (markError) console.error(`Sent weekly digest to ${id} but failed to record it:`, markError);

		results.push({ contributorId: id, status: 'sent', kind: digest.kind });
	}

	await client?.close();

	const sent = results.filter((r) => r.status === 'sent').length;
	const failed = results.filter((r) => r.status === 'failed').length;
	console.log(
		`Weekly digest for ${weekStartDate}: ${sent} sent, ${failed} failed, ${results.length} considered`
	);

	return json({ ok: failed === 0, weekStart: weekStartDate, sent, failed, results });
}

function getSubmissions(supabase: SupabaseClient, contributorIds: string[]) {
	return getAllPages<{ contributor_id: string; inserted_at: string }>((from, to) =>
		supabase
			.from('islr_submissions')
			.select('contributor_id, inserted_at')
			.in('contributor_id', contributorIds)
			.order('id', { ascending: true })
			.range(from, to)
	);
}

async function getRows(
	supabase: SupabaseClient,
	table: 'profiles' | 'user_roles',
	columns: string,
	ids: string[]
) {
	const { data, error } = await supabase.from(table).select(columns).in('id', ids);
	if (error) throw error;
	// deno-lint-ignore no-explicit-any
	return data as any[];
}

// PostgREST caps each response (1000 rows by default), so page through.
async function getAllPages<T>(
	fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>
) {
	const rows: T[] = [];
	for (let from = 0; ; from += PAGE_SIZE) {
		const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
		if (error) throw error;
		rows.push(...(data ?? []));
		if (!data || data.length < PAGE_SIZE) return rows;
	}
}

// Profiles rows have been deleted by hand before without touching auth.users,
// so fall back to the auth record for the address.
async function getAuthEmail(supabase: SupabaseClient, id: string) {
	const { data, error } = await supabase.auth.admin.getUserById(id);
	if (error) {
		console.error(`Failed to look up auth user ${id}:`, error);
		return null;
	}
	return data.user?.email ?? null;
}

// Weeks start on Monday, in UTC, matching the dashboard's weekly chart.
function startOfWeek(date: Date): Date {
	const start = new Date(date);
	const day = start.getUTCDay();
	start.setUTCDate(start.getUTCDate() + ((day === 0 ? -6 : 1) - day));
	start.setUTCHours(0, 0, 0, 0);
	return start;
}

// Must match signUnsubscribeToken in src/lib/server/islr-weekly-digest.ts.
async function signUnsubscribeToken(contributorId: string) {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(ISLR_DIGEST_SECRET),
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
