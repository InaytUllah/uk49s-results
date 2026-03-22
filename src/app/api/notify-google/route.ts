import { NextResponse } from 'next/server';
import { notifyGoogleIndexing, buildNotificationUrls, fetchAllSitemapUrls } from '@/lib/api/google-indexing';

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
    const fullSitemap: boolean = body.full === true;

    let urls: string[];
    if (fullSitemap) {
      // Fetch all URLs from the live sitemap
      urls = await fetchAllSitemapUrls();
      // Merge any additional URLs
      if (additionalUrls.length > 0) {
        const urlSet = new Set(urls);
        for (const u of additionalUrls) {
          urlSet.add(u);
        }
        urls = [...urlSet];
      }
    } else {
      urls = buildNotificationUrls(additionalUrls);
    }

    const result = await notifyGoogleIndexing(urls);

    return NextResponse.json({
      success: true,
      mode: fullSitemap ? 'full-sitemap' : 'standard',
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
