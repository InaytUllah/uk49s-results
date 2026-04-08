import { Metadata } from 'next';
import { PAGE_SEO, ogMeta } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.howToPlay.title,
  description: PAGE_SEO.howToPlay.description,
  alternates: { canonical: '/how-to-play' },
  ...ogMeta(PAGE_SEO.howToPlay.title, PAGE_SEO.howToPlay.description, '/how-to-play'),
};

export default function HowToPlayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        How to Play UK 49s
      </h1>

      <div className="space-y-8">
        {/* What is UK 49s */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is UK 49s?</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong className="text-gray-900 dark:text-white">UK 49s</strong> is a popular lottery-style game based in the <strong className="text-gray-900 dark:text-white">United Kingdom</strong>. Unlike traditional
            lotteries, UK 49s offers two daily draws and gives players the flexibility to choose
            how many numbers they want to bet on, from 1 to 5.
          </p>
        </div>

        {/* Draw Times */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Draw Times</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">12:49 PM</p>
              <p className="text-amber-600 dark:text-amber-500 font-medium mt-1">Lunchtime Draw</p>
              <p className="text-sm text-gray-500 mt-1">UK Time (GMT/BST)</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">5:49 PM</p>
              <p className="text-indigo-600 dark:text-indigo-500 font-medium mt-1">Teatime Draw</p>
              <p className="text-sm text-gray-500 mt-1">UK Time (GMT/BST)</p>
            </div>
          </div>
        </div>

        {/* How the Draw Works */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How the Draw Works</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span><strong className="text-gray-900 dark:text-white">6 main numbers</strong> are drawn from a pool of 1 to 49</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>A 7th ball (the <strong className="text-gray-900 dark:text-white">Booster</strong>) is then drawn</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
              <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>Players can choose to <strong className="text-gray-900 dark:text-white">include or exclude</strong> the Booster in their bet</span>
            </li>
          </ul>
        </div>

        {/* Betting Options */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Betting Options</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            One of the unique features of <strong className="text-gray-900 dark:text-white">UK 49s</strong> is the flexibility in betting. You can choose
            to bet on 1 to 5 numbers:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Bet Type</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Numbers</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Odds (6 balls)</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Odds (7 balls + Booster)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white">Pick 1</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 8.2</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 7</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/30">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white">Pick 2</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">2</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 79</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 58</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white">Pick 3</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">3</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 952</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 588</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-700/30">
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white">Pick 4</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">4</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 14,724</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 7,669</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white">Pick 5</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">5</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 321,474</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-400">1 in 138,204</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Booster Ball */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Booster Ball</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            The <strong className="text-gray-900 dark:text-white">Booster ball</strong> is the 7th number drawn. When you include the Booster in your bet,
            your odds of winning improve because there are <strong className="text-gray-900 dark:text-white">7 numbers</strong> that could match instead of 6.
            However, the payout is slightly lower when including the Booster.
          </p>
        </div>

        {/* Tips */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips for Playing UK 49s</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span><strong className="text-gray-900 dark:text-white">Set a budget</strong> and stick to it — never bet more than you can afford to lose</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Consider mixing <strong className="text-gray-900 dark:text-white">hot and cold numbers</strong> in your selection</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>The <strong className="text-gray-900 dark:text-white">Booster option</strong> gives better odds of winning with slightly lower payouts</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Check our daily predictions and hot/cold number analysis for insights</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
              <span>Each draw is <strong className="text-gray-900 dark:text-white">independent</strong> — past results don&apos;t affect future draws</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'UK 49s is a popular lottery game based in the United Kingdom with two daily draws at 12:49 PM (Lunchtime) and 5:49 PM (Teatime).',
                },
              },
              {
                '@type': 'Question',
                name: 'How many numbers do I pick in UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can choose to bet on 1 to 5 numbers from a pool of 1 to 49. The more numbers you pick, the higher the potential payout.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the Booster ball in UK 49s?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Booster ball is the 7th number drawn. Including it in your bet improves your odds of winning but gives a slightly lower payout.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
