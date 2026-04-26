import { MetadataRoute } from 'next';
import { getRecentDates } from '@/lib/data/draws';
import { SITE_URL } from '@/lib/data/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dates = await getRecentDates();

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

  // NOTE: Daily prediction blog posts (/blog/uk-49s-{draw}-predictions-{date})
  // are intentionally NOT in the sitemap and are noindexed. They are near-duplicates
  // of each other (same template, only date+numbers differ) and Google's spam update
  // classifies this as scaled content abuse. The rolling /lunchtime-predictions and
  // /teatime-predictions hub pages serve as the canonical daily prediction URLs.

  return [
    ...staticPages,
    ...numberPages,
    ...lunchtimeResultPages,
    ...teatimeResultPages,
  ];
}
