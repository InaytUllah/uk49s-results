import { NextResponse } from 'next/server';
import { notifyGoogleIndexing, buildNotificationUrls } from '@/lib/api/google-indexing';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Verify the request has valid secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const additionalUrls: string[] = body.urls || [];

    const urls = buildNotificationUrls(additionalUrls);
    const result = await notifyGoogleIndexing(urls);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Google Indexing notification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to notify Google Indexing API',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
