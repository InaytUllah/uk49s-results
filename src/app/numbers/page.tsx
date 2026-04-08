import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults, calculateFrequency } from '@/lib/data/draws';
import { PAGE_SEO, SITE_NAME, SITE_URL, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const revalidate = 60;

export const metadata: Metadata = {
  title: PAGE_SEO.numbers.title,
  description: PAGE_SEO.numbers.description,
  alternates: { canonical: `${SITE_URL}/numbers` },
  ...ogMeta(PAGE_SEO.numbers.title, PAGE_SEO.numbers.description, '/numbers'),
};

function getBallColor(num: number): string {
  if (num <= 9) return 'from-red-500 to-red-600';
  if (num <= 19) return 'from-orange-500 to-orange-600';
  if (num <= 29) return 'from-yellow-500 to-yellow-600';
  if (num <= 39) return 'from-green-500 to-green-600';
  return 'from-blue-500 to-blue-600';
}

function getStatusBadge(count: number, avg: number): { label: string; classes: string } {
  if (count >= avg * 1.2) return { label: 'Hot', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  if (count <= avg * 0.8) return { label: 'Cold', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
  return { label: 'Neutral', classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
}

export default async function NumbersIndexPage() {
  const allResults = await getLatestResults();
  const freqAll = calculateFrequency(allResults);
  const totalDraws = allResults.length;

  const allCounts = [...freqAll.values()];
  const avgCount = allCounts.reduce((a, b) => a + b, 0) / allCounts.length;
  const maxCount = Math.max(...allCounts, 1);

  // Sort by frequency descending
  const sortedNumbers = [...freqAll.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Numbers</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK49s Statistics — All 49 Numbers
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Complete UK 49s number frequency statistics ranked by draw count. Click any number for detailed stats and history.
      </p>

      {/* Quick grid of all numbers */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Pick a Number</h2>
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
          {Array.from({ length: 49 }, (_, i) => i + 1).map(num => (
            <Link
              key={num}
              href={`/numbers/${num}`}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${getBallColor(num)} text-white font-bold flex items-center justify-center shadow-md hover:scale-110 transition-transform text-sm sm:text-base`}
            >
              {num}
            </Link>
          ))}
        </div>
      </section>

      {/* Full ranked table */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          All Numbers by Frequency
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Based on {totalDraws} recent draws (Lunchtime + Teatime combined)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Rank</th>
                <th className="text-left py-3 px-2">Number</th>
                <th className="text-left py-3 px-2">Drawn</th>
                <th className="text-left py-3 px-2 hidden sm:table-cell">%</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2 hidden sm:table-cell">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {sortedNumbers.map(([num, count], index) => {
                const percentage = totalDraws > 0 ? ((count / totalDraws) * 100).toFixed(1) : '0.0';
                const barWidth = (count / maxCount) * 100;
                const badge = getStatusBadge(count, avgCount);

                return (
                  <tr key={num} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-3 px-2">
                      <Link
                        href={`/numbers/${num}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${getBallColor(num)} text-white font-bold flex items-center justify-center text-xs shadow`}>
                          {num}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Number {num}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                      {count}
                    </td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      {percentage}%
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge.classes}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-2 hidden sm:table-cell">
                      <div className="w-full max-w-[200px] bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${badge.label === 'Hot' ? 'bg-red-500' : badge.label === 'Cold' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Internal Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/hot-cold-numbers" className="block bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-red-700 dark:text-red-400">Hot & Cold Numbers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most and least drawn numbers</p>
          </Link>
          <Link href="/predictions" className="block bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Statistical predictions for today</p>
          </Link>
          <Link href="/lunchtime-vs-teatime" className="block bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400">Lunchtime vs Teatime</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Compare the two daily draws</p>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding UK 49s Number Frequency</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                This page shows the draw frequency for all <strong className="text-gray-900 dark:text-white">49 numbers</strong> in the UK 49s lottery.
                Numbers are ranked from most frequently drawn to least frequently drawn, based
                on recent <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime</Link> and <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime</Link> results.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Number Classifications</h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Hot — drawn 20%+ above average
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Cold — drawn 20%+ below average
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span> Neutral — around average frequency
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
                Click on any number to see its full statistics including separate Lunchtime and Teatime breakdowns, last
                drawn dates, and more.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
                <span>Lottery draws are random events. While frequency analysis can be interesting, past results do not influence future draws. Always gamble responsibly.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Number Statistics', url: '/numbers' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.numbers.title, PAGE_SEO.numbers.description, '/numbers')) }} />
    </div>
  );
}
