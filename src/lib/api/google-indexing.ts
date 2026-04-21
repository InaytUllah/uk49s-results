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
 *
 * We do NOT submit dated prediction blog URLs because Google's spam update
 * flags daily near-duplicate pages as scaled content abuse. The rolling
 * /lunchtime-predictions and /teatime-predictions hub URLs serve as the
 * canonical daily prediction endpoints.
 */
export async function buildNotificationUrls(): Promise<string[]> {
  const fmt = (d: Date) => d.toISOString().substring(0, 10);
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const todayStr = fmt(nowUK);

  const urls = new Set<string>();

  // Today's result pages (unique per date — Google indexes these well)
  urls.add(`${SITE_URL}/lunchtime/results/${todayStr}`);
  urls.add(`${SITE_URL}/teatime/results/${todayStr}`);

  // Rolling hub pages (same URL, refreshed content — Google loves this pattern)
  urls.add(`${SITE_URL}/predictions`);
  urls.add(`${SITE_URL}/lunchtime-predictions`);
  urls.add(`${SITE_URL}/teatime-predictions`);
  urls.add(`${SITE_URL}/hot-cold-numbers`);
  urls.add(`${SITE_URL}/numbers`);

  return [...urls];
}

/**
 * Build a broader set of URLs for the daily full indexing run.
 * Only includes pages Google is likely to actually index:
 *  - core static pages (unique content per URL)
 *  - recent result pages (unique numbers per date)
 *  - rolling hub pages (stable URL, fresh content)
 *
 * We skip dated prediction blog URLs — those are noindexed.
 */
export async function buildDailyNotificationUrls(): Promise<string[]> {
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const yesterday = new Date(nowUK);
  yesterday.setDate(yesterday.getDate() - 1);

  const fmt = (d: Date) => d.toISOString().substring(0, 10);
  const todayStr = fmt(nowUK);
  const yesterdayStr = fmt(yesterday);

  const urls = new Set<string>();

  // Core static + rolling pages
  const corePages = [
    '/',
    '/lunchtime',
    '/teatime',
    '/predictions',
    '/lunchtime-predictions',
    '/teatime-predictions',
    '/hot-cold-numbers',
    '/numbers',
    '/history',
    '/lunchtime-vs-teatime',
  ];
  for (const page of corePages) {
    urls.add(`${SITE_URL}${page}`);
  }

  // Recent result pages (unique content per date)
  for (const game of ['lunchtime', 'teatime']) {
    urls.add(`${SITE_URL}/${game}/results/${todayStr}`);
    urls.add(`${SITE_URL}/${game}/results/${yesterdayStr}`);
  }

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
