import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults, getPredictionDateForDraw } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { articles } from '@/lib/articles/data';
import { ALL_DRAW_TYPES, DRAW_META, DrawType } from '@/lib/types';

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  alternates: { canonical: '/blog' },
  ...ogMeta(PAGE_SEO.blog.title, PAGE_SEO.blog.description, '/blog'),
};

export const revalidate = 3600; // 1h — cron triggers revalidation on new draws

interface PredictionPost {
  date: string;
  drawType: DrawType;
  formatted: string;
  isToday: boolean;
}

// Tailwind requires literal class names — keep these inline rather than building dynamically
const COLUMN_THEME: Record<DrawType, {
  heading: string;
  hoverBorder: string;
  badge: string;
  arrow: string;
  hubBorder: string;
  hubBg: string;
  hubAccent: string;
  rowHover: string;
}> = {
  brunchtime: {
    heading: 'text-orange-700 dark:text-orange-400',
    hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-700',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    arrow: 'text-orange-600',
    hubBorder: 'border-orange-200 dark:border-orange-800',
    hubBg: 'bg-orange-50 dark:bg-orange-950/20',
    hubAccent: 'text-orange-600 dark:text-orange-400',
    rowHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
  },
  lunchtime: {
    heading: 'text-amber-700 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    arrow: 'text-amber-600',
    hubBorder: 'border-amber-200 dark:border-amber-800',
    hubBg: 'bg-amber-50 dark:bg-amber-950/20',
    hubAccent: 'text-amber-600 dark:text-amber-400',
    rowHover: 'hover:bg-amber-50 dark:hover:bg-amber-950/20',
  },
  drivetime: {
    heading: 'text-rose-700 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    arrow: 'text-rose-600',
    hubBorder: 'border-rose-200 dark:border-rose-800',
    hubBg: 'bg-rose-50 dark:bg-rose-950/20',
    hubAccent: 'text-rose-600 dark:text-rose-400',
    rowHover: 'hover:bg-rose-50 dark:hover:bg-rose-950/20',
  },
  teatime: {
    heading: 'text-indigo-700 dark:text-indigo-400',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    arrow: 'text-indigo-600',
    hubBorder: 'border-indigo-200 dark:border-indigo-800',
    hubBg: 'bg-indigo-50 dark:bg-indigo-950/20',
    hubAccent: 'text-indigo-600 dark:text-indigo-400',
    rowHover: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/20',
  },
};

export default async function BlogPage() {
  const results = await getLatestResults();
  const uniqueDates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const latestDates = uniqueDates.slice(0, 5);

  const fmtDay = (date: string) =>
    new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Build per-draw post lists
  const postsByDraw = ALL_DRAW_TYPES.map(drawType => {
    const info = getPredictionDateForDraw(drawType, results);
    const dates = [...new Set([info.date, ...uniqueDates.slice(0, 6)])].slice(0, 7);
    const posts: PredictionPost[] = dates.map(date => ({
      date,
      drawType,
      formatted: fmtDay(date),
      isToday: date === info.date,
    }));
    return { drawType, posts };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Blog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Daily predictions, in-depth guides, and number analysis for all four UK 49s draws — Brunchtime, Lunchtime, Drivetime and Teatime.
      </p>

      {/* Today's Predictions — hub pages */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Today&apos;s Predictions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_DRAW_TYPES.map(drawType => {
            const meta = DRAW_META[drawType];
            const theme = COLUMN_THEME[drawType];
            return (
              <Link
                key={drawType}
                href={`/${drawType}-predictions`}
                className={`block ${theme.hubBg} border-2 ${theme.hubBorder} rounded-xl p-5 hover:shadow-lg transition-shadow`}
              >
                <p className={`text-sm font-semibold ${theme.hubAccent} mb-1`}>{meta.ukDrawTime} Draw</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{meta.label} Predictions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fresh prediction sets for today&apos;s {meta.label} draw, refreshed after each result.
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Prediction Posts — dated, indexable */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Prediction Posts</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Daily prediction analysis for past UK 49s draws. Each post shows the prediction sets used for that day plus how they compared to the actual result.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {postsByDraw.map(({ drawType, posts }) => {
            const meta = DRAW_META[drawType];
            const theme = COLUMN_THEME[drawType];
            return (
              <div key={drawType}>
                <h3 className={`text-sm font-bold ${theme.heading} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                  <span aria-hidden="true">{meta.emoji}</span>
                  <span>{meta.label} ({meta.ukDrawTime})</span>
                </h3>
                <ul className="space-y-2">
                  {posts.map(post => (
                    <li key={post.date}>
                      <Link
                        href={`/blog/uk-49s-${drawType}-predictions-${post.date}`}
                        className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${theme.hoverBorder} transition-colors`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {post.isToday && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.badge} flex-shrink-0`}>TODAY</span>
                          )}
                          <span className="text-sm text-gray-900 dark:text-white truncate">{post.formatted}</span>
                        </span>
                        <svg aria-hidden="true" className={`w-4 h-4 ${theme.arrow} flex-shrink-0 ml-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Guides — evergreen articles */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guides &amp; Strategy</h2>
          <Link
            href="/articles"
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            View all guides &rarr;
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          In-depth articles on UK 49s strategy, the math behind the game, and what to avoid. Written for actual reading.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...articles]
            .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
            .slice(0, 4)
            .map(a => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {a.category}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{a.readingTimeMinutes} min</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{a.excerpt}</p>
              </Link>
            ))}
        </div>
      </section>

      {/* Number Analysis Tools */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Number Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/hot-cold-numbers"
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Hot &amp; Cold Numbers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Most and least frequently drawn numbers from recent UK 49s draws.
            </p>
          </Link>
          <Link
            href="/numbers"
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Number Statistics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Frequency data, last drawn dates, and hot/cold status for all 49 numbers.
            </p>
          </Link>
          <Link
            href="/lunchtime-vs-teatime"
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Lunchtime vs Teatime</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Side-by-side comparison of the two main daily draws and how their numbers differ.
            </p>
          </Link>
          <Link
            href="/odds"
            className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Odds &amp; Payouts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How UK 49s odds work for Pick 1 through Pick 5 bets, with and without Booster.
            </p>
          </Link>
        </div>
      </section>

      {/* Latest Results Quick Links */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {latestDates.map(date => {
            const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
              weekday: 'short', month: 'short', day: 'numeric',
            });
            return (
              <div key={date} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{formattedDate}</p>
                <div className="flex flex-col gap-2">
                  {ALL_DRAW_TYPES.map(drawType => {
                    const result = results.find(r => r.date === date && r.drawType === drawType);
                    if (!result) return null;
                    const meta = DRAW_META[drawType];
                    const theme = COLUMN_THEME[drawType];
                    return (
                      <Link
                        key={drawType}
                        href={`/${drawType}/results/${date}`}
                        className={`flex items-center gap-2 text-sm ${theme.rowHover} rounded-lg px-2 py-1.5 transition-colors`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${theme.badge}`}>
                          {meta.shortLabel}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {result.numbers.join(', ')} + {result.booster}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <Link href="/history" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
            View full results history &rarr;
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Blog', url: '/blog' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.blog.title, PAGE_SEO.blog.description, '/blog')) }} />
    </div>
  );
}
