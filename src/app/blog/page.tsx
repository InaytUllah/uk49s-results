import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults, getPredictionDate } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
};

export const revalidate = 60;

export default async function BlogPage() {
  const results = await getLatestResults();
  const predInfo = getPredictionDate(results);

  // Result blog posts
  const resultPosts = results.slice(0, 10).map(result => {
    const drawLabel = result.drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
    const formattedDate = new Date(result.date + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return {
      slug: `uk-49s-${result.drawType}-results-${result.date}`,
      title: `UK 49s ${drawLabel} Results for ${formattedDate}`,
      excerpt: `The winning numbers for the UK 49s ${drawLabel} draw on ${formattedDate} are ${result.numbers.join(', ')} with Booster ${result.booster}.`,
      date: result.date,
      type: 'result' as const,
      drawType: result.drawType,
    };
  });

  // Prediction blog posts (next prediction date + recent dates)
  const uniqueDates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const predictionDates = [predInfo.date, ...uniqueDates.slice(0, 3).map(date => {
    const d = new Date(date + 'T00:00:00');
    return date; // Use the result date for past prediction posts
  })];

  const predictionPosts = [...new Set(predictionDates)].slice(0, 3).map(date => {
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return {
      slug: `uk-49s-predictions-${date}`,
      title: `UK 49s Predictions for ${formattedDate}`,
      excerpt: `Statistical predictions for UK 49s Lunchtime and Teatime draws on ${formattedDate}. Based on hot number analysis from recent results.`,
      date,
      type: 'prediction' as const,
      drawType: null,
    };
  });

  // Merge and sort all posts by date (newest first)
  const allPosts = [...predictionPosts, ...resultPosts]
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Blog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Latest results, predictions, analysis and tips about UK 49s
      </p>

      <div className="space-y-6">
        {allPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              {post.type === 'prediction' ? (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Predictions
                </span>
              ) : (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  post.drawType === 'lunchtime'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                }`}>
                  {post.drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime'}
                </span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 text-sm font-medium"
            >
              {post.type === 'prediction' ? 'View Predictions' : 'Read Full Analysis'} &rarr;
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
