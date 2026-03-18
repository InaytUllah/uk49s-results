import { MetadataRoute } from 'next';
import { getRecentDates, getLatestResults } from '@/lib/data/draws';
import { SITE_URL } from '@/lib/data/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dates, allResults] = await Promise.all([
    getRecentDates(),
    getLatestResults(),
  ]);

  const staticPages = [
    { url: SITE_URL, changeFrequency: 'hourly' as const, priority: 1.0 },
    { url: `${SITE_URL}/lunchtime`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/teatime`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/hot-cold-numbers`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/predictions`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/number-generator`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/history`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/how-to-play`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily' as const, priority: 0.7 },
  ];

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

  // Blog post pages (one per draw result)
  const blogPostPages = allResults.map(result => ({
    url: `${SITE_URL}/blog/uk-49s-${result.drawType}-results-${result.date}`,
    lastModified: new Date(result.date),
    changeFrequency: 'never' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...lunchtimeResultPages, ...teatimeResultPages, ...blogPostPages];
}
