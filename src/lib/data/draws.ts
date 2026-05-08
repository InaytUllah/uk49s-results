import { UK49sResult, DrawType, ALL_DRAW_TYPES, DRAW_META } from '../types';
import { unstable_cache } from 'next/cache';

// Draw schedule (UK time) — kept for backward compat
export const DRAW_SCHEDULE = {
  brunchtime: '10:49 AM',
  lunchtime: '12:49 PM',
  drivetime: '4:49 PM',
  teatime: '5:49 PM',
};

// ============================================================
// FASTEST SOURCE: za.national-lottery.com
// Updates within minutes of draw, correct dates, no date-shift
// ============================================================

function parseZADate(dateStr: string): string {
  // Convert "Friday, 20 March 2026" to "2026-03-20"
  const months: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };
  const cleaned = dateStr.replace(/,/g, '').trim();
  const parts = cleaned.split(/\s+/);
  // parts: ["Friday", "20", "March", "2026"]
  if (parts.length < 4) return '';
  const day = parts[1].padStart(2, '0');
  const month = months[parts[2]] || '01';
  const year = parts[3];
  return `${year}-${month}-${day}`;
}

async function scrapeZANationalLottery(drawType: DrawType): Promise<UK49sResult[]> {
  try {
    const url = `https://za.national-lottery.com/uk-49s/results/${drawType}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const html = await response.text();
    const results: UK49sResult[] = [];

    // Find date headers: <span class="h2 fluid">Friday, 20 March 2026</span>
    const dateRegex = /class="h2 fluid">([^<]+\d{4})<\/span>/g;
    const dateMatches: { date: string; index: number }[] = [];
    let dateMatch;
    while ((dateMatch = dateRegex.exec(html)) !== null) {
      const parsed = parseZADate(dateMatch[1]);
      if (parsed) {
        dateMatches.push({ date: parsed, index: dateMatch.index });
      }
    }

    for (let i = 0; i < dateMatches.length; i++) {
      const sectionStart = dateMatches[i].index;
      const sectionEnd = i + 1 < dateMatches.length ? dateMatches[i + 1].index : html.length;
      const section = html.substring(sectionStart, sectionEnd);

      // Extract balls: <li class="result ball uk49s ball fluid">18</li>
      // Extract bonus: <li class="result ball uk49s bonus-ball fluid">39</li>
      const mainNumbers: number[] = [];
      let booster = 0;

      const ballRegex = /class="result ball uk49s (ball|bonus-ball) fluid">(\d+)/g;
      let match;
      while ((match = ballRegex.exec(section)) !== null) {
        if (match[1] === 'ball' && mainNumbers.length < 6) {
          mainNumbers.push(parseInt(match[2]));
        } else if (match[1] === 'bonus-ball' && booster === 0) {
          booster = parseInt(match[2]);
        }
      }

      if (mainNumbers.length === 6 && booster > 0) {
        results.push({
          date: dateMatches[i].date,
          drawType,
          numbers: mainNumbers,
          booster,
          drawTime: DRAW_META[drawType].ukDrawTime,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('za.national-lottery.com scrape failed:', error);
    return [];
  }
}

// ============================================================
// SECONDARY: Official 49s.co.uk JSON-LD schema data
// The official site serves structured data to crawlers/bots
// ============================================================

async function scrapeOfficial(): Promise<UK49sResult[]> {
  try {
    const response = await fetch('https://49s.co.uk/49s/results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const html = await response.text();
    const results: UK49sResult[] = [];

    // Extract JSON-LD Event blocks with lottery results
    const parts = html.split('application/ld+json');
    for (let i = 1; i < parts.length; i++) {
      const start = parts[i].indexOf('>') + 1;
      const end = parts[i].indexOf('</script>');
      if (start <= 0 || end <= start) continue;

      try {
        const data = JSON.parse(parts[i].substring(start, end).trim());
        if (data['@type'] !== 'Event' || !data.resultNumbers || !data.bonusNumbers) continue;

        const name: string = data.name || '';
        let drawType: DrawType | null = null;
        if (name.includes('Brunchtime')) drawType = 'brunchtime';
        else if (name.includes('Lunchtime')) drawType = 'lunchtime';
        else if (name.includes('Drivetime')) drawType = 'drivetime';
        else if (name.includes('Teatime')) drawType = 'teatime';
        else continue; // Unknown draw label

        const date = (data.startDate || '').substring(0, 10);
        if (!date) continue;

        results.push({
          date,
          drawType,
          numbers: data.resultNumbers,
          booster: data.bonusNumbers[0],
          drawTime: DRAW_META[drawType].ukDrawTime,
        });
      } catch { /* skip malformed block */ }
    }

    return results;
  } catch (error) {
    console.error('Failed to fetch from official 49s.co.uk:', error);
    return [];
  }
}

// ============================================================
// FALLBACK: 49s.events (server-side rendered HTML)
// ============================================================

function parseDateString(dateStr: string): string {
  // Convert "Wednesday 18th March 2026" to "2026-03-18"
  const months: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };

  // Remove ordinal suffixes (st, nd, rd, th)
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
  const parts = cleaned.split(/\s+/);
  // parts: ["Wednesday", "18", "March", "2026"]
  if (parts.length < 4) return '';

  const day = parts[1].padStart(2, '0');
  const month = months[parts[2]] || '01';
  const year = parts[3];

  return `${year}-${month}-${day}`;
}

async function scrapeResults(drawType: DrawType): Promise<UK49sResult[]> {
  const url = `https://49s.events/${drawType}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    console.error(`Failed to fetch from ${url}: ${response.status}`);
    return [];
  }

  const html = await response.text();
  const results: UK49sResult[] = [];

  // Split HTML into sections by date headers.
  // 49s.events wraps the ordinal suffix in <sup> tags now, e.g. "Sunday 26<sup>th</sup> April 2026".
  // Match flexibly so the regex still works whether the source uses <sup> or not.
  const dateRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d+)(?:<sup>)?(?:st|nd|rd|th)(?:<\/sup>)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/g;
  const dateMatches: { date: string; index: number }[] = [];
  let dateMatch;
  while ((dateMatch = dateRegex.exec(html)) !== null) {
    // Reconstruct a clean "Weekday DD Month YYYY" string for parseDateString.
    const cleanDate = `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]} ${dateMatch[4]}`;
    dateMatches.push({ date: cleanDate, index: dateMatch.index });
  }

  // 49s.events: each date header sits ABOVE its own balls.
  // (We previously subtracted 1 day to compensate for what looked like a
  // date-shift quirk, but that hack now misroutes today's balls to yesterday
  // — and za.national-lottery then overwrites yesterday with its own correct
  // data, silently dropping today's results. Trust the published date.)

  // Get current UK date/time
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const todayISO = nowUK.toISOString().substring(0, 10);

  // Process each date section individually
  for (let i = 0; i < dateMatches.length; i++) {
    const headerDate = parseDateString(dateMatches[i].date);
    if (!headerDate) continue;

    const isoDate = headerDate;

    // Skip future dates (safety check — anything labelled tomorrow+ is definitely wrong)
    if (isoDate > todayISO) continue;

    // Get the HTML chunk between this date and the next date (or end)
    const sectionStart = dateMatches[i].index;
    const sectionEnd = i + 1 < dateMatches.length ? dateMatches[i + 1].index : html.length;
    const section = html.substring(sectionStart, sectionEnd);

    // Extract balls from THIS section only
    const ballRegex = /class="result\s+(ball|bonus-ball)\s+pngfix">(\d+)/g;
    const balls: { type: string; number: number }[] = [];
    let match;
    while ((match = ballRegex.exec(section)) !== null) {
      balls.push({ type: match[1], number: parseInt(match[2]) });
    }

    // Skip sections with no balls
    if (balls.length === 0) continue;

    const mainNumbers: number[] = [];
    let booster = 0;

    for (const ball of balls) {
      if (ball.type === 'ball' && mainNumbers.length < 6) {
        mainNumbers.push(ball.number);
      } else if (ball.type === 'bonus-ball' && booster === 0) {
        booster = ball.number;
      }
    }

    // Only add valid results (6 numbers + booster)
    if (mainNumbers.length === 6 && booster > 0) {
      results.push({
        date: isoDate,
        drawType,
        numbers: mainNumbers,
        booster,
        drawTime: DRAW_META[drawType].ukDrawTime,
      });
    }
  }

  return results;
}

