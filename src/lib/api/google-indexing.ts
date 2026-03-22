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
 * Build the standard set of URLs to notify after results are updated.
 * Includes static pages + dynamic date-based result/prediction pages.
 */
export function buildNotificationUrls(additionalUrls: string[] = []): string[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const fmt = (d: Date) => d.toISOString().substring(0, 10);
  const todayStr = fmt(today);
  const tomorrowStr = fmt(tomorrow);
  const yesterdayStr = fmt(yesterday);

  const games = ['lunchtime', 'teatime'];

  const urls = new Set<string>();

  // Static pages
  const staticPages = [
    '/',
    '/lunchtime',
    '/teatime',
    '/predictions',
    '/hot-cold-numbers',
    '/numbers',
    '/history',
    '/blog',
  ];
  for (const page of staticPages) {
    urls.add(`${SITE_URL}${page}`);
  }

  // Dynamic result pages for today and yesterday
  for (const game of games) {
    urls.add(`${SITE_URL}/${game}/results/${todayStr}`);
    urls.add(`${SITE_URL}/${game}/results/${yesterdayStr}`);
  }

  // Dynamic blog posts — result posts for today and yesterday
  for (const game of games) {
    urls.add(`${SITE_URL}/blog/uk-49s-${game}-results-${todayStr}`);
    urls.add(`${SITE_URL}/blog/uk-49s-${game}-results-${yesterdayStr}`);
  }

  // Dynamic blog posts — prediction posts for today and tomorrow
  urls.add(`${SITE_URL}/blog/uk-49s-predictions-${todayStr}`);
  urls.add(`${SITE_URL}/blog/uk-49s-predictions-${tomorrowStr}`);

  // Additional URLs passed in
  for (const url of additionalUrls) {
    urls.add(url.startsWith('http') ? url : `${SITE_URL}${url}`);
  }

  return [...urls];
}
