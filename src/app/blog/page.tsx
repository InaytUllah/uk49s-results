import { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
};

export const revalidate = 300;

export default function BlogPage() {
  const results = getLatestResults();

  // Auto-generate blog posts from recent results
  const posts = results.slice(0, 10).map(result => {
    const drawLabel = result.drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
    const formattedDate = new Date(result.date + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return {
      slug: `uk-49s-${result.drawType}-results-${result.date}`,
      title: `UK 49s ${drawLabel} Results for ${formattedDate}`,
      excerpt: `The winning numbers for the UK 49s ${drawLabel} draw on ${formattedDate} are ${result.numbers.join(', ')} with Booster ${result.booster}.`,
      date: result.date,
      drawType: result.drawType,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Blog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Latest results, analysis, tips and news about UK 49s
      </p>

      <AdSlot slot="1122334455" className="mb-6" />

      <div className="space-y-6">
        {posts.map((post, i) => (
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
                {post.drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {post.excerpt}
            </p>
            <Link
              href={`/${post.drawType}/results/${post.date}`}
              className="inline-block mt-3 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 text-sm font-medium"
            >
              View Full Results &rarr;
            </Link>
            {i > 0 && i % 3 === 0 && <AdSlot slot={`112233445${i}`} className="mt-4" />}
          </article>
        ))}
      </div>

      <AdSlot slot="1122334456" className="my-6" />
    </div>
  );
}
