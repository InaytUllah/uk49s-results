import { MetadataRoute } from 'next';
import { getRecentDates, getLatestResults, getPredictionDateForDraw } from '@/lib/data/draws';
import { SITE_URL } from '@/lib/data/seo';
import { articles } from '@/lib/articles/data';
import { ALL_DRAW_TYPES } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dates, allResults] = await Promise.all([
    getRecentDates(),
    getLatestResults(),
  ]);

  const uniqueDates = [...new Set(allResults.map(r => r.date))].sort((a, b) => b.localeCompare(a));

  const now = new Date();

  // Per-draw hub URLs (results + predictions)
  const drawHubPages = ALL_DRAW_TYPES.flatMap(d => [
    { url: `${SITE_URL}/${d}`, lastModified: now, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${SITE_URL}/${d}-predictions`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
  ]);

  // Main pages — lastModified tells Google when to recrawl
  const staticPages = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly' as const, priority: 1.0 },
    ...drawHubPages,
    { url: `${SITE_URL}/hot-cold-numbers`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/predictions`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/number-generator`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/check`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${SITE_URL}/history`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/how-to-play`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
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

  // Per-draw result pages by date (canonical source)
  const drawResultPages = ALL_DRAW_TYPES.flatMap(drawType =>
    dates.map(date => ({
      url: `${SITE_URL}/${drawType}/results/${date}`,
      lastModified: new Date(date),
      changeFrequency: 'never' as const,
      priority: 0.6,
    }))
  );

  // Prediction blog posts — dated, self-canonical, indexable. Each post has
  // unique numbers/analysis for that specific date and targets long-tail
  // queries like "uk 49s drivetime predictions 30 april 2026". The hub
  // pages target the "today" cluster; dated posts target the date-specific
  // long-tail. Different intents, both should rank.
  const predictionBlogPages = ALL_DRAW_TYPES.flatMap(drawType => {
    const info = getPredictionDateForDraw(drawType, allResults);
    const drawDates = [...new Set([info.date, ...uniqueDates.slice(0, 5)])];
    return drawDates.map(date => ({
      url: `${SITE_URL}/blog/uk-49s-${drawType}-predictions-${date}`,
      lastModified: now,
      changeFrequency: 'never' as const,
      priority: 0.6,
    }));
  });

  // Evergreen articles — high SEO value, target long-tail queries
  const articlePages = articles.map(a => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.updatedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...numberPages,
    ...drawResultPages,
    ...predictionBlogPages,
    ...articlePages,
  ];
}
