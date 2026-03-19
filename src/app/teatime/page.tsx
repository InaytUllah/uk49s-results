import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import UpcomingDraw from '@/components/UpcomingDraw';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.teatime.title,
  description: PAGE_SEO.teatime.description,
};

export const revalidate = 60;

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
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Today&apos;s winning numbers drawn at 5:49 PM UK time
      </p>

      {/* Upcoming Draw Placeholder - shows ? balls + countdown before results */}
      <UpcomingDraw drawType="teatime" latestDate={latest?.date || ''} />

      <Countdown drawType="teatime" />

      {latest && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Teatime Result</h2>
          <ResultCard result={latest} featured />
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

      <section className="prose dark:prose-invert max-w-none mb-8">
        <h2>About UK 49s Teatime Draw</h2>
        <p>
          The UK 49s Teatime draw takes place every day at 5:49 PM UK time (GMT/BST), offering players
          a second daily opportunity to win. Six main numbers are drawn from a pool of 1 to 49, followed
          by a Booster ball. This page is updated immediately after each draw so you can check your
          teatime results today as quickly as possible.
        </p>

        <h3>Teatime Draw Schedule and Format</h3>
        <ul>
          <li><strong>Time:</strong> 5:49 PM UK time (every day, including weekends and holidays)</li>
          <li><strong>Numbers drawn:</strong> 6 main numbers + 1 Booster ball</li>
          <li><strong>Number range:</strong> 1 to 49</li>
          <li><strong>Betting options:</strong> Choose 1 to 5 numbers, with or without the Booster</li>
        </ul>

        <h3>How to Use Teatime Results</h3>
        <p>
          After the 5:49 PM draw, compare your selected numbers against the results displayed above.
          If your numbers match any of the 6 drawn balls (or the Booster if you opted in), you win
          according to the payout structure set by your bookmaker. The Teatime draw is completely
          independent from the Lunchtime draw, so the same numbers can appear in both draws on the
          same day.
        </p>

        <h3>Teatime Draw Strategy</h3>
        <p>
          While every draw is random, many players study past teatime results to make informed choices.
          Our <Link href="/hot-cold-numbers">hot and cold numbers</Link> analysis shows which numbers
          have appeared most and least often in Teatime draws specifically. You can also review{' '}
          <Link href="/predictions">our predictions</Link> or use the{' '}
          <Link href="/number-generator">number generator</Link> to select random numbers. For a
          detailed look at how Teatime compares to Lunchtime, visit our{' '}
          <Link href="/lunchtime-vs-teatime">comparison page</Link>.
        </p>

        <h3>Why Play the Teatime Draw?</h3>
        <p>
          The Teatime draw at 5:49 PM is popular among players who prefer an evening betting opportunity.
          If you missed the <Link href="/lunchtime">Lunchtime draw</Link> at 12:49 PM, the Teatime draw
          gives you another chance. Some players bet on both draws daily, while others prefer to focus
          exclusively on the Teatime draw and study its historical patterns. Whatever your approach,
          always remember to gamble responsibly and within your means.
        </p>
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
