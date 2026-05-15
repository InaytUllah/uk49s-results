#!/usr/bin/env node
/**
 * Submit canonical UK 49s URLs to Google Indexing API.
 *
 * Runs from GitHub Actions (workflow: cron.yml, job: notify-google) on a
 * once-a-day schedule. Replaces the old /api/notify-google route, which was
 * deleted when the site moved to a static export on Cloudflare Pages.
 *
 * Required env: GOOGLE_SERVICE_ACCOUNT_JSON (stringified service account
 * credentials with `indexing` scope access on the verified property).
 */

import { GoogleAuth } from 'google-auth-library';

const SITE_URL = 'https://uk49sresults.co.uk';
const INDEXING_API_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;

const ALL_DRAW_TYPES = ['brunchtime', 'lunchtime', 'drivetime', 'teatime'];

function fmt(d) {
  return d.toISOString().substring(0, 10);
}

function buildUrls() {
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const yesterday = new Date(nowUK);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayStr = fmt(nowUK);
  const yesterdayStr = fmt(yesterday);

  const urls = new Set();

  // Core + rolling pages
  const core = [
    '/',
    ...ALL_DRAW_TYPES.map(d => `/${d}`),
    '/predictions',
    ...ALL_DRAW_TYPES.map(d => `/${d}-predictions`),
    '/hot-cold-numbers',
    '/numbers',
    '/history',
    '/lunchtime-vs-teatime',
  ];
  for (const p of core) urls.add(`${SITE_URL}${p}`);

  // Recent dated result pages (today + yesterday) for each draw
  for (const drawType of ALL_DRAW_TYPES) {
    urls.add(`${SITE_URL}/${drawType}/results/${todayStr}`);
    urls.add(`${SITE_URL}/${drawType}/results/${yesterdayStr}`);
  }

  return [...urls];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function notifyUrl(accessToken, url) {
  try {
    const response = await fetch(INDEXING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
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

async function main() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.error('FATAL: GOOGLE_SERVICE_ACCOUNT_JSON is not set');
    process.exit(1);
  }

  let credentials;
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch (err) {
    console.error(`FATAL: Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: ${err}`);
    process.exit(1);
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;
  if (!accessToken) {
    console.error('FATAL: Failed to obtain Google access token');
    process.exit(1);
  }

  const urls = buildUrls();
  console.log(`Submitting ${urls.length} URLs to Google Indexing API...`);

  const results = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(url => notifyUrl(accessToken, url)));
    results.push(...batchResults);
    if (i + BATCH_SIZE < urls.length) await sleep(BATCH_DELAY_MS);
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.length - succeeded;
  console.log(`Done: ${succeeded} succeeded, ${failed} failed`);

  if (failed > 0) {
    console.log('Failed URLs:');
    for (const r of results.filter(x => !x.success)) {
      console.log(`  ${r.url} — ${r.error}`);
    }
  }

  // Exit 0 even on partial failure — Google rate-limits sometimes, not a
  // workflow failure. Only exit non-zero on a complete failure.
  if (succeeded === 0 && failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
