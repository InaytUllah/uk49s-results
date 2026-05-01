import { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/articles/data';
import { SITE_NAME, SITE_URL, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

const title = `UK 49s Articles & Guides — Strategy, Math, Tips | ${SITE_NAME}`;
const description = 'In-depth UK 49s articles covering strategy, the math behind the game, common mistakes, scams to avoid, and more. Honest analysis, no hype.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/articles` },
  ...ogMeta(title, description, '/articles'),
};

export const revalidate = 3600;

export default function ArticlesIndexPage() {
  // Sort newest first
  const sorted = [...articles].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

  // Group by category for the secondary view
  const byCategory: Record<string, typeof articles> = {};
  for (const a of sorted) {
    byCategory[a.category] = byCategory[a.category] ?? [];
    byCategory[a.category].push(a);
  }
  const categoryOrder = ['Guide', 'Strategy', 'Statistics', 'Safety', 'Culture'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link href="/blog" className="hover:text-emerald-600">Blog</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Guides &amp; Strategy</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        UK 49s Guides &amp; Strategy
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
        Honest, in-depth pieces on UK 49s strategy, math, common mistakes, and how the game actually works. No hype, no fake tips, no paid predictions.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Looking for daily prediction posts instead?{' '}
        <Link href="/blog" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
          See the latest blog posts
        </Link>.
      </p>

      {/* Latest articles */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest</h2>
        <div className="space-y-4">
          {sorted.slice(0, 3).map(a => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="block rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {a.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{a.readingTimeMinutes} min read</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                {a.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* All articles by category */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All articles by topic</h2>
        <div className="space-y-8">
          {categoryOrder.filter(c => byCategory[c]?.length).map(category => (
            <div key={category}>
              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {byCategory[category].map(a => (
                  <li key={a.slug}>
                    <Link
                      href={`/articles/${a.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{a.title}</span>
                      <svg aria-hidden="true" className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: 'Blog', url: '/blog' },
          { name: 'Guides & Strategy', url: '/articles' },
        ])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(title, description, '/articles')) }}
      />
    </div>
  );
}
