import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { notifyGoogleIndexing, buildNotificationUrls, fetchAllSitemapUrls } from '@/lib/api/google-indexing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron or has valid secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if this is the daily full-sitemap run via ?full=true
  const url = new URL(request.url);
  const isFullSubmission = url.searchParams.get('full') === 'true';

  try {
    // Revalidate all pages so they fetch fresh data
    revalidatePath('/', 'layout');

    // Build URL list: full sitemap for daily run, quick set for draw-time runs
    let urls: string[];
    if (isFullSubmission) {
      urls = await fetchAllSitemapUrls();
      if (urls.length === 0) {
        // Fallback to standard set if sitemap fetch fails
        urls = buildNotificationUrls();
      }
    } else {
      urls = buildNotificationUrls();
    }

    const indexingResult = await notifyGoogleIndexing(urls);

    return NextResponse.json({
      success: true,
      message: 'UK 49s results cache revalidated',
      mode: isFullSubmission ? 'full-sitemap' : 'draw-update',
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