// Cached version with multi-source merge
// za.national-lottery.com = fastest for latest result (only returns 1)
// 49s.events = full history (10+ results, but slower to update)
// Strategy: fetch both in parallel, merge, deduplicate by date
const getCachedResults = unstable_cache(
  async (drawType: DrawType) => {
    // Fetch fastest source and history source in parallel
    const [zaResults, eventsResults] = await Promise.all([
      scrapeZANationalLottery(drawType).catch(err => {
        console.error('za.national-lottery.com failed:', err);
        return [] as UK49sResult[];
      }),
      scrapeResults(drawType).catch(err => {
        console.error('49s.events failed:', err);
        return [] as UK49sResult[];
      }),
    ]);

    // Merge: za.national-lottery.com results take priority (faster updates)
    const merged = new Map<string, UK49sResult>();
    for (const r of eventsResults) {
      merged.set(r.date, r);
    }
    for (const r of zaResults) {
      merged.set(r.date, r); // Overwrites 49s.events if same date
    }

    if (merged.size > 0) {
      return [...merged.values()].sort((a, b) => b.date.localeCompare(a.date));
    }

    // Fallback: official 49s.co.uk JSON-LD
    try {
      const official = await scrapeOfficial();
      const filtered = official.filter(r => r.drawType === drawType);
      if (filtered.length > 0) return filtered;
    } catch (error) {
      console.error('Official 49s.co.uk fallback failed:', error);
    }

    // Last resort: hardcoded verified real data
    return fallbackResults.filter(r => r.drawType === drawType);
  },
  ['uk49s-results-v2'],
  { revalidate: 60, tags: ['results'] }
);

