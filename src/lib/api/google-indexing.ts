import { GoogleAuth } from 'google-auth-library';
import { SITE_URL } from '@/lib/data/seo';

const INDEXING_API_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;

interface IndexingResult {
  url: string;
  success: boolean;
  error?: string;
}

interface NotifyResult {
  total: number;
  succeeded: number;
  failed: number;
  results: IndexingResult[];
}

function getAuth(): { auth: GoogleAuth } | { error: string } {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return { error: `GOOGLE_SERVICE_ACCOUNT_JSON not set (env keys: ${Object.keys(process.env).filter(k => k.includes('GOOGLE')).join(', ') || 'none with GOOGLE'})` };
  }

  try {
    const credentials = JSON.parse(serviceAccountJson);
    return {
      auth: new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      }),
    };
  } catch (err) {
    return { error: `Failed to parse JSON (length=${serviceAccountJson.length}): ${String(err)}` };
  }
}

async function notifyUrl(accessToken: string, url: string): Promise<IndexingResult> {
  try {
    const response = await fetch(INDEXING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type: 'URL_UPDATED',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { url, success: false, error: `${response.status}: ${errorText}` };
    }

    return { url, success: true };
  } catch (err) {
    return { url, success: false, error: String(err) };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function notifyGoogleIndexing(urls: string[]): Promise<NotifyResult> {
  const authResult = getAuth();
  if ('error' in authResult) {
    return { total: urls.length, succeeded: 0, failed: urls.length, results: urls.map(url => ({ url, success: false, error: authResult.error })) };
  }

  let accessToken: string | null | undefined;
  try {
    const client = await authResult.auth.getClient();
    const tokenResponse = await client.getAccessToken();
    accessToken = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;
  } catch (err) {
    const errMsg = `Auth failed: ${String(err)}`;
    return { total: urls.length, succeeded: 0, failed: urls.length, results: urls.map(url => ({ url, success: false, error: errMsg })) };
  }

  if (!accessToken) {
    return { total: urls.length, succeeded: 0, failed: urls.length, results: urls.map(url => ({ url, success: false, error: 'Failed to get access token' })) };
  }

  const results: IndexingResult[] = [];

  // Process in batches of BATCH_SIZE with BATCH_DELAY_MS between batches
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(url => notifyUrl(accessToken, url))
    );
    results.push(...batchResults);

    // Delay between batches (not after the last one)
    if (i + BATCH_SIZE < urls.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const succeeded = results.filter(r => r.success).length;
  return {
    total: urls.length,
    succeeded,
    failed: urls.length - succeeded,
    results,
  };
}

/**
 * Build a focused set of URLs for draw-time cron notifications.
 * Only submits genuinely new/changed pages — NOT the entire site.
 */
export function buildNotificationUrls(): string[] {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().substring(0, 10);
  const todayStr = fmt(today);

  const urls = new Set<string>();

  // Only today's result pages (the new content)
  urls.add(`${SITE_URL}/lunchtime/results/${todayStr}`);
  urls.add(`${SITE_URL}/teatime/results/${todayStr}`);

  // Predictions pages (update after each draw)
  urls.add(`${SITE_URL}/predictions`);
  urls.add(`${SITE_URL}/lunchtime-predictions`);
  urls.add(`${SITE_URL}/teatime-predictions`);

  // Today's prediction blog posts (separate for each draw)
  urls.add(`${SITE_URL}/blog/uk-49s-lunchtime-predictions-${todayStr}`);
  urls.add(`${SITE_URL}/blog/uk-49s-teatime-predictions-${todayStr}`);

  return [...urls];
}

/**
 * Build a broader set of URLs for the daily full indexing run.
 * Includes core static pages + recent dynamic content.
 */
export function buildDailyNotificationUrls(): string[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const fmt = (d: Date) => d.toISOString().substring(0, 10);
  const todayStr = fmt(today);
  const yesterdayStr = fmt(yesterday);
  const tomorrowStr = fmt(tomorrow);

  const urls = new Set<string>();

  // Core static pages only (not the whole site)
  const corePages = ['/', '/lunchtime', '/teatime', '/predictions', '/hot-cold-numbers', '/numbers', '/blog'];
  for (const page of corePages) {
    urls.add(`${SITE_URL}${page}`);
  }

  // Recent result pages (today + yesterday)
  for (const game of ['lunchtime', 'teatime']) {
    urls.add(`${SITE_URL}/${game}/results/${todayStr}`);
    urls.add(`${SITE_URL}/${game}/results/${yesterdayStr}`);
  }

  // Recent prediction blog posts (separate for each draw)
  urls.add(`${SITE_URL}/blog/uk-49s-lunchtime-predictions-${todayStr}`);
  urls.add(`${SITE_URL}/blog/uk-49s-teatime-predictions-${todayStr}`);
  urls.add(`${SITE_URL}/blog/uk-49s-lunchtime-predictions-${tomorrowStr}`);
  urls.add(`${SITE_URL}/blog/uk-49s-teatime-predictions-${tomorrowStr}`);

  return [...urls];
}

/**
 * Fetch ALL URLs from the live sitemap.xml and return them.
 * Used for daily full-site indexing submissions.
 */
export async function fetchAllSitemapUrls(): Promise<string[]> {
  try {
    const response = await fetch(`${SITE_URL}/sitemap.xml`, { cache: 'no-store' });
    if (!response.ok) return [];
    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    return urls;
  } catch (err) {
    console.error('Failed to fetch sitemap:', err);
    return [];
  }
}
