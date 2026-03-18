import { Metadata } from 'next';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.howToPlay.title,
  description: PAGE_SEO.howToPlay.description,
};

export default function HowToPlayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        How to Play UK 49s
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <h2>What is UK 49s?</h2>
        <p>
          UK 49s is a popular lottery-style game based in the United Kingdom. Unlike traditional
          lotteries, UK 49s offers two daily draws and gives players the flexibility to choose
          how many numbers they want to bet on, from 1 to 5.
        </p>

        <h2>Draw Times</h2>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
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

        <h2>How the Draw Works</h2>
        <ol>
          <li>6 main numbers are drawn from a pool of 1 to 49</li>
          <li>A 7th ball (the Booster) is then drawn</li>
          <li>Players can choose to include or exclude the Booster in their bet</li>
        </ol>

        <h2>Betting Options</h2>
        <p>
          One of the unique features of UK 49s is the flexibility in betting. You can choose
          to bet on 1 to 5 numbers:
        </p>

        <div className="not-prose overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left">Bet Type</th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left">Numbers Picked</th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left">Odds (6 balls)</th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left">Odds (7 balls with Booster)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Pick 1</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 8.2</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 7</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Pick 2</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">2</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 79</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 58</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Pick 3</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">3</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 952</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 588</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Pick 4</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">4</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 14,724</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 7,669</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">Pick 5</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">5</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 321,474</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">1 in 138,204</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>The Booster Ball</h2>
        <p>
          The Booster ball is the 7th number drawn. When you include the Booster in your bet,
          your odds of winning improve because there are 7 numbers that could match instead of 6.
          However, the payout is slightly lower when including the Booster.
        </p>

        <h2>Tips for Playing UK 49s</h2>
        <ul>
          <li>Set a budget and stick to it — never bet more than you can afford to lose</li>
          <li>Consider mixing hot and cold numbers in your selection</li>
          <li>The Booster option gives better odds of winning with slightly lower payouts</li>
          <li>Check our daily predictions and hot/cold number analysis for insights</li>
          <li>Remember that each draw is independent — past results don&apos;t affect future draws</li>
        </ul>
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