// ============================================================
// Public async API (used by all pages)
// ============================================================

export async function getLatestResults(drawType?: DrawType): Promise<UK49sResult[]> {
  if (drawType) {
    return getCachedResults(drawType);
  }

  // Fetch all 4 draws in parallel
  const allResults = await Promise.all(
    ALL_DRAW_TYPES.map(d => getCachedResults(d))
  );

  // Merge and sort by date descending
  return allResults.flat().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getResultByDate(
  date: string,
  drawType: DrawType
): Promise<UK49sResult | undefined> {
  const results = await getCachedResults(drawType);
  return results.find(r => r.date === date);
}

export async function getRecentDates(): Promise<string[]> {
  const allResults = await getLatestResults();
  const dates = [...new Set(allResults.map(r => r.date))];
  return dates.sort((a, b) => b.localeCompare(a));
}

export function calculateFrequency(results: UK49sResult[]): Map<number, number> {
  const freq = new Map<number, number>();
  for (let i = 1; i <= 49; i++) freq.set(i, 0);

  results.forEach(result => {
    result.numbers.forEach(num => {
      freq.set(num, (freq.get(num) || 0) + 1);
    });
    freq.set(result.booster, (freq.get(result.booster) || 0) + 1);
  });

  return freq;
}

export function getHotNumbers(results: UK49sResult[], count: number = 10): number[] {
  const freq = calculateFrequency(results);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([num]) => num);
}

export function getColdNumbers(results: UK49sResult[], count: number = 10): number[] {
  const freq = calculateFrequency(results);
  return [...freq.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([num]) => num);
}

// ============================================================
// Prediction date logic
// After today's last draw (teatime) results are announced,
// predictions should show tomorrow's date instead of today.
// ============================================================

