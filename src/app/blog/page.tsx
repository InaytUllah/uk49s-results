import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults, getPredictionDate, getPredictionDateForLunchtime } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { articles } from '@/lib/articles/data';

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  alternates: { canonical: '/blog' },
  ...ogMeta(PAGE_SEO.blog.title, PAGE_SEO.blog.description, '/blog'),
};

export const revalidate = 60;

interface PredictionPost {
  date: string;
  drawType: 'lunchtime' | 'teatime';
  formatted: string;
  isToday: boolean;
}

export default async function BlogPage() {
  const results = await getLatestResults();
  const uniqueDates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const latestDates = uniqueDates.slice(0, 5);

  // Build the recent prediction post list — today's + last 6 dates for both draws
  const teaInfo = getPredictionDate(results);
  const lunchInfo = getPredictionDateForLunchtime(results);
  const fmtDay = (date: string) =>
    new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const lunchDates = [...new Set([lunchInfo.date, ...uniqueDates.slice(0, 6)])].slice(0, 7);
  const teaDates = [...new Set([teaInfo.date, ...uniqueDates.slice(0, 6)])].slice(0, 7);

  const lunchPosts: PredictionPost[] = lunchDates.map(date => ({
    date,
    drawType: 'lunchtime' as const,
    formatted: fmtDay(date),
    isToday: date === lunchInfo.date,
  }));
  const teaPosts: PredictionPost[] = teaDates.map(date => ({
    date,
    drawType: 'teatime' as const,
    formatted: fmtDay(date),
    isToday: date === teaInfo.date,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Blog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Daily predictions, in-depth guides, and number analysis for UK 49s Lunchtime and Teatime draws.
      </p>

      {/* Today's Predictions — hub pages */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Today&apos;s Predictions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/lunchtime-predictions"
            className="block bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">12:49 PM Draw</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Lunchtime Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fresh prediction sets for today&apos;s Lunchtime draw, refreshed after each result.
            </p>
          </Link>
          <Link
            href="/teatime-predictions"
            className="block bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">5:49 PM Draw</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Teatime Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fresh prediction sets for today&apos;s Teatime draw, refreshed after each result.
            </p>
          </Link>
        </div>
      </section>

      {/* Recent Prediction Posts — dated, indexable */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Prediction Posts</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Daily prediction analysis for past Lunchtime and Teatime draws. Each post shows the prediction sets used for that day plus how they compared to the actual result.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lunchtime column */}
          <div>
            <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span aria-hidden="true">☀️</span>
              <span>Lunchtime (12:49 PM)</span>
            </h3>
            <ul className="space-y-2">
              {lunchPosts.map(post => (
                <li key={post.date}>
                  <Link
                    href={`/blog/uk-49s-lunchtime-predictions-${post.date}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {post.isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 flex-shrink-0">TODAY</span>
                      )}
                      <span className="text-sm text-gray-900 dark:text-white truncate">{post.formatted}</span>
                    </span>
                    <svg aria-hidden="true" className="w-4 h-4 text-amber-600 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teatime column */}
          <div>
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span aria-hidden="true">🌙</span>
              <span>Teatime (5:49 PM)</span>
            </h3>
            <ul className="space-y-2">
              {teaPosts.map(post => (
                <li key={post.date}>
                  <Link
                    href={`/blog/uk-49s-teatime-predictions-${post.date}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {post.isToday && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 flex-shrink-0">TODAY</span>
                      )}
                      <span className="text-sm text-gray-900 dark:text-white truncate">{post.formatted}</span>
                    </span>
                    <svg aria-hidden="true" className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
              Side-by-side comparison of both daily draws and how their numbers differ.
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
            const lunchResult = results.find(r => r.date === date && r.drawType === 'lunchtime');
            const teaResult = results.find(r => r.date === date && r.drawType === 'teatime');

            return (
              <div key={date} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{formattedDate}</p>
                <div className="flex flex-col gap-2">
                  {lunchResult && (
                    <Link
                      href={`/lunchtime/results/${date}`}
                      className="flex items-center gap-2 text-sm hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg px-2 py-1.5 transition-colors"
                    >
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                        Lunch
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {lunchResult.numbers.join(', ')} + {lunchResult.booster}
                      </span>
                    </Link>
                  )}
                  {teaResult && (
                    <Link
                      href={`/teatime/results/${date}`}
                      className="flex items-center gap-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg px-2 py-1.5 transition-colors"
                    >
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                        Tea
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {teaResult.numbers.join(', ')} + {teaResult.booster}
                      </span>
                    </Link>
                  )}
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
