import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { notifyGoogleIndexing, buildNotificationUrls, buildDailyNotificationUrls } from '@/lib/api/google-indexing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const isFullSubmission = url.searchParams.get('full') === 'true';

  try {
    revalidatePath('/', 'layout');

    // Draw-time crons: only 4 URLs (today's results + predictions)
    // Daily full run: core pages + recent results (~13 URLs)
    const urls = isFullSubmission
      ? buildDailyNotificationUrls()
      : buildNotificationUrls();

    const indexingResult = await notifyGoogleIndexing(urls);

    return NextResponse.json({
      success: true,
      message: 'UK 49s results cache revalidated',
      mode: isFullSubmission ? 'daily-core-pages' : 'draw-update',
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
