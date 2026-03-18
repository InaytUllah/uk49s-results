import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.history.title,
  description: PAGE_SEO.history.description,
};

export const revalidate = 300;

export default function HistoryPage() {
  const allResults = getLatestResults();
  const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');

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

      {/* Results */}
      <div className="space-y-4">
        {allResults.map((result, i) => (
          <div key={`${result.date}-${result.drawType}`}>
            <ResultCard result={result} />
          </div>
        ))}
      </div>

      <section className="prose dark:prose-invert max-w-none mt-10">
        <h2>UK 49s Results Archive</h2>
        <p>
          Browse our complete archive of UK 49s results for both Lunchtime and Teatime draws.
          Results are updated daily after each draw. Use the filter options above to view
          only Lunchtime or Teatime results.
        </p>
      </section>
    </div>
  );
}
