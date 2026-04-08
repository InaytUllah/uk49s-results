import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, calculateFrequency } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.hotCold.title,
  description: PAGE_SEO.hotCold.description,
  alternates: { canonical: '/hot-cold-numbers' },
  ...ogMeta(PAGE_SEO.hotCold.title, PAGE_SEO.hotCold.description, '/hot-cold-numbers'),
};

export const revalidate = 60;

export default async function HotColdPage() {
  const allResults = await getLatestResults();
  const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');

  const hotAll = getHotNumbers(allResults, 10);
  const coldAll = getColdNumbers(allResults, 10);
  const hotLunch = getHotNumbers(lunchtimeResults, 7);
  const coldLunch = getColdNumbers(lunchtimeResults, 7);
  const hotTea = getHotNumbers(teatimeResults, 7);
  const coldTea = getColdNumbers(teatimeResults, 7);

  const freqAll = calculateFrequency(allResults);
  const sortedFreq = [...freqAll.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        49s Hot and Cold Numbers Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        UK 49s hot and cold numbers for Lunchtime and Teatime draws — updated daily from recent results
      </p>

      {/* Overall Hot & Cold */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overall (All Draws)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4">Hot Numbers (Most Drawn)</h3>
            <LotteryBalls numbers={hotAll} size="md" animated={false} />
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">Cold Numbers (Least Drawn)</h3>
            <LotteryBalls numbers={coldAll} size="md" animated={false} />
          </div>
        </div>
      </section>

      {/* By Draw Type */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">By Draw Type</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lunchtime */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400">Lunchtime</h3>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3">Hot</p>
              <LotteryBalls numbers={hotLunch} size="sm" animated={false} />
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Cold</p>
              <LotteryBalls numbers={coldLunch} size="sm" animated={false} />
            </div>
          </div>
          {/* Teatime */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">Teatime</h3>
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">Hot</p>
              <LotteryBalls numbers={hotTea} size="sm" animated={false} />
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Cold</p>
              <LotteryBalls numbers={coldTea} size="sm" animated={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Frequency Table */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Number Frequency</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2">Number</th>
                <th className="text-left py-3 px-2">Times Drawn</th>
                <th className="text-left py-3 px-2">Frequency Bar</th>
              </tr>
            </thead>
            <tbody>
              {sortedFreq.map(([num, count]) => {
                const maxCount = sortedFreq[0][1] || 1;
                const width = (count / maxCount) * 100;
                return (
                  <tr key={num} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 font-bold">
                      <Link href={`/numbers/${num}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{num}</Link>
                    </td>
                    <td className="py-2 px-2">{count}</td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${count === sortedFreq[0][1] ? 'bg-red-500' : count === sortedFreq[sortedFreq.length - 1][1] ? 'bg-blue-500' : 'bg-emerald-500'}`}
                          style={{ width: `${width}%` }}
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

      {/* Prediction CTAs */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use Hot Numbers in Predictions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/lunchtime-predictions" className="block bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">12:49 PM Draw</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lunchtime Predictions for Today</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">3 weighted prediction sets using today&apos;s hottest Lunchtime numbers</p>
          </Link>
          <Link href="/teatime-predictions" className="block bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">5:49 PM Draw</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Teatime Predictions for Today</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">3 weighted prediction sets using today&apos;s hottest Teatime numbers</p>
          </Link>
        </div>
      </section>

      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Hot and Cold Numbers</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">Hot numbers</strong> are those drawn most frequently in recent UK 49s draws.
                <strong className="text-gray-900 dark:text-white"> Cold numbers</strong> are those drawn least often. While past frequency does not guarantee
                future results, many players use this analysis to inform their number selections
                for both the <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime</Link> and <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime</Link> draws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Use Number Frequency Data</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span><strong className="text-gray-900 dark:text-white">Follow the hot streak</strong> — pick frequently drawn numbers, reasoning they may continue</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span><strong className="text-gray-900 dark:text-white">Target cold numbers</strong> — choose rarely drawn numbers, believing they are &quot;due&quot;</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span><strong className="text-gray-900 dark:text-white">Balanced approach</strong> — combine both hot and cold numbers in a single bet</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Every draw is an independent event — each number has an equal probability of being drawn regardless of past performance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analyse Individual Numbers</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Click on any number in the frequency table above to see detailed statistics for that
                specific number, including how often it has appeared as a main ball or Booster, its
                most recent appearances, and which draw type it favours. Visit our{' '}
                <Link href="/numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">number stats hub</Link> for a complete overview of all 49 numbers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Combine Data with Other Tools</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Predictions page</Link> — statistically informed suggestions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/odds" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Odds and payouts</Link> — understand your potential returns</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Random number generator</Link> — unbiased quick picks</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/lunchtime-vs-teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime vs Teatime</Link> — see if numbers differ across draws</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Hot & Cold Numbers', url: '/hot-cold-numbers' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.hotCold.title, PAGE_SEO.hotCold.description, '/hot-cold-numbers')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What are the UK 49s hot and cold numbers today?',
            acceptedAnswer: { '@type': 'Answer', text: `The current hot numbers (most frequently drawn) for UK 49s are ${hotAll.slice(0, 5).join(', ')}. The cold numbers (least drawn) are ${coldAll.slice(0, 5).join(', ')}. These are updated daily based on recent Lunchtime and Teatime draw results.` },
          },
          {
            '@type': 'Question',
            name: 'What are the 49s Lunchtime hot and cold numbers?',
            acceptedAnswer: { '@type': 'Answer', text: `The hottest Lunchtime numbers are ${hotLunch.slice(0, 5).join(', ')} and the coldest are ${coldLunch.slice(0, 5).join(', ')}. These are based on frequency analysis of the 12:49 PM Lunchtime draw specifically.` },
          },
          {
            '@type': 'Question',
            name: 'What are the 49s Teatime hot and cold numbers?',
            acceptedAnswer: { '@type': 'Answer', text: `The hottest Teatime numbers are ${hotTea.slice(0, 5).join(', ')} and the coldest are ${coldTea.slice(0, 5).join(', ')}. These are based on frequency analysis of the 5:49 PM Teatime draw specifically.` },
          },
          {
            '@type': 'Question',
            name: 'How are UK 49s hot and cold numbers calculated?',
            acceptedAnswer: { '@type': 'Answer', text: 'Hot numbers are those drawn most frequently in recent UK 49s draws. Cold numbers are those drawn least often. We analyse the last 30 days of both Lunchtime and Teatime results. While past frequency does not guarantee future results, many players use this data to inform their number selections.' },
          },
          {
            '@type': 'Question',
            name: 'Should I pick hot or cold numbers for UK 49s?',
            acceptedAnswer: { '@type': 'Answer', text: 'Both strategies are popular. Some players follow hot numbers believing trends continue, while others target cold numbers believing they are "due". A balanced approach combines both. Remember that every UK 49s draw is an independent random event — each number has an equal chance regardless of past results.' },
          },
        ],
      }) }} />
    </div>
  );
}
