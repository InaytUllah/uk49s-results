import { MetadataRoute } from 'next';
import { getRecentDates, getLatestResults, getPredictionDate } from '@/lib/data/draws';
import { SITE_URL } from '@/lib/data/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dates, allResults] = await Promise.all([
    getRecentDates(),
    getLatestResults(),
  ]);

  const predInfo = getPredictionDate(allResults);

  // Main pages
  const staticPages = [
    { url: SITE_URL, changeFrequency: 'hourly' as const, priority: 1.0 },
    { url: `${SITE_URL}/lunchtime`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/teatime`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/hot-cold-numbers`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/predictions`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/lunchtime-predictions`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/teatime-predictions`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/number-generator`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/history`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/how-to-play`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/faq`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/odds`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/lunchtime-vs-teatime`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/numbers`, changeFrequency: 'daily' as const, priority: 0.7 },
    // Legal & trust pages
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/responsible-gaming`, changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  // NOTE: Individual number pages (/numbers/1-49) removed from sitemap.
  // They have noindex and are accessible via internal links from /numbers hub.

  // Result pages by date (canonical source — no more blog duplicates)
  const lunchtimeResultPages = dates.map(date => ({
    url: `${SITE_URL}/lunchtime/results/${date}`,
    lastModified: new Date(date),
    changeFrequency: 'never' as const,
    priority: 0.6,
  }));

  const teatimeResultPages = dates.map(date => ({
    url: `${SITE_URL}/teatime/results/${date}`,
    lastModified: new Date(date),
    changeFrequency: 'never' as const,
    priority: 0.6,
  }));

  // NOTE: Blog result posts removed from sitemap.
  // Result blog URLs now redirect to canonical /lunchtime/results/{date} pages.

  // Prediction blog posts — separate for lunchtime and teatime
  const uniqueDates = [...new Set(allResults.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const predDates = [predInfo.date, ...uniqueDates.slice(0, 5)];
  const predictionPages = [...new Set(predDates)].flatMap(date => [
    {
      url: `${SITE_URL}/blog/uk-49s-lunchtime-predictions-${date}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog/uk-49s-teatime-predictions-${date}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ]);

  return [
    ...staticPages,
    ...lunchtimeResultPages,
    ...teatimeResultPages,
    ...predictionPages,
  ];
}
