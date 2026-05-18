/**
 * Cloudflare Pages Function — live UK 49s draws endpoint.
 *
 * Runs on Cloudflare's edge for every request to /api/draws.json.
 * Scrapes the same 3 data sources used at build time, returns today's
 * result for each draw type as JSON. Cached at the edge for 30 seconds
 * so we don't hammer upstream sources.
 *
 * Why this exists:
 *   The static site is rebuilt every ~5–15 min by GitHub Actions, which
 *   means there's a 5–20 min lag between a draw and users seeing the
 *   numbers. This endpoint is polled client-side from UpcomingDraw.tsx
 *   so users see results within ~30–60 sec without waiting for a rebuild.
 *
 * Architecture:
 *   - Free tier safe (Pages Functions: 100k requests/day, no minute cap)
 *   - Edge-cached 30s via caches.default, so worst-case ~2,880 invocations
 *     per CF edge per day even at sustained load
 *   - Same scraping logic mirrors src/lib/data/draws.ts for parity
 */

type DrawType = 'brunchtime' | 'lunchtime' | 'drivetime' | 'teatime';

interface DrawResult {
  date: string;          // ISO 'YYYY-MM-DD'
  drawType: DrawType;
  numbers: number[];     // 6 main numbers
  booster: number;       // bonus ball
  drawTime: string;      // UK label, e.g. '10:49 AM'
}

const DRAW_TIME: Record<DrawType, string> = {
  brunchtime: '10:49 AM',
  lunchtime: '12:49 PM',
  drivetime: '4:49 PM',
  teatime: '5:49 PM',
};

const ALL_DRAW_TYPES: DrawType[] = ['brunchtime', 'lunchtime', 'drivetime', 'teatime'];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const MONTHS: Record<string, string> = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};

function todayUK(): string {
  const now = new Date();
  // toLocaleString with Europe/London handles BST/GMT automatically
  const uk = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return uk.toISOString().substring(0, 10);
}

// ============================================================
// Source 1: za.national-lottery.com — fastest for latest result
// ============================================================
function parseZADate(dateStr: string): string {
  // "Friday, 20 March 2026" → "2026-03-20"
  const cleaned = dateStr.replace(/,/g, '').trim();
  const parts = cleaned.split(/\s+/);
  if (parts.length < 4) return '';
  const day = parts[1].padStart(2, '0');
  const month = MONTHS[parts[2]] || '01';
  const year = parts[3];
  return `${year}-${month}-${day}`;
}

async function scrapeZA(drawType: DrawType): Promise<DrawResult | null> {
  try {
    const res = await fetch(
      `https://za.national-lottery.com/uk-49s/results/${drawType}`,
      { headers: { 'User-Agent': UA }, cf: { cacheTtl: 30, cacheEverything: true } } as RequestInit
    );
    if (!res.ok) return null;
    const html = await res.text();

    // Find first date header — that's the most recent draw
    const dateMatch = /class="h2 fluid">([^<]+\d{4})<\/span>/.exec(html);
    if (!dateMatch) return null;
    const date = parseZADate(dateMatch[1]);
    if (!date) return null;

    // Extract section up to next date (or end)
    const sectionStart = dateMatch.index;
    const nextDateRegex = /class="h2 fluid">[^<]+\d{4}<\/span>/g;
    nextDateRegex.lastIndex = sectionStart + dateMatch[0].length;
    const nextDateMatch = nextDateRegex.exec(html);
    const sectionEnd = nextDateMatch ? nextDateMatch.index : html.length;
    const section = html.substring(sectionStart, sectionEnd);

    const mainNumbers: number[] = [];
    let booster = 0;
    const ballRegex = /class="result ball uk49s (ball|bonus-ball) fluid">(\d+)/g;
    let m: RegExpExecArray | null;
    while ((m = ballRegex.exec(section)) !== null) {
      if (m[1] === 'ball' && mainNumbers.length < 6) mainNumbers.push(parseInt(m[2], 10));
      else if (m[1] === 'bonus-ball' && booster === 0) booster = parseInt(m[2], 10);
    }

    if (mainNumbers.length !== 6 || booster <= 0) return null;
    return { date, drawType, numbers: mainNumbers, booster, drawTime: DRAW_TIME[drawType] };
  } catch {
    return null;
  }
}

// ============================================================
// Source 2: 49s.events — full history fallback
// ============================================================
function parseEventsDate(dateStr: string): string {
  // "Wednesday 18 March 2026" (ordinal stripped) → "2026-03-18"
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
  const parts = cleaned.split(/\s+/);
  if (parts.length < 4) return '';
  const day = parts[1].padStart(2, '0');
  const month = MONTHS[parts[2]] || '01';
  const year = parts[3];
  return `${year}-${month}-${day}`;
}

