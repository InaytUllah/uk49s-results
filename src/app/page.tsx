import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import AdSlot from '@/components/AdSlot';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
};

export const revalidate = 300; // Revalidate every 5 minutes

export default function HomePage() {
  const allResults = getLatestResults();
  const latestLunchtime = allResults.find(r => r.drawType === 'lunchtime');
  const latestTeatime = allResults.find(r => r.drawType === 'teatime');
  const recentResults = allResults.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          UK 49s Results Today
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Latest Lunchtime and Teatime winning numbers, updated daily
        </p>
      </section>

      {/* Countdown Timers */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Countdown drawType="lunchtime" />
        <Countdown drawType="teatime" />
      </section>

      <AdSlot slot="1234567890" format="horizontal" />

      {/* Latest Results */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Latest UK 49s Results
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {latestLunchtime && (
            <div>
              <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3">
                Lunchtime Result
              </h3>
              <ResultCard result={latestLunchtime} featured />
            </div>
          )}
          {latestTeatime && (
            <div>
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
                Teatime Result
              </h3>
              <ResultCard result={latestTeatime} featured />
            </div>
          )}
        </div>
      </section>

      <AdSlot slot="1234567891" format="auto" />

      {/* Recent Results Table */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Results
          </h2>
          <Link
            href="/history"
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium text-sm"
          >
            View All History &rarr;
          </Link>
        </div>
        <div className="space-y-4">
          {recentResults.map((result, i) => (
            <ResultCard key={`${result.date}-${result.drawType}`} result={result} />
          ))}
        </div>
      </section>

      <AdSlot slot="1234567892" format="auto" />

      {/* Quick Links Grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          UK 49s Tools & Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/hot-cold-numbers', title: 'Hot & Cold Numbers', desc: 'See most and least drawn numbers', icon: '🔥' },
            { href: '/predictions', title: 'Predictions', desc: 'Statistical predictions for next draw', icon: '🎯' },
            { href: '/number-generator', title: 'Number Generator', desc: 'Generate random UK 49s numbers', icon: '🎲' },
            { href: '/history', title: 'Past Results', desc: 'Browse complete results history', icon: '📊' },
            { href: '/how-to-play', title: 'How to Play', desc: 'Learn UK 49s rules and odds', icon: '📖' },
            { href: '/blog', title: 'Latest News', desc: 'Tips, analysis and news', icon: '📰' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-white dark:bg-gray-800 transition-all hover:shadow-md"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="prose dark:prose-invert max-w-none mb-10">
        <h2>About UK 49s Lottery</h2>
        <p>
          UK 49s is one of the most popular lottery games in the United Kingdom and South Africa.
          Unlike other lotteries, UK 49s gives players the flexibility to choose how many numbers
          they want to bet on, from 1 to 5 numbers, plus a Booster ball option.
        </p>
        <h3>UK 49s Draw Times</h3>
        <p>
          There are two draws every day, 7 days a week:
        </p>
        <ul>
          <li><strong>Lunchtime Draw:</strong> 12:49 PM (UK time)</li>
          <li><strong>Teatime Draw:</strong> 5:49 PM (UK time)</li>
        </ul>
        <h3>How UK 49s Works</h3>
        <p>
          In each draw, 6 main numbers are drawn from a pool of 1 to 49, plus a 7th Booster ball.
          Players can choose to bet on 1 to 5 numbers. The more numbers you pick, the higher
          the potential payout, but the harder it is to win.
        </p>
      </section>

      {/* Schema.org FAQ */}
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
                  text: 'The UK 49s Lunchtime draw takes place every day at 12:49 PM UK time.',
                },
              },
              {
                '@type': 'Question',
                name: 'What time is the UK 49s Teatime draw?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The UK 49s Teatime draw takes place every day at 5:49 PM UK time.',
                },
              },
              {
                '@type': 'Question',
                name: 'How many numbers are drawn in UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '6 main numbers are drawn from a pool of 1 to 49, plus a 7th Booster ball.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
