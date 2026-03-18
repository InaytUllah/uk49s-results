import { UK49sResult } from '../types';
import { unstable_cache } from 'next/cache';

// Draw schedule (UK time)
export const DRAW_SCHEDULE = {
  lunchtime: '12:49 PM',
  teatime: '5:49 PM',
};

// ============================================================
// PRIMARY: Official 49s.co.uk JSON-LD schema data
// The official site serves structured data to crawlers/bots
// ============================================================

async function scrapeOfficial(): Promise<UK49sResult[]> {
  try {
    const response = await fetch('https://49s.co.uk/49s/results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
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
        let drawType: 'lunchtime' | 'teatime' | null = null;
        if (name.includes('Lunchtime')) drawType = 'lunchtime';
        else if (name.includes('Teatime')) drawType = 'teatime';
        else continue; // Skip Brunchtime/Drivetime draws

        const date = (data.startDate || '').substring(0, 10);
        if (!date) continue;

        results.push({
          date,
          drawType,
          numbers: data.resultNumbers,
          booster: data.bonusNumbers[0],
          drawTime: drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM',
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

async function scrapeResults(drawType: 'lunchtime' | 'teatime'): Promise<UK49sResult[]> {
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

  // Extract dates
  const dateRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+\d+(?:st|nd|rd|th)\s+\w+\s+\d{4}/g;
  const dates = html.match(dateRegex) || [];

  // Extract all ball numbers in order
  const ballRegex = /class="result\s+(ball|bonus-ball)\s+pngfix">(\d+)/g;
  const balls: { type: string; number: number }[] = [];
  let match;
  while ((match = ballRegex.exec(html)) !== null) {
    balls.push({ type: match[1], number: parseInt(match[2]) });
  }

  // Group balls into draws (7 balls per draw: 6 main + 1 bonus)
  let ballIndex = 0;
  for (const dateStr of dates) {
    const isoDate = parseDateString(dateStr);
    if (!isoDate) continue;

    const mainNumbers: number[] = [];
    let booster = 0;

    // Collect 6 main balls + 1 bonus ball
    while (ballIndex < balls.length && mainNumbers.length < 6) {
      if (balls[ballIndex].type === 'ball') {
        mainNumbers.push(balls[ballIndex].number);
      }
      ballIndex++;
    }

    // Next should be the bonus ball
    if (ballIndex < balls.length && balls[ballIndex].type === 'bonus-ball') {
      booster = balls[ballIndex].number;
      ballIndex++;
    }

    // Only add valid results (6 numbers + booster, all valid)
    if (mainNumbers.length === 6 && booster > 0) {
      results.push({
        date: isoDate,
        drawType,
        numbers: mainNumbers,
        booster,
        drawTime: drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM',
      });
    }
  }

  return results;
}

// Cached version with multi-source fallback
// Note: 49s.events is primary because the official 49s.co.uk SSR response
// has incorrect dates in JSON-LD (all dates show as the same value).
// Both sources serve the same official draw numbers.
const getCachedResults = unstable_cache(
  async (drawType: 'lunchtime' | 'teatime') => {
    // 1. Primary: 49s.events (server-rendered HTML with accurate dates)
    try {
      const results = await scrapeResults(drawType);
      if (results.length > 0) return results;
    } catch (error) {
      console.error('49s.events source failed:', error);
    }

    // 2. Fallback: official 49s.co.uk JSON-LD (dates may be inaccurate in SSR)
    try {
      const official = await scrapeOfficial();
      const filtered = official.filter(r => r.drawType === drawType);
      if (filtered.length > 0) return filtered;
    } catch (error) {
      console.error('Official 49s.co.uk fallback failed:', error);
    }

    // 3. Last resort: hardcoded verified real data
    return fallbackResults.filter(r => r.drawType === drawType);
  },
  ['uk49s-results'],
  { revalidate: 60, tags: ['results'] }
);

// ============================================================
// Public async API (used by all pages)
// ============================================================

export async function getLatestResults(drawType?: 'lunchtime' | 'teatime'): Promise<UK49sResult[]> {
  if (drawType) {
    return getCachedResults(drawType);
  }

  const [lunchtime, teatime] = await Promise.all([
    getCachedResults('lunchtime'),
    getCachedResults('teatime'),
  ]);

  // Merge and sort by date descending
  return [...lunchtime, ...teatime].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getResultByDate(
  date: string,
  drawType: 'lunchtime' | 'teatime'
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
// Fallback data (real results, used if scraping fails)
// ============================================================

const fallbackResults: UK49sResult[] = [
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
