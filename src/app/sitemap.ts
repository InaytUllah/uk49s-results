import { MetadataRoute } from 'next';
import { getRecentDates, getLatestResults, getPredictionDate, getPredictionDateForLunchtime } from '@/lib/data/draws';
import { SITE_URL } from '@/lib/data/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dates, allResults] = await Promise.all([
    getRecentDates(),
    getLatestResults(),
  ]);

  const teaInfo = getPredictionDate(allResults);
  const lunchInfo = getPredictionDateForLunchtime(allResults);
  const uniqueDates = [...new Set(allResults.map(r => r.date))].sort((a, b) => b.localeCompare(a));

  const now = new Date();

  // Main pages — lastModified tells Google when to recrawl
  const staticPages = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly' as const, priority: 1.0 },
    { url: `${SITE_URL}/lunchtime`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/teatime`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/hot-cold-numbers`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/predictions`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/lunchtime-predictions`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/teatime-predictions`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/number-generator`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/check`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/history`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/how-to-play`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/faq`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/odds`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/lunchtime-vs-teatime`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/numbers`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    // Legal & trust pages
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/responsible-gaming`, changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  // Individual number pages — unique long-tail content for each number
  const numberPages = Array.from({ length: 49 }, (_, i) => ({
    url: `${SITE_URL}/numbers/${i + 1}`,
    changeFrequency: 'daily' as const,
    priority: 0.5,
  }));

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

  // Prediction blog posts — dated, self-canonical, indexable. Each post has
  // unique numbers/analysis for that specific date and targets long-tail
  // queries like "uk 49s lunchtime predictions 30 april 2026". The hub
  // pages target the "today" cluster ("uk 49s lunchtime predictions today");
  // dated posts target the date-specific long-tail. Different intents,
  // both should rank.
  const lunchPredDates = [...new Set([lunchInfo.date, ...uniqueDates.slice(0, 5)])];
  const teaPredDates = [...new Set([teaInfo.date, ...uniqueDates.slice(0, 5)])];
  const predictionBlogPages = [
    ...lunchPredDates.map(date => ({
      url: `${SITE_URL}/blog/uk-49s-lunchtime-predictions-${date}`,
      lastModified: now,
      changeFrequency: 'never' as const,
      priority: 0.6,
    })),
    ...teaPredDates.map(date => ({
      url: `${SITE_URL}/blog/uk-49s-teatime-predictions-${date}`,
      lastModified: now,
      changeFrequency: 'never' as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticPages,
    ...numberPages,
    ...lunchtimeResultPages,
    ...teatimeResultPages,
    ...predictionBlogPages,
  ];
}
