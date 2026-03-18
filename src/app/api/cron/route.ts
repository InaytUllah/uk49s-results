import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // Attempt to fetch latest UK 49s results
    const results = await fetchLatestResults();

    return NextResponse.json({
      success: true,
      message: 'UK 49s results checked',
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch results',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

async function fetchLatestResults() {
  const sources = [
    fetchFrom49sAPI,
    fetchFromBackupSource,
  ];

  for (const source of sources) {
    try {
      const result = await source();
      if (result) return result;
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchFrom49sAPI() {
  try {
    const response = await fetch('https://www.49s.co.uk/lunchtime/results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract numbers using regex patterns
    const numberPattern = /class="[^"]*ball[^"]*"[^>]*>(\d{1,2})</g;
    const numbers: number[] = [];
    let match;

    while ((match = numberPattern.exec(html)) !== null) {
      numbers.push(parseInt(match[1]));
    }

    if (numbers.length >= 7) {
      return {
        lunchtime: {
          numbers: numbers.slice(0, 6),
          booster: numbers[6],
          date: new Date().toISOString().split('T')[0],
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchFromBackupSource() {
  // Backup scraping source
  try {
    const response = await fetch('https://api.collectapi.com/chancegame/uk49s', {
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}
