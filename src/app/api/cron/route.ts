import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

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
    // Revalidate the cached results so pages fetch fresh data from 49s.events
    revalidateTag('results', 'default');

    return NextResponse.json({
      success: true,
      message: 'UK 49s results cache revalidated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to revalidate results',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
