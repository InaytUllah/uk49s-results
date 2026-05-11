import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import UpcomingDraw from '@/components/UpcomingDraw';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.teatime.title,
  description: PAGE_SEO.teatime.description,
  alternates: { canonical: '/teatime' },
  ...ogMeta(PAGE_SEO.teatime.title, PAGE_SEO.teatime.description, '/teatime'),
};

export const revalidate = 300;

export default async function TeatimePage() {
  const results = await getLatestResults('teatime');
  const latest = results[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Teatime Results</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Teatime Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Today&apos;s winning numbers drawn at 5:49 PM UK time
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Team</Link></span>
        <span aria-hidden="true">·</span>
        <time dateTime={new Date().toISOString()}>Updated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
      </div>

      {/* Upcoming Draw Placeholder - shows ? balls + countdown before results */}
      <UpcomingDraw drawType="teatime" latestDate={latest?.date || ''} />

      <Countdown drawType="teatime" />

      {latest ? (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Teatime Result</h2>
          <ResultCard result={latest} featured />
        </section>
      ) : (
        <section className="mb-8 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Results for today&apos;s Teatime draw will appear here shortly after 5:49 PM UK time. Check back soon or see our <Link href="/history" className="text-emerald-600 dark:text-emerald-400 hover:underline">past results archive</Link>.
          </p>
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Teatime Results</h2>
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

      <section className="mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About UK 49s Teatime Draw</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <strong className="text-gray-900 dark:text-white">UK 49s Teatime draw</strong> takes place every day at <strong className="text-gray-900 dark:text-white">5:49 PM UK time</strong> (GMT/BST), offering players
                a second daily opportunity to win. Six main numbers are drawn from a pool of 1 to 49, followed
                by a <strong className="text-gray-900 dark:text-white">Booster ball</strong>. This page is updated immediately after each draw so you can check your
                teatime results today as quickly as possible.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Teatime Draw Schedule and Format</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Detail</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Time</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">5:49 PM UK time (daily, including weekends)</td></tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30"><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Numbers drawn</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">6 main numbers + 1 Booster ball</td></tr>
                    <tr><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Number range</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">1 to 49</td></tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30"><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Betting options</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Choose 1 to 5 numbers, with or without the Booster</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Use Teatime Results</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                After the 5:49 PM draw, compare your selected numbers against the results displayed above.
                If your numbers match any of the 6 drawn balls (or the Booster if you opted in), you win
                according to the payout structure set by your bookmaker. The <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Teatime</span></span> draw is completely
                independent from the <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Lunchtime</span></span> draw.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Teatime Draw Strategy</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Check <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot and cold numbers</Link> for Teatime-specific frequency data</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Review <Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">our predictions</Link> for data-driven suggestions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Use the <Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">number generator</Link> for quick random picks</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Visit our <Link href="/lunchtime-vs-teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">comparison page</Link> for statistical differences</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Why Play the Teatime Draw?</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The Teatime draw at 5:49 PM is popular among players who prefer an evening betting opportunity.
                If you missed the <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime draw</Link> at 12:49 PM, the Teatime draw
                gives you another chance. Whatever your approach,
                always remember to gamble responsibly and within your means.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema for Teatime */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What time is the UK 49s Teatime draw?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The UK 49s Teatime draw takes place every day at 5:49 PM UK time (GMT/BST).',
                },
              },
              {
                '@type': 'Question',
                name: 'Are Teatime and Lunchtime draws independent?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, the Teatime and Lunchtime draws are completely independent events. The same numbers can appear in both draws on the same day.',
                },
              },
              {
                '@type': 'Question',
                name: 'When are Teatime results available?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Teatime results are typically available within minutes of the 5:49 PM draw. Check this page for the latest results updated automatically.',
                },
              },
              {
                '@type': 'Question',
                name: 'What are the Teatime draw odds?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The odds depend on how many numbers you select. Picking 1 number gives odds of approximately 7.33/1, while picking 5 numbers has odds of around 96,454/1.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I bet on both Lunchtime and Teatime draws?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, you can place separate bets on both the Lunchtime (12:49 PM) and Teatime (5:49 PM) draws through your licensed bookmaker.',
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
              { '@type': 'ListItem', position: 2, name: 'Teatime Results', item: 'https://uk49sresults.co.uk/teatime' },
            ],
          }),
        }}
      />
    </div>
  );
}
