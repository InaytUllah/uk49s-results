import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
};

export const revalidate = 60; // Revalidate every 1 minute

export default async function HomePage() {
  const allResults = await getLatestResults();
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
            <ResultCard key={`recent-${i}-${result.date}-${result.drawType}`} result={result} />
          ))}
        </div>
      </section>

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

      {/* Internal Links Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Explore More UK 49s Resources
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { href: '/odds', title: 'Odds & Payouts' },
            { href: '/faq', title: 'FAQ' },
            { href: '/numbers', title: 'Number Stats (1-49)' },
            { href: '/lunchtime-vs-teatime', title: 'Lunchtime vs Teatime' },
            { href: '/responsible-gaming', title: 'Responsible Gaming' },
            { href: '/about', title: 'About Us' },
            { href: '/disclaimer', title: 'Disclaimer' },
            { href: '/how-to-play', title: 'How to Play Guide' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all text-center"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="prose dark:prose-invert max-w-none mb-10">
        <h2>About UK 49s Lottery</h2>
        <p>
          UK 49s is one of the most popular lottery-style betting games in the United Kingdom and South Africa.
          Unlike traditional lotteries such as the National Lottery or EuroMillions, UK 49s gives players the
          unique flexibility to choose how many numbers they want to bet on — from 1 to 5 numbers — plus a
          Booster ball option. This flexibility means you control your own odds and potential payout, making
          UK 49s an appealing choice for those who want more control over their betting strategy.
        </p>

        <h3>UK 49s Results Today</h3>
        <p>
          Our site provides the fastest UK 49s results today for both the Lunchtime and Teatime draws. We update
          our lunchtime results today within minutes of the draw taking place at 12:49 PM, and our teatime results
          are available shortly after the 5:49 PM draw. Bookmark this page to check today&apos;s winning numbers
          as soon as they are released. We also maintain a comprehensive archive of past results so you can review
          historical data and identify trends.
        </p>

        <h3>UK 49s Draw Times</h3>
        <p>
          There are two draws every single day, 7 days a week, including weekends and bank holidays:
        </p>
        <ul>
          <li><strong>Lunchtime Draw:</strong> 12:49 PM (UK time) — one of the earliest daily lottery draws available</li>
          <li><strong>Teatime Draw:</strong> 5:49 PM (UK time) — the evening draw for a second daily chance</li>
        </ul>
        <p>
          Draw times may shift by one hour during BST (British Summer Time) changeovers, so always check
          our <Link href="/how-to-play">How to Play</Link> page for the most accurate schedule.
        </p>

        <h3>How UK 49s Works</h3>
        <p>
          In each draw, 6 main numbers are drawn from a pool of 1 to 49, plus a 7th number known as the
          Booster ball. Players can choose to bet on anywhere from 1 to 5 numbers. The more numbers you
          pick, the higher the potential payout, but the harder it is to win. You can also choose whether
          to include the Booster ball in your bet, which changes the odds. For example, betting on 1 number
          from 6 gives odds of approximately 7.33 to 1, while betting on 5 numbers from 6 offers odds of
          around 96,454 to 1. See our <Link href="/odds">odds and payouts page</Link> for full details.
        </p>

        <h3>UK 49s Predictions and Statistics</h3>
        <p>
          Many players look for UK49s predictions to help guide their number selections. While no prediction
          method can guarantee a win — every draw is random and independent — statistical analysis can reveal
          interesting patterns. Our <Link href="/hot-cold-numbers">hot and cold numbers</Link> page shows which
          numbers have been drawn most and least frequently in recent results. You can also use our
          free <Link href="/number-generator">random number generator</Link> for quick picks, or explore
          our <Link href="/predictions">predictions page</Link> for statistically informed suggestions.
        </p>

        <h3>Why Check UK 49s Results Here?</h3>
        <p>
          We are dedicated to providing the fastest, most accurate UK 49s results available online. Our
          platform is designed for speed, updated within minutes of each draw, and optimised for all devices
          so you can check results on your phone, tablet, or desktop. In addition to the latest winning
          numbers, we offer a suite of tools including number frequency analysis, a random number generator,
          draw comparisons between Lunchtime and Teatime, and educational guides on how the game works.
          Whether you are a first-time player or a seasoned enthusiast, our site has everything you need.
        </p>
      </section>

      {/* Responsible Gaming Notice */}
      <section className="mb-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold text-red-600 dark:text-red-400">18+ Only.</span>{' '}
          Gambling can be addictive. Please play responsibly. If you need support, visit{' '}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline">BeGambleAware.org</a>{' '}
          or{' '}
          <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline">GamCare</a>.{' '}
          <Link href="/responsible-gaming" className="text-emerald-600 dark:text-emerald-400 underline">Learn more about responsible gaming</Link>.
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
              {
                '@type': 'Question',
                name: 'What is the Booster ball in UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Booster ball is the 7th number drawn in each UK 49s draw. Players can choose to include it in their bet for different odds and payouts.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I check UK 49s results?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can check the latest UK 49s results on uk49sresults.co.uk. Results are updated within minutes of each Lunchtime (12:49 PM) and Teatime (5:49 PM) draw.',
                },
              },
              {
                '@type': 'Question',
                name: 'What are the odds of winning UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'UK 49s odds vary depending on how many numbers you bet on. Picking 1 number from 6 gives odds of about 7.33/1, while picking 5 numbers from 6 has odds of about 96,454/1.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I play UK 49s online?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'UK 49s is a fixed-odds betting game available through licensed bookmakers in the UK and South Africa. You can place bets online through authorised betting operators.',
                },
              },
              {
                '@type': 'Question',
                name: 'What are hot and cold numbers in UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Hot numbers are those drawn most frequently in recent UK 49s draws, while cold numbers are drawn least often. Players use this data to inform their number selections, though past results do not guarantee future outcomes.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