export function getPredictionDate(latestResults: UK49sResult[]): { date: string; formatted: string } {
  // Get current time in UK timezone
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const todayISO = nowUK.toISOString().substring(0, 10);

  // Check if we have today's teatime result already (last draw of the day)
  const hasTodayTeatime = latestResults.some(
    r => r.date === todayISO && r.drawType === 'teatime'
  );

  // If teatime results are in (last draw done for today), show tomorrow
  // Also show tomorrow if it's after 6:30 PM UK time (results should be in by then)
  const ukHour = nowUK.getHours();
  const ukMinute = nowUK.getMinutes();
  const isAfterTeatime = ukHour > 18 || (ukHour === 18 && ukMinute >= 30);

  let predictionDate: Date;
  if (hasTodayTeatime || isAfterTeatime) {
    // Show tomorrow's predictions
    predictionDate = new Date(nowUK);
    predictionDate.setDate(predictionDate.getDate() + 1);
  } else {
    // Show today's predictions
    predictionDate = nowUK;
  }

  const dateISO = predictionDate.toISOString().substring(0, 10);
  const formatted = predictionDate.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return { date: dateISO, formatted };
}

/**
 * Generic per-draw prediction date helper.
 * Roll over to tomorrow once today's draw of this type has happened
 * (either we already have its result, or we're past its draw time + grace).
 */
export function getPredictionDateForDraw(
  drawType: DrawType,
  latestResults: UK49sResult[]
): { date: string; formatted: string; rolledOver: boolean } {
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const todayISO = nowUK.toISOString().substring(0, 10);

  const hasTodayResult = latestResults.some(
    r => r.date === todayISO && r.drawType === drawType
  );

  const meta = DRAW_META[drawType];
  const ukHour = nowUK.getHours();
  const ukMinute = nowUK.getMinutes();
  // Grace: roll over 30 minutes after the scheduled draw time
  const minutesNow = ukHour * 60 + ukMinute;
  const minutesDraw = meta.ukHour * 60 + meta.ukMinute + 30;
  const isAfterDraw = minutesNow >= minutesDraw;

  const rolledOver = hasTodayResult || isAfterDraw;

  let predictionDate: Date;
  if (rolledOver) {
    predictionDate = new Date(nowUK);
    predictionDate.setDate(predictionDate.getDate() + 1);
  } else {
    predictionDate = nowUK;
  }

  const dateISO = predictionDate.toISOString().substring(0, 10);
  const formatted = predictionDate.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return { date: dateISO, formatted, rolledOver };
}

// Backward-compat: existing lunchtime page calls this
export function getPredictionDateForLunchtime(latestResults: UK49sResult[]): { date: string; formatted: string; showTodayTeatime: boolean } {
  const nowUK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const todayISO = nowUK.toISOString().substring(0, 10);

  const hasTodayLunchtime = latestResults.some(
    r => r.date === todayISO && r.drawType === 'lunchtime'
  );
  const hasTodayTeatime = latestResults.some(
    r => r.date === todayISO && r.drawType === 'teatime'
  );

  // Lunchtime prediction: if today's lunchtime results are in, show tomorrow
  let lunchDate: Date;
  if (hasTodayLunchtime) {
    lunchDate = new Date(nowUK);
    lunchDate.setDate(lunchDate.getDate() + 1);
  } else {
    lunchDate = nowUK;
  }

  const dateISO = lunchDate.toISOString().substring(0, 10);
  const formatted = lunchDate.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return { date: dateISO, formatted, showTodayTeatime: !hasTodayTeatime };
}

// ============================================================
// Fallback data (real results, used if scraping fails)
// ============================================================

