import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.lunchtime.title,
  description: PAGE_SEO.lunchtime.description,
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
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Today&apos;s winning numbers drawn at 12:49 PM UK time
      </p>

      <Countdown drawType="lunchtime" />

      {/* Latest Result */}
      {latest && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Lunchtime Result</h2>
          <ResultCard result={latest} featured />
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
      <section className="prose dark:prose-invert max-w-none mb-8">
        <h2>About UK 49s Lunchtime Draw</h2>
        <p>
          The UK 49s Lunchtime draw takes place every day at 12:49 PM UK time (GMT/BST), making it one
          of the earliest daily lottery-style draws available. Six main numbers are drawn from a pool of
          1 to 49, followed by a Booster ball. This page is updated immediately after each draw with the
          latest winning numbers, so you can check your lunchtime results today within minutes.
        </p>

        <h3>Lunchtime Draw Schedule and Format</h3>
        <ul>
          <li><strong>Time:</strong> 12:49 PM UK time (every day, including weekends and holidays)</li>
          <li><strong>Numbers drawn:</strong> 6 main numbers + 1 Booster ball</li>
          <li><strong>Number range:</strong> 1 to 49</li>
          <li><strong>Betting options:</strong> Choose 1 to 5 numbers, with or without the Booster</li>
        </ul>

        <h3>How to Use Lunchtime Results</h3>
        <p>
          After each draw, check your selected numbers against the results shown above. If your chosen
          numbers match any of the 6 drawn balls (or the Booster if included), you win. The payout depends
          on how many numbers you picked and the odds set by your bookmaker. Many players analyse past
          lunchtime results to identify trends, hot numbers, and patterns. Visit our{' '}
          <Link href="/hot-cold-numbers">hot and cold numbers</Link> page to see which numbers appear
          most frequently in the Lunchtime draw specifically.
        </p>

        <h3>Lunchtime vs Teatime</h3>
        <p>
          The Lunchtime draw is the first of two daily UK 49s draws. The second draw, the{' '}
          <Link href="/teatime">Teatime draw</Link>, takes place at 5:49 PM. Both draws use the same
          format and number pool, but they are independent events with separate results. Some players
          prefer to bet on both draws for more chances, while others focus on one. Check our{' '}
          <Link href="/lunchtime-vs-teatime">Lunchtime vs Teatime comparison</Link> to see statistical
          differences between the two draws.
        </p>

        <h3>Tips for Lunchtime Players</h3>
        <p>
          While UK 49s is a game of chance and no strategy can guarantee a win, many players find
          it useful to review statistical data before placing bets. Consider checking the{' '}
          <Link href="/predictions">predictions</Link> page for data-driven suggestions, or use
          our <Link href="/number-generator">random number generator</Link> for a quick pick. Always
          remember to gamble responsibly and within your budget.
        </p>
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
