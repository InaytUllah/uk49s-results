import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults, getPredictionDate } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  alternates: { canonical: '/blog' },
};

export const revalidate = 60;

export default async function BlogPage() {
  const results = await getLatestResults();
  const predInfo = getPredictionDate(results);

  // Prediction blog posts only — no more result blog posts
  const uniqueDates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const predictionDates = [predInfo.date, ...uniqueDates.slice(0, 5)];

  const predictionPosts: { slug: string; title: string; excerpt: string; date: string; drawType: 'lunchtime' | 'teatime' }[] = [];
  for (const date of [...new Set(predictionDates)].slice(0, 5)) {
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    predictionPosts.push({
      slug: `uk-49s-lunchtime-predictions-${date}`,
      title: `UK 49s Lunchtime Predictions for ${formattedDate}`,
      excerpt: `Statistical analysis and 3 weighted prediction sets for the 12:49 PM Lunchtime draw on ${formattedDate}. Based on hot number trends.`,
      date,
      drawType: 'lunchtime',
    });
    predictionPosts.push({
      slug: `uk-49s-teatime-predictions-${date}`,
      title: `UK 49s Teatime Predictions for ${formattedDate}`,
      excerpt: `Statistical analysis and 3 weighted prediction sets for the 5:49 PM Teatime draw on ${formattedDate}. Based on hot number trends.`,
      date,
      drawType: 'teatime',
    });
  }

  // Latest results for quick-link section (deduplicate by date, show last 5 dates)
  const latestDates = uniqueDates.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Blog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Predictions, analysis and number trends for UK 49s Lunchtime and Teatime draws
      </p>

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

      {/* Prediction Posts */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Predictions & Analysis</h2>
        <div className="space-y-6">
          {predictionPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  post.drawType === 'lunchtime'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                }`}>
                  {post.drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime'} Predictions
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 text-sm font-medium"
              >
                View Full Analysis &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Blog', url: '/blog' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.blog.title, PAGE_SEO.blog.description, '/blog')) }} />
    </div>
  );
}
