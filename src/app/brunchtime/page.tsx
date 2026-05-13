import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import UpcomingDraw from '@/components/UpcomingDraw';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.brunchtime.title,
  description: PAGE_SEO.brunchtime.description,
  alternates: { canonical: '/brunchtime' },
  ...ogMeta(PAGE_SEO.brunchtime.title, PAGE_SEO.brunchtime.description, '/brunchtime'),
};

export const revalidate = 3600; // 1h — cron triggers revalidation on new draws

export default async function BrunchtimePage() {
  const results = await getLatestResults('brunchtime');
  const latest = results[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Brunchtime Results</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Brunchtime Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Today&apos;s winning numbers drawn at 10:49 AM UK time
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Team</Link></span>
        <span aria-hidden="true">·</span>
        <time dateTime={new Date().toISOString()}>Updated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
      </div>

      <UpcomingDraw drawType="brunchtime" latestDate={latest?.date || ''} />

      <Countdown drawType="brunchtime" />

      {latest ? (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Brunchtime Result</h2>
          <ResultCard result={latest} featured />
        </section>
      ) : (
        <section className="mb-8 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Results for today&apos;s Brunchtime draw will appear here shortly after 10:49 AM UK time. Check back soon or see our <Link href="/history" className="text-emerald-600 dark:text-emerald-400 hover:underline">past results archive</Link>.
          </p>
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Brunchtime Results</h2>
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

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Pages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/brunchtime-predictions" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Brunchtime Predictions
          </Link>
          <Link href="/hot-cold-numbers" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Hot &amp; Cold Numbers
          </Link>
          <Link href="/lunchtime" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-all">
            Lunchtime Results
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About UK 49s Brunchtime Draw</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <strong className="text-gray-900 dark:text-white">UK 49s Brunchtime draw</strong> takes place every day at <strong className="text-gray-900 dark:text-white">10:49 AM UK time</strong> (GMT/BST), making it the earliest of the four daily UK 49s draws. Six main numbers are drawn from a pool of 1 to 49, followed by a <strong className="text-gray-900 dark:text-white">Booster ball</strong>. This page is updated immediately after each Brunchtime draw with the latest winning numbers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Brunchtime Draw Schedule and Format</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Detail</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Time</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">10:49 AM UK time (daily, including weekends)</td></tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30"><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Numbers drawn</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">6 main numbers + 1 Booster ball</td></tr>
                    <tr><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Number range</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">1 to 49</td></tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30"><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">Betting options</td><td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Choose 1 to 5 numbers, with or without the Booster</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Brunchtime vs Other Draws</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">Brunchtime</span></span> draw is the first of four daily UK 49s draws. After Brunchtime, players can also try the <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime draw</Link> at 12:49 PM, the <Link href="/drivetime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Drivetime draw</Link> at 4:49 PM, and the <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime draw</Link> at 5:49 PM. Each draw is independent — the same numbers can come up in any of them.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tips for Brunchtime Players</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Check the <Link href="/brunchtime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Brunchtime predictions</Link> for data-driven suggestions</span>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What time is the UK 49s Brunchtime draw?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The UK 49s Brunchtime draw takes place every day at 10:49 AM UK time (GMT/BST).',
                },
              },
              {
                '@type': 'Question',
                name: 'How many numbers are drawn in the Brunchtime draw?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Six main numbers are drawn from a pool of 1 to 49, plus a 7th Booster ball.',
                },
              },
              {
                '@type': 'Question',
                name: 'When are Brunchtime results available?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Brunchtime results are typically available within minutes of the 10:49 AM draw. Check this page for the latest results updated automatically.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is Brunchtime independent from the other UK 49s draws?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, the Brunchtime, Lunchtime, Drivetime, and Teatime draws are all independent events with separate results. The same numbers can appear in multiple draws on the same day.',
                },
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://uk49sresults.co.uk' },
              { '@type': 'ListItem', position: 2, name: 'Brunchtime Results', item: 'https://uk49sresults.co.uk/brunchtime' },
            ],
          }),
        }}
      />
    </div>
  );
}