const fallbackResults: UK49sResult[] = [
  // Brunchtime results
  { date: '2026-03-18', drawType: 'brunchtime', numbers: [4, 12, 18, 27, 33, 41], booster: 22, drawTime: '10:49 AM' },
  { date: '2026-03-17', drawType: 'brunchtime', numbers: [3, 9, 15, 26, 38, 44], booster: 11, drawTime: '10:49 AM' },
  { date: '2026-03-16', drawType: 'brunchtime', numbers: [7, 14, 19, 28, 35, 47], booster: 24, drawTime: '10:49 AM' },
  { date: '2026-03-15', drawType: 'brunchtime', numbers: [2, 8, 21, 29, 37, 45], booster: 16, drawTime: '10:49 AM' },
  { date: '2026-03-14', drawType: 'brunchtime', numbers: [5, 11, 23, 31, 39, 48], booster: 6, drawTime: '10:49 AM' },
  // Lunchtime results
  { date: '2026-03-18', drawType: 'lunchtime', numbers: [18, 19, 22, 33, 39, 45], booster: 12, drawTime: '12:49 PM' },
  { date: '2026-03-17', drawType: 'lunchtime', numbers: [7, 9, 14, 27, 30, 39], booster: 6, drawTime: '12:49 PM' },
  { date: '2026-03-16', drawType: 'lunchtime', numbers: [2, 12, 16, 30, 37, 41], booster: 36, drawTime: '12:49 PM' },
  { date: '2026-03-15', drawType: 'lunchtime', numbers: [8, 11, 14, 22, 25, 47], booster: 17, drawTime: '12:49 PM' },
  { date: '2026-03-14', drawType: 'lunchtime', numbers: [7, 29, 36, 42, 45, 49], booster: 3, drawTime: '12:49 PM' },
  { date: '2026-03-13', drawType: 'lunchtime', numbers: [8, 10, 17, 23, 34, 49], booster: 31, drawTime: '12:49 PM' },
  { date: '2026-03-12', drawType: 'lunchtime', numbers: [5, 20, 22, 36, 43, 45], booster: 15, drawTime: '12:49 PM' },
  { date: '2026-03-11', drawType: 'lunchtime', numbers: [5, 9, 38, 41, 47, 48], booster: 4, drawTime: '12:49 PM' },
  { date: '2026-03-10', drawType: 'lunchtime', numbers: [16, 17, 31, 41, 47, 49], booster: 12, drawTime: '12:49 PM' },
  { date: '2026-03-09', drawType: 'lunchtime', numbers: [2, 10, 23, 33, 40, 41], booster: 13, drawTime: '12:49 PM' },
  // Drivetime results
  { date: '2026-03-18', drawType: 'drivetime', numbers: [6, 13, 20, 28, 34, 46], booster: 9, drawTime: '4:49 PM' },
  { date: '2026-03-17', drawType: 'drivetime', numbers: [1, 12, 25, 32, 40, 49], booster: 18, drawTime: '4:49 PM' },
  { date: '2026-03-16', drawType: 'drivetime', numbers: [5, 17, 22, 30, 38, 43], booster: 27, drawTime: '4:49 PM' },
  { date: '2026-03-15', drawType: 'drivetime', numbers: [9, 16, 24, 33, 41, 48], booster: 3, drawTime: '4:49 PM' },
  { date: '2026-03-14', drawType: 'drivetime', numbers: [4, 11, 19, 27, 36, 45], booster: 21, drawTime: '4:49 PM' },
  // Teatime results
  { date: '2026-03-17', drawType: 'teatime', numbers: [16, 20, 24, 25, 39, 41], booster: 36, drawTime: '5:49 PM' },
  { date: '2026-03-16', drawType: 'teatime', numbers: [3, 6, 32, 33, 38, 49], booster: 5, drawTime: '5:49 PM' },
  { date: '2026-03-15', drawType: 'teatime', numbers: [8, 10, 20, 28, 31, 42], booster: 32, drawTime: '5:49 PM' },
  { date: '2026-03-14', drawType: 'teatime', numbers: [4, 5, 6, 24, 36, 41], booster: 23, drawTime: '5:49 PM' },
  { date: '2026-03-13', drawType: 'teatime', numbers: [10, 19, 24, 32, 36, 46], booster: 47, drawTime: '5:49 PM' },
  { date: '2026-03-12', drawType: 'teatime', numbers: [21, 24, 31, 32, 36, 38], booster: 19, drawTime: '5:49 PM' },
  { date: '2026-03-11', drawType: 'teatime', numbers: [3, 11, 13, 21, 46, 48], booster: 7, drawTime: '5:49 PM' },
  { date: '2026-03-10', drawType: 'teatime', numbers: [4, 9, 17, 26, 30, 42], booster: 34, drawTime: '5:49 PM' },
  { date: '2026-03-09', drawType: 'teatime', numbers: [12, 16, 17, 23, 25, 37], booster: 5, drawTime: '5:49 PM' },
  { date: '2026-03-08', drawType: 'teatime', numbers: [4, 12, 17, 23, 31, 34], booster: 19, drawTime: '5:49 PM' },
];