async function scrapeEvents(drawType: DrawType): Promise<DrawResult | null> {
  try {
    const res = await fetch(`https://49s.events/${drawType}`, {
      headers: { 'User-Agent': UA },
      cf: { cacheTtl: 30, cacheEverything: true },
    } as RequestInit);
    if (!res.ok) return null;
    const html = await res.text();

    const dateRegex =
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d+)(?:<sup>)?(?:st|nd|rd|th)(?:<\/sup>)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/;
    const dateMatch = dateRegex.exec(html);
    if (!dateMatch) return null;

    const cleanDate = `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]} ${dateMatch[4]}`;
    const date = parseEventsDate(cleanDate);
    if (!date) return null;

    // Skip if it's a future date — sanity check
    if (date > todayUK()) return null;

    // Take section from this header to next (or end)
    const sectionStart = dateMatch.index;
    const nextDateRegex = new RegExp(dateRegex.source, 'g');
    nextDateRegex.lastIndex = sectionStart + dateMatch[0].length;
    const nextMatch = nextDateRegex.exec(html);
    const sectionEnd = nextMatch ? nextMatch.index : html.length;
    const section = html.substring(sectionStart, sectionEnd);

    const mainNumbers: number[] = [];
    let booster = 0;
    const ballRegex = /class="result\s+(ball|bonus-ball)\s+pngfix">(\d+)/g;
    let m: RegExpExecArray | null;
    while ((m = ballRegex.exec(section)) !== null) {
      if (m[1] === 'ball' && mainNumbers.length < 6) mainNumbers.push(parseInt(m[2], 10));
      else if (m[1] === 'bonus-ball' && booster === 0) booster = parseInt(m[2], 10);
    }

    if (mainNumbers.length !== 6 || booster <= 0) return null;
    return { date, drawType, numbers: mainNumbers, booster, drawTime: DRAW_TIME[drawType] };
  } catch {
    return null;
  }
}

// ============================================================
// Source 3: official 49s.co.uk — JSON-LD fallback (all 4 draws in one fetch)
// ============================================================
interface OfficialBlock {
  '@type'?: string;
  name?: string;
  startDate?: string;
  resultNumbers?: number[];
  bonusNumbers?: number[];
}

async function scrapeOfficial(): Promise<Partial<Record<DrawType, DrawResult>>> {
  try {
    const res = await fetch('https://49s.co.uk/49s/results', {
      headers: { 'User-Agent': UA },
      cf: { cacheTtl: 30, cacheEverything: true },
    } as RequestInit);
    if (!res.ok) return {};
    const html = await res.text();

    const out: Partial<Record<DrawType, DrawResult>> = {};
    const parts = html.split('application/ld+json');
    for (let i = 1; i < parts.length; i++) {
      const start = parts[i].indexOf('>') + 1;
      const end = parts[i].indexOf('</script>');
      if (start <= 0 || end <= start) continue;

      try {
        const data: OfficialBlock = JSON.parse(parts[i].substring(start, end).trim());
        if (data['@type'] !== 'Event' || !data.resultNumbers || !data.bonusNumbers) continue;

        const name = data.name || '';
        let drawType: DrawType | null = null;
        if (name.includes('Brunchtime')) drawType = 'brunchtime';
        else if (name.includes('Lunchtime')) drawType = 'lunchtime';
        else if (name.includes('Drivetime')) drawType = 'drivetime';
        else if (name.includes('Teatime')) drawType = 'teatime';
        else continue;

        const date = (data.startDate || '').substring(0, 10);
        if (!date) continue;

        // Keep only the most recent per draw type
        if (!out[drawType] || date > out[drawType]!.date) {
          out[drawType] = {
            date,
            drawType,
            numbers: data.resultNumbers,
            booster: data.bonusNumbers[0],
            drawTime: DRAW_TIME[drawType],
          };
        }
      } catch {
        /* skip malformed JSON-LD block */
      }
    }
    return out;
  } catch {
    return {};
  }
}

// ============================================================
// Handler
// ============================================================
interface PagesContext {
  request: Request;
  waitUntil: (promise: Promise<unknown>) => void;
}

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const url = new URL(context.request.url);
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const cache = (globalThis as unknown as { caches: { default: Cache } }).caches.default;

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const today = todayUK();

  // Fetch all sources in parallel:
  //   - 1 request to official (returns all 4 draws via JSON-LD)
  //   - 2 requests per draw (ZA + events) = 8 requests
  // Nested Promise.all keeps types clean — outer destructure gives proper
  // `Partial<Record<DrawType, DrawResult>>` for official and `(DrawResult|null)[]`
  // for perDraw, instead of TS inferring a wide union over the flat array.
  const [official, perDraw] = await Promise.all([
    scrapeOfficial(),
    Promise.all(ALL_DRAW_TYPES.flatMap(d => [scrapeZA(d), scrapeEvents(d)])),
  ]);

  // Build result per draw type: prefer most recent date, ties favour ZA > events > official
  const results: Record<DrawType, DrawResult | null> = {
    brunchtime: null,
    lunchtime: null,
    drivetime: null,
    teatime: null,
  };

  for (let i = 0; i < ALL_DRAW_TYPES.length; i++) {
    const dt = ALL_DRAW_TYPES[i];
    const za = perDraw[i * 2];
    const ev = perDraw[i * 2 + 1];
    const off = official[dt] || null;

    const candidates = [za, ev, off].filter((r): r is DrawResult => r !== null);
    if (candidates.length === 0) continue;
    candidates.sort((a, b) => b.date.localeCompare(a.date));
    results[dt] = candidates[0];
  }

  const body = JSON.stringify({
    fetchedAt: new Date().toISOString(),
    today,
    results,
  });

  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Edge cache 30s, allow stale for another 60s while we refresh in bg.
      // Browser cache only 10s so polling clients don't get stuck on stale.
      'Cache-Control': 'public, s-maxage=30, max-age=10, stale-while-revalidate=60',
      // Same-origin call so CORS isn't strictly needed, but be permissive.
      'Access-Control-Allow-Origin': '*',
    },
  });

  // Cache the response at the edge for subsequent requests
  context.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
};
