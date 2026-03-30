import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, PAGE_SEO } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `UK 49s Odds & Payouts - Winning Chances Explained | ${SITE_NAME}`,
  description: 'Complete UK 49s odds table for Pick 1 through Pick 5 bets, with and without Booster ball. Understand your winning chances and how payouts work.',
  alternates: {
    canonical: `${SITE_URL}/odds`,
  },
};

const oddsData = [
  {
    pick: 'Pick 1',
    description: 'Match 1 number',
    oddsWithout: '1 in 49',
    oddsWith: '1 in 48',
    oddsWithoutNum: 49,
    oddsWithNum: 48,
    typicalPayout: '6/1',
  },
  {
    pick: 'Pick 2',
    description: 'Match 2 numbers',
    oddsWithout: '1 in 1,176',
    oddsWith: '1 in 1,128',
    oddsWithoutNum: 1176,
    oddsWithNum: 1128,
    typicalPayout: '55/1',
  },
  {
    pick: 'Pick 3',
    description: 'Match 3 numbers',
    oddsWithout: '1 in 18,424',
    oddsWith: '1 in 17,296',
    oddsWithoutNum: 18424,
    oddsWithNum: 17296,
    typicalPayout: '600/1',
  },
  {
    pick: 'Pick 4',
    description: 'Match 4 numbers',
    oddsWithout: '1 in 211,876',
    oddsWith: '1 in 194,580',
    oddsWithoutNum: 211876,
    oddsWithNum: 194580,
    typicalPayout: '6,000/1',
  },
  {
    pick: 'Pick 5',
    description: 'Match 5 numbers',
    oddsWithout: '1 in 1,906,884',
    oddsWith: '1 in 1,712,304',
    oddsWithoutNum: 1906884,
    oddsWithNum: 1712304,
    typicalPayout: '40,000/1',
  },
];

export default function OddsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Odds & Payouts</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Odds & Payouts
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Understand your chances of winning for each bet type, with and without the Booster ball.
      </p>

      {/* Main Odds Table */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Complete Odds Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">
                  Bet Type
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">
                  Without Booster
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">
                  With Booster
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 hidden sm:table-cell">
                  Typical Payout
                </th>
              </tr>
            </thead>
            <tbody>
              {oddsData.map((row, index) => (
                <tr
                  key={row.pick}
                  className={`border-b border-gray-100 dark:border-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-850'}`}
                >
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900 dark:text-white">{row.pick}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{row.description}</div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                    {row.oddsWithout}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {row.oddsWith}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-amber-700 dark:text-amber-400 hidden sm:table-cell">
                    {row.typicalPayout}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          * Typical payout odds are approximate and vary between bookmakers. Always check with your bookmaker for exact rates.
        </p>
      </section>

      {/* Visual odds comparison */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Odds Comparison (Without vs With Booster)
        </h2>
        <div className="space-y-4">
          {oddsData.map(row => {
            const maxOdds = oddsData[oddsData.length - 1].oddsWithoutNum;
            const barWithout = Math.max((Math.log10(row.oddsWithoutNum) / Math.log10(maxOdds)) * 100, 5);
            const barWith = Math.max((Math.log10(row.oddsWithNum) / Math.log10(maxOdds)) * 100, 5);

            return (
              <div key={row.pick} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">{row.pick}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    Booster improves odds by ~{(((row.oddsWithoutNum - row.oddsWithNum) / row.oddsWithoutNum) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Without Booster</span>
                      <span className="text-gray-700 dark:text-gray-300">{row.oddsWithout}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gray-400 dark:bg-gray-500"
                        style={{ width: `${barWithout}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-600 dark:text-emerald-400">With Booster</span>
                      <span className="text-emerald-700 dark:text-emerald-300">{row.oddsWith}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-emerald-500"
                        style={{ width: `${barWith}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Odds Work */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How UK 49s Odds Work
        </h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">The Basics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              In each UK 49s draw, 6 main numbers and 1 Booster ball are randomly drawn from a pool
              of 49 numbers (1-49). The odds of matching your chosen numbers depend on how many
              numbers you pick for your bet.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Without Booster</h3>
            <p className="text-gray-600 dark:text-gray-400">
              When you bet without the Booster ball, your selected numbers are matched only against
              the 6 main drawn numbers. This gives slightly longer odds but typically higher payouts
              per matched number.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">With Booster</h3>
            <p className="text-gray-600 dark:text-gray-400">
              When you include the Booster ball, your numbers are matched against all 7 drawn numbers
              (6 main + 1 Booster). This gives you better odds of winning since there are more numbers
              to match against. However, payouts for Booster matches are typically slightly lower.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Payouts</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Unlike traditional lotteries with fixed prize pools, UK 49s payouts are determined by
              your bookmaker. Your winnings equal your stake multiplied by the odds offered. Different
              bookmakers may offer different odds, so it pays to compare before placing your bet.
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/how-to-play" className="block bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">How to Play</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete guide to getting started</p>
          </Link>
          <Link href="/predictions" className="block bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400">Today&apos;s Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Statistical predictions for upcoming draws</p>
          </Link>
          <Link href="/faq" className="block bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400">FAQ</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Frequently asked questions answered</p>
          </Link>
          <Link href="/numbers" className="block bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400">Number Statistics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Frequency data for all 49 numbers</p>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Your Chances</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">UK 49s</strong> offers a unique betting structure compared to traditional lotteries. Because
                you choose how many numbers to bet on, you have more control over the <strong className="text-gray-900 dark:text-white">risk-reward
                balance</strong>. A Pick 1 bet gives you roughly a 1 in 49 chance, while a Pick 5 bet
                has much longer odds but correspondingly higher payouts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">The Booster Ball Advantage</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <strong className="text-gray-900 dark:text-white">Booster ball</strong> option adds strategic depth to the game. By opting in, you slightly
                improve your odds at the cost of somewhat lower payouts. Whether to include the
                Booster depends on your personal preference for risk versus reward.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
                <span>Always gamble responsibly and only bet what you can afford to lose. The odds shown are <strong>mathematical probabilities</strong> and do not change based on past results.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Odds & Payouts', url: '/odds' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.odds.title, PAGE_SEO.odds.description, '/odds')) }} />
    </div>
  );
}
