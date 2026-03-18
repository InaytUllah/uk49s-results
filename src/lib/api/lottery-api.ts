import { UK49sResult } from '../types';

const RESULTS_DIR = process.cwd() + '/data/results';

// Fetch UK 49s results from free API
export async function fetchUK49sResults(): Promise<{ lunchtime: UK49sResult | null; teatime: UK49sResult | null }> {
  try {
    // Try multiple free API sources
    const result = await fetchFromPrimaryAPI();
    if (result) return result;

    // Fallback to scraping
    return await scrapeUK49sResults();
  } catch (error) {
    console.error('Failed to fetch UK49s results:', error);
    return { lunchtime: null, teatime: null };
  }
}

// Primary: Free lottery API (49s specific endpoints)
async function fetchFromPrimaryAPI(): Promise<{ lunchtime: UK49sResult | null; teatime: UK49sResult | null } | null> {
  try {
    // Using a free lottery results API
    const response = await fetch('https://api.49s.co.uk/latest', {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'UK49sResults/1.0' },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      lunchtime: data.lunchtime ? parseAPIResult(data.lunchtime, 'lunchtime') : null,
      teatime: data.teatime ? parseAPIResult(data.teatime, 'teatime') : null,
    };
  } catch {
    return null;
  }
}

// Fallback: Scrape results from public sources
async function scrapeUK49sResults(): Promise<{ lunchtime: UK49sResult | null; teatime: UK49sResult | null }> {
  try {
    const response = await fetch('https://www.49s.co.uk/lunchtime/results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return { lunchtime: null, teatime: null };

    const html = await response.text();
    const lunchtime = parseScrapedResult(html, 'lunchtime');
    const teatime = parseScrapedResult(html, 'teatime');

    return { lunchtime, teatime };
  } catch {
    return { lunchtime: null, teatime: null };
  }
}

function parseAPIResult(data: Record<string, unknown>, drawType: 'lunchtime' | 'teatime'): UK49sResult {
  return {
    date: data.date as string || new Date().toISOString().split('T')[0],
    drawType,
    numbers: (data.numbers as number[]) || [],
    booster: (data.booster as number) || 0,
    drawTime: drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM',
  };
}

function parseScrapedResult(html: string, drawType: 'lunchtime' | 'teatime'): UK49sResult | null {
  try {
    // Parse numbers from HTML using regex patterns
    const section = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
    const regex = new RegExp(`${section}[\\s\\S]*?(\\d{1,2})[\\s,]+(\\d{1,2})[\\s,]+(\\d{1,2})[\\s,]+(\\d{1,2})[\\s,]+(\\d{1,2})[\\s,]+(\\d{1,2})[\\s\\S]*?Booster[:\\s]*(\\d{1,2})`);
    const match = html.match(regex);

    if (!match) return null;

    return {
      date: new Date().toISOString().split('T')[0],
      drawType,
      numbers: [
        parseInt(match[1]),
        parseInt(match[2]),
        parseInt(match[3]),
        parseInt(match[4]),
        parseInt(match[5]),
        parseInt(match[6]),
      ],
      booster: parseInt(match[7]),
      drawTime: drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM',
    };
  } catch {
    return null;
  }
}

// Save results to JSON file
export async function saveResult(result: UK49sResult): Promise<void> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const dir = path.join(RESULTS_DIR, result.drawType);
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, `${result.date}.json`);

  // Read existing file or create new
  let dayResults: UK49sResult[] = [];
  try {
    const existing = await fs.readFile(filePath, 'utf-8');
    dayResults = JSON.parse(existing);
  } catch {
    // File doesn't exist yet
  }

  // Avoid duplicates
  const exists = dayResults.some(r => r.drawType === result.drawType && r.date === result.date);
  if (!exists) {
    dayResults.push(result);
    await fs.writeFile(filePath, JSON.stringify(dayResults, null, 2));
  }
}

// Load results from JSON files
export async function loadResults(drawType?: 'lunchtime' | 'teatime', limit: number = 30): Promise<UK49sResult[]> {
  const fs = await import('fs/promises');
  const path = await import('path');

  const results: UK49sResult[] = [];
  const types = drawType ? [drawType] : ['lunchtime', 'teatime'] as const;

  for (const type of types) {
    const dir = path.join(RESULTS_DIR, type);
    try {
      const files = await fs.readdir(dir);
      const sortedFiles = files.sort().reverse().slice(0, limit);

      for (const file of sortedFiles) {
        const content = await fs.readFile(path.join(dir, file), 'utf-8');
        const dayResults: UK49sResult[] = JSON.parse(content);
        results.push(...dayResults);
      }
    } catch {
      // Directory doesn't exist yet
    }
  }

  return results.sort((a, b) => b.date.localeCompare(a.date));
}
