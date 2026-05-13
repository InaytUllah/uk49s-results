import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, calculateFrequency } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { ALL_DRAW_TYPES, DRAW_META, DrawType, UK49sResult } from '@/lib/types';
import HotColdExplorer from './HotColdExplorer';

export const metadata: Metadata = {
  title: PAGE_SEO.hotCold.title,
  description: PAGE_SEO.hotCold.description,
  alternates: { canonical: '/hot-cold-numbers' },
  ...ogMeta(PAGE_SEO.hotCold.title, PAGE_SEO.hotCold.description, '/hot-cold-numbers'),
};

export const revalidate = 3600; // 1h — cron triggers revalidation on new draws

const PER_DRAW_THEME: Record<DrawType, {
  heading: string;
  bg: string;
  border: string;
  text: string;
}> = {
  brunchtime: {
    heading: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-400',
  },
  lunchtime: {
    heading: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-400',
  },
  drivetime: {
    heading: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-400',
  },
  teatime: {
    heading: 'text-indigo-700 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-400',
  },
};

export default async function HotColdPage() {
  const allResults = await getLatestResults();

  const resultsByDraw: Record<DrawType, UK49sResult[]> = {
    brunchtime: allResults.filter(r => r.drawType === 'brunchtime'),
    lunchtime: allResults.filter(r => r.drawType === 'lunchtime'),
    drivetime: allResults.filter(r => r.drawType === 'drivetime'),
    teatime: allResults.filter(r => r.drawType === 'teatime'),
  };

  const hotAll = getHotNumbers(allResults, 10);
  const coldAll = getColdNumbers(allResults, 10);

  const hotByDraw: Record<DrawType, number[]> = {
    brunchtime: getHotNumbers(resultsByDraw.brunchtime, 7),
    lunchtime: getHotNumbers(resultsByDraw.lunchtime, 7),
    drivetime: getHotNumbers(resultsByDraw.drivetime, 7),
    teatime: getHotNumbers(resultsByDraw.teatime, 7),
  };
  const coldByDraw: Record<DrawType, number[]> = {
    brunchtime: getColdNumbers(resultsByDraw.brunchtime, 7),
    lunchtime: getColdNumbers(resultsByDraw.lunchtime, 7),
    drivetime: getColdNumbers(resultsByDraw.drivetime, 7),
    teatime: getColdNumbers(resultsByDraw.teatime, 7),
  };

  const freqAll = calculateFrequency(allResults);
  const sortedFreq = [...freqAll.entries()].sort((a, b) => b[1] - a[1]);

  const now = new Date();
  const updatedLabel = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        49s Hot and Cold Numbers Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        UK 49s hot and cold numbers for all four daily draws — Brunchtime, Lunchtime, Drivetime and Teatime — updated daily from recent results.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        <time dateTime={now.toISOString()}>Updated {updatedLabel}</time> · Based on {allResults.length} recent draws
      </p>

      {/* AEO answer (sr-only) */}
      <div className="sr-only">
        <p>
          The top 5 hottest UK 49s numbers today are {hotAll.slice(0, 5).join(', ')}. The coldest are {coldAll.slice(0, 5).join(', ')}. Based on {ALL_DRAW_TYPES.map(d => `${resultsByDraw[d].length} ${DRAW_META[d].label}`).join(', ')} draws.
        </p>
      </div>

      {/* Interactive explorer with windows + overdue tab */}
      <HotColdExplorer
        results={allResults}
        resultsByDraw={resultsByDraw}
      />

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
          {ALL_DRAW_TYPES.map(drawType => {
            const meta = DRAW_META[drawType];
            const theme = PER_DRAW_THEME[drawType];
            return (
              <div key={drawType} className="space-y-4">
                <h3 className={`text-xl font-bold ${theme.heading}`}>{meta.label}</h3>
                <div className={`${theme.bg} border ${theme.border} rounded-xl p-4`}>
                  <p className={`text-sm font-semibold ${theme.text} mb-3`}>Hot</p>
                  <LotteryBalls numbers={hotByDraw[drawType]} size="sm" animated={false} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Cold</p>
                  <LotteryBalls numbers={coldByDraw[drawType]} size="sm" animated={false} />
                </div>
              </div>
            );
          })}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_DRAW_TYPES.map(drawType => {
            const meta = DRAW_META[drawType];
            const theme = PER_DRAW_THEME[drawType];
            return (
              <Link
                key={drawType}
                href={`/${drawType}-predictions`}
                className={`block ${theme.bg} border-2 ${theme.border} rounded-xl p-5 hover:shadow-lg transition-shadow`}
              >
                <p className={`text-sm font-semibold ${theme.text} mb-1`}>{meta.ukDrawTime} Draw</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{meta.label} Predictions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">3 weighted prediction sets using today&apos;s hottest {meta.label} numbers</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What are hot and cold numbers?</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">Hot numbers</strong> are the ones that keep showing up in recent draws.
                <strong className="text-gray-900 dark:text-white"> Cold numbers</strong> are the opposite: they haven&apos;t been drawn in a while. This doesn&apos;t mean hot numbers will keep appearing or that cold numbers are &quot;due&quot;, but a lot of players like to look at the data before picking their <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime</Link> or <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime</Link> numbers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Three ways people use this data</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span><strong className="text-gray-900 dark:text-white">Ride the hot streak.</strong> Pick numbers that have been coming up a lot, betting the pattern continues.</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span><strong className="text-gray-900 dark:text-white">Go cold.</strong> Pick numbers that haven&apos;t appeared recently, on the theory they&apos;re overdue.</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span><strong className="text-gray-900 dark:text-white">Mix both.</strong> Pick a few hot and a few cold in the same bet.</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Worth remembering: each draw is independent. The ball machine doesn&apos;t know what came up last time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Look up individual numbers</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Click any number in the table above to see its full stats: how often it appears as a main ball vs Booster, when it was last drawn, and which of the four draws it shows up in most. The{' '}
                <Link href="/numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">number stats page</Link> has all 49 numbers in one place.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Other tools on this site</h3>
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
            acceptedAnswer: { '@type': 'Answer', text: `The current hot numbers (most frequently drawn) for UK 49s are ${hotAll.slice(0, 5).join(', ')}. The cold numbers (least drawn) are ${coldAll.slice(0, 5).join(', ')}. These are updated daily based on recent results across all four daily draws.` },
          },
          {
            '@type': 'Question',
            name: 'How are UK 49s hot and cold numbers calculated?',
            acceptedAnswer: { '@type': 'Answer', text: 'Hot numbers are those drawn most frequently in recent UK 49s draws. Cold numbers are those drawn least often. We analyse Brunchtime, Lunchtime, Drivetime and Teatime results separately so you can see per-draw frequency. While past frequency does not guarantee future results, many players use this data to inform their number selections.' },
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
