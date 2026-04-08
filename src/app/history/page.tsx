import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import HistoryResults from './HistoryResults';

export const metadata: Metadata = {
  title: PAGE_SEO.history.title,
  description: PAGE_SEO.history.description,
  alternates: { canonical: '/history' },
  ...ogMeta(PAGE_SEO.history.title, PAGE_SEO.history.description, '/history'),
};

export const revalidate = 60;

export default async function HistoryPage() {
  const allResults = await getLatestResults();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Past Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Complete history of Lunchtime and Teatime draw results
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <span className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">
          All Results
        </span>
        <Link href="/lunchtime" className="px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-lg text-sm font-medium hover:bg-amber-200">
          Lunchtime Only
        </Link>
        <Link href="/teatime" className="px-4 py-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-200">
          Teatime Only
        </Link>
      </div>

      <HistoryResults results={allResults} />

      <section className="mt-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">UK 49s Results Archive</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Browse our complete archive of <strong className="text-gray-900 dark:text-white">UK 49s results</strong> for both <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Lunchtime</span></span> and <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Teatime</span></span> draws.
            Results are updated daily after each draw. Use the filter options above to view
            only Lunchtime or Teatime results.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Use <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Hot & Cold Numbers</Link> to analyse frequency from these results</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Click any number to view its <Link href="/numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">individual stats page</Link></span>
            </li>
          </ul>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Past Results', url: '/history' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.history.title, PAGE_SEO.history.description, '/history')) }} />
    </div>
  );
}
