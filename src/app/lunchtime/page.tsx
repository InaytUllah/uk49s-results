import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import UpcomingDraw from '@/components/UpcomingDraw';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.lunchtime.title,
  description: PAGE_SEO.lunchtime.description,
  alternates: { canonical: '/lunchtime' },
  ...ogMeta(PAGE_SEO.lunchtime.title, PAGE_SEO.lunchtime.description, '/lunchtime'),
};

export const revalidate = 60;

export default async function LunchtimePage() {
  const results = await getLatestResults('lunchtime');
  const latest = results[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Lunchtime Results</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Lunchtime Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Today&apos;s winning numbers drawn at 12:49 PM UK time
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Team</Link></span>
        <span aria-hidden="true">·</span>
        <time dateTime={new Date().toISOString()}>Updated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
      </div>

      {/* Upcoming Draw Placeholder - shows ? balls + countdown before results */}
      <UpcomingDraw drawType="lunchtime" latestDate={latest?.date || ''} />

      <Countdown drawType="lunchtime" />

      {/* Latest Result */}
      {latest ? (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Lunchtime Result</h2>
          <ResultCard result={latest} featured />
        </section>
      ) : (
        <section className="mb-8 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Results for today&apos;s Lunchtime draw will appear here shortly after 12:49 PM UK time. Check back soon or see our <Link href="/history" className="text-emerald-600 dark:text-emerald-400 hover:underline">past results archive</Link>.
          </p>
        </section>
      )}

      {/* Past Lunchtime Results */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Lunchtime Results</h2>
          <Link href="/history" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View All &rarr;
          </Link>
        </div>
        <div className="space-y-4">
          {results.slice(1).map(result => (
            <ResultCard key={`${result.date}-${result.drawType}`} result={result} />
          ))}
        </div>
      </section>

      {/* Internal Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Pages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/predictions" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Predictions
          </Link>
          <Link href="/hot-cold-numbers" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Hot &amp; Cold Numbers
          </Link>
          <Link href="/odds" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Odds &amp; Payouts
          </Link>
          <Link href="/numbers" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Number Stats
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About UK 49s Lunchtime Draw</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <strong className="text-gray-900 dark:text-white">UK 49s Lunchtime draw</strong> takes place every day at <strong className="text-gray-900 dark:text-white">12:49 PM UK time</strong> (GMT/BST), making it one
                of the earliest daily lottery-style draws available. Six main numbers are drawn from a pool of
                1 to 49, followed by a <strong className="text-gray-900 dark:text-white">Booster ball</strong>. This page is updated immediately after each draw with the
                latest winning numbers, so you can check your lunchtime results today within minutes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Lunchtime Draw Schedule and Format</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Detail</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Time</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">12:49 PM UK time (daily, including weekends)</td></tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30"><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Numbers drawn</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">6 main numbers + 1 Booster ball</td></tr>
                    <tr><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Number range</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">1 to 49</td></tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30"><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Betting options</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Choose 1 to 5 numbers, with or without the Booster</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Use Lunchtime Results</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                After each draw, check your selected numbers against the results shown above. If your chosen
                numbers match any of the 6 drawn balls (or the Booster if included), you win. The payout depends
                on how many numbers you picked and the odds set by your bookmaker. Many players analyse past
                lunchtime results to identify trends, hot numbers, and patterns. Visit our{' '}
                <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot and cold numbers</Link> page to see which numbers appear
                most frequently in the Lunchtime draw specifically.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Lunchtime vs Teatime</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Lunchtime</span></span> draw is the first of two daily UK 49s draws. The second draw, the{' '}
                <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime draw</Link>, takes place at 5:49 PM. Both draws use the same
                format and number pool, but they are independent events with separate results. Check our{' '}
                <Link href="/lunchtime-vs-teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime vs Teatime comparison</Link> to see statistical
                differences between the two draws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tips for Lunchtime Players</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Check the <Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">predictions</Link> page for data-driven suggestions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Use our <Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">random number generator</Link> for a quick pick</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Review <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot and cold numbers</Link> for frequency insights</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
                  <span>Always gamble responsibly and within your budget</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema for Lunchtime */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What time is the UK 49s Lunchtime draw?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The UK 49s Lunchtime draw takes place every day at 12:49 PM UK time (GMT/BST).',
                },
              },
              {
                '@type': 'Question',
                name: 'How many numbers are drawn in the Lunchtime draw?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Six main numbers are drawn from a pool of 1 to 49, plus a 7th Booster ball.',
                },
              },
              {
                '@type': 'Question',
                name: 'When are Lunchtime results available?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Lunchtime results are typically available within minutes of the 12:49 PM draw. Check this page for the latest results updated automatically.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I bet on the Lunchtime draw online?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, you can place bets on the UK 49s Lunchtime draw through licensed bookmakers. Check with your local authorised betting operator for options.',
                },
              },
            ],
          }),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://uk49sresults.co.uk' },
              { '@type': 'ListItem', position: 2, name: 'Lunchtime Results', item: 'https://uk49sresults.co.uk/lunchtime' },
            ],
          }),
        }}
      />
    </div>
  );
}
