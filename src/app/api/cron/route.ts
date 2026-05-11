import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ALL_DRAW_TYPES } from '@/lib/types';
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
    // Only revalidate the pages most likely to change after a draw.
    // The old code called revalidatePath('/', 'layout') which rebuilt all 167 pages
    // every cron run (35k ISR writes/day). This targets just the ~14 pages that need it.
    revalidatePath('/');
    for (const d of ALL_DRAW_TYPES) {
      revalidatePath(`/${d}`);
      revalidatePath(`/${d}-predictions`);
    }
    revalidatePath('/predictions');
    revalidatePath('/hot-cold-numbers');

    // Draw-time crons: ~9 URLs (today's results across 4 draws + prediction hubs)
    // Daily full run: core pages + recent results
    const urls = isFullSubmission
      ? await buildDailyNotificationUrls()
      : await buildNotificationUrls();

    const indexingResult = await notifyGoogleIndexing(urls);

    return NextResponse.json({
      success: true,
      message: 'UK 49s scraper cache invalidated',
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
