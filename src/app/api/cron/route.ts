import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { notifyGoogleIndexing, buildNotificationUrls } from '@/lib/api/google-indexing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron or has valid secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Revalidate all pages so they fetch fresh data
    revalidatePath('/', 'layout');

    // Notify Google Indexing API about updated pages
    const urls = buildNotificationUrls();
    const indexingResult = await notifyGoogleIndexing(urls);

    return NextResponse.json({
      success: true,
      message: 'UK 49s results cache revalidated',
      googleIndexing: {
        notified: indexingResult.total,
        succeeded: indexingResult.succeeded,
        failed: indexingResult.failed,
      },
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
