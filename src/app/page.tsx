import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import UpcomingDraw from '@/components/UpcomingDraw';
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

  const today = new Date();
  const todayLabel = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          UK 49s Results Today
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Latest Lunchtime and Teatime winning numbers for {todayLabel}
        </p>
      </section>

      {/* Quick Answer Block — AEO optimized */}
      {(latestLunchtime || latestTeatime) && (
        <section className="mb-8 p-5 max-w-3xl mx-auto rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Today&apos;s Winning Numbers</p>
          <div className="space-y-1 text-base text-gray-800 dark:text-gray-200">
            {latestLunchtime && (
              <p>
                <strong>Lunchtime (12:49 PM)</strong>: {latestLunchtime.numbers.join(', ')}
                {latestLunchtime.booster !== undefined && <> · Booster: {latestLunchtime.booster}</>}
              </p>
            )}
            {latestTeatime && (
              <p>
                <strong>Teatime (5:49 PM)</strong>: {latestTeatime.numbers.join(', ')}
                {latestTeatime.booster !== undefined && <> · Booster: {latestTeatime.booster}</>}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Draw Placeholders - show ? balls before results are announced */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <UpcomingDraw drawType="lunchtime" latestDate={latestLunchtime?.date || ''} />
        <UpcomingDraw drawType="teatime" latestDate={latestTeatime?.date || ''} />
      </section>

      {/* Latest Results — shown FIRST so users see results without scrolling */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Latest UK 49s Results
        </h2>
        {!latestLunchtime && !latestTeatime ? (
          <div className="p-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Results are being fetched. Check back in a moment, or view past results in our archive.
            </p>
            <Link href="/history" className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
              Past Results Archive
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        ) : (
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
        )}
      </section>

      {/* Countdown Timers — after results */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Countdown drawType="lunchtime" />
        <Countdown drawType="teatime" />
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
            { href: '/check', title: 'Number Checker', desc: 'Did your numbers win? Scan the archive', icon: '✅' },
            { href: '/hot-cold-numbers', title: 'Hot & Cold Numbers', desc: 'See most and least drawn numbers', icon: '🔥' },
            { href: '/predictions', title: 'Predictions', desc: 'Statistical predictions for next draw', icon: '🎯' },
            { href: '/number-generator', title: 'Number Generator', desc: 'Generate random UK 49s numbers', icon: '🎲' },
            { href: '/history', title: 'Past Results', desc: 'Browse complete results history', icon: '📊' },
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
      <section className="mb-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About UK 49s Lottery</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">UK 49s</strong> is a lottery-style betting game played across the <strong className="text-gray-900 dark:text-white">United Kingdom</strong> and <strong className="text-gray-900 dark:text-white">South Africa</strong>.
                It works differently from the National Lottery or EuroMillions. You pick how many numbers to bet on, from 1 to 5, and decide whether to include the
                <strong className="text-gray-900 dark:text-white"> Booster ball</strong>. Fewer numbers means better odds but a smaller payout. More numbers means a bigger payout but harder to win. You set the terms.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">UK 49s Results Today</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We post <strong className="text-gray-900 dark:text-white">UK 49s results today</strong> for both the <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime</Link> and <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime</Link> draws within minutes of each draw.
                Lunchtime numbers go up after 12:49 PM UK time, Teatime after 5:49 PM. Bookmark this page if you want to check the winning numbers quickly. We also keep a full <Link href="/history" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">archive of past results</Link> going back several weeks.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">UK 49s Draw Times</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                There are two draws every single day, 7 days a week, including weekends and bank holidays:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Draw</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">UK Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">SA Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <strong className="text-gray-900 dark:text-white">Lunchtime</strong></span></td>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">12:49 PM</td>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">2:49 PM</td>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Daily</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-700/30">
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700"><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> <strong className="text-gray-900 dark:text-white">Teatime</strong></span></td>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">5:49 PM</td>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">7:49 PM</td>
                      <td className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">Daily</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3 text-sm">
                Draw times may shift by one hour during BST (British Summer Time) changeovers. Check
                our <Link href="/how-to-play" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">How to Play</Link> page for the most accurate schedule.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How UK 49s Works</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                In each draw, <strong className="text-gray-900 dark:text-white">6 main numbers</strong> are drawn from a pool of 1 to 49, plus a 7th number known as the
                <strong className="text-gray-900 dark:text-white"> Booster ball</strong>. Players can choose to bet on anywhere from 1 to 5 numbers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>The more numbers you pick, the higher the potential payout, but the harder it is to win</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Choose whether to include the Booster ball in your bet, which changes the odds</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Betting on 1 number from 6 gives odds of approximately <strong className="text-gray-900 dark:text-white">7.33 to 1</strong></span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Betting on 5 numbers from 6 offers odds of around <strong className="text-gray-900 dark:text-white">96,454 to 1</strong></span>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3 text-sm">
                See our <Link href="/odds" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">odds and payouts page</Link> for full details.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">UK 49s Predictions and Statistics</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A lot of people search for <strong className="text-gray-900 dark:text-white">UK49s predictions</strong> before placing their bets. To be clear: no method can guarantee a win because each draw is random.
                That said, looking at which numbers come up more often can be useful for picking your selections. Our <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot and cold numbers</Link> page shows
                the most and least drawn numbers from recent draws. There&apos;s also a <Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">random number generator</Link> if you just want a quick pick, and a <Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">predictions page</Link> with number sets based on frequency data.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Why Check Results Here?</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                We built this site because most UK 49s result pages are slow, cluttered with ads, or hard to read on a phone. Here&apos;s what we do differently:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Results go up within minutes of each draw, not hours</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Works well on phones. No zooming or horizontal scrolling needed</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Number frequency data, predictions, and a random picker all in one place</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Plain-English guides if you&apos;re new to the game</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
