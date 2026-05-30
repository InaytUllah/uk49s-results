// Accumulating results history for static export.
//
// WHY: the live sources (49s.events / za.national-lottery) only return the last
// ~10 draws. Pages are pre-rendered per date, so once a date rolls out of that
// window it stops being generated and 404s — even though Google already indexed
// it. That churn (hundreds of 404s) is bad for SEO. This script scrapes the
// recent window and MERGES it into a committed JSON store that only ever grows,
// so every date we have ever published keeps rendering 200 forever.
//
// Runs in CI before `next build` (and can be run locally to seed). It never
// deletes existing entries and never fabricates data — it only adds real,
// freshly scraped draws.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HISTORY_PATH = resolve(__dirname, '../src/lib/data/results-history.json');

const DRAW_TYPES = ['brunchtime', 'lunchtime', 'drivetime', 'teatime'];
const DRAW_TIME = {
  brunchtime: '10:49 AM',
  lunchtime: '12:49 PM',
  drivetime: '4:49 PM',
  teatime: '5:49 PM',
};
const MONTHS = {
  January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
  July: '07', August: '08', September: '09', October: '10', November: '11', December: '12',
};

function toISO(weekday, day, month, year) {
  const mm = MONTHS[month];
  if (!mm) return null;
  return `${year}-${mm}-${String(day).padStart(2, '0')}`;
}

async function scrapeDraw(drawType) {
  const url = `https://49s.events/${drawType}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) {
    console.error(`  ${drawType}: HTTP ${res.status} — skipping`);
    return [];
  }
  const html = await res.text();

  const dateRegex =
    /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d+)(?:<sup>)?(?:st|nd|rd|th)(?:<\/sup>)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/g;
  const dateMatches = [];
  let m;
  while ((m = dateRegex.exec(html)) !== null) {
    const iso = toISO(m[1], m[2], m[3], m[4]);
    if (iso) dateMatches.push({ iso, index: m.index });
  }

  const todayISO = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })
  )
    .toISOString()
    .substring(0, 10);

  const out = [];
  const seen = new Set();
  for (let i = 0; i < dateMatches.length; i++) {
    const isoDate = dateMatches[i].iso;
    if (isoDate > todayISO) continue; // never trust future-dated rows
    if (seen.has(isoDate)) continue;

    const start = dateMatches[i].index;
    const end = i + 1 < dateMatches.length ? dateMatches[i + 1].index : html.length;
    const section = html.substring(start, end);

    const ballRegex = /class="result\s+(ball|bonus-ball)\s+pngfix">(\d+)/g;
    const numbers = [];
    let booster = 0;
    let b;
    while ((b = ballRegex.exec(section)) !== null) {
      const type = b[1];
      const num = parseInt(b[2], 10);
      if (type === 'ball' && numbers.length < 6) numbers.push(num);
      else if (type === 'bonus-ball' && booster === 0) booster = num;
    }

    if (numbers.length === 6 && booster > 0) {
      seen.add(isoDate);
      out.push({ date: isoDate, drawType, numbers, booster, drawTime: DRAW_TIME[drawType] });
    }
  }
  return out;
}

async function loadHistory() {
  try {
    const raw = await readFile(HISTORY_PATH, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function main() {
  const existing = await loadHistory();
  // Key by date+drawType so we never duplicate and never delete.
  const map = new Map();
  for (const r of existing) map.set(`${r.date}|${r.drawType}`, r);
  const before = map.size;

  let scrapedTotal = 0;
  for (const dt of DRAW_TYPES) {
    try {
      const rows = await scrapeDraw(dt);
      scrapedTotal += rows.length;
      for (const r of rows) {
        const key = `${r.date}|${r.drawType}`;
        // Keep existing entry if present (already verified & committed); only ADD new.
        if (!map.has(key)) map.set(key, r);
      }
      console.log(`  ${dt}: scraped ${rows.length} draws`);
    } catch (err) {
      console.error(`  ${dt}: scrape failed — ${err.message} (keeping existing data)`);
    }
  }

  // Safety: if every source failed, do NOT overwrite the committed file with less.
  if (scrapedTotal === 0 && before > 0) {
    console.log('All scrapes returned 0 rows; leaving committed history untouched.');
    return;
  }

  const merged = [...map.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.drawType.localeCompare(b.drawType)
  );

  await mkdir(dirname(HISTORY_PATH), { recursive: true });
  await writeFile(HISTORY_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');

  const added = map.size - before;
  console.log(
    `History: ${before} -> ${map.size} entries (+${added} new). Range ${merged[merged.length - 1]?.date} .. ${merged[0]?.date}`
  );
}

main().catch((err) => {
  console.error('update-history failed:', err);
  process.exit(1);
});
