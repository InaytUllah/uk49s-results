import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: `UK 49s FAQ - Frequently Asked Questions | ${SITE_NAME}`,
  description: 'Answers to frequently asked questions about UK 49s lottery. Learn about draw times, odds, how to play, Booster ball, payouts, and more.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

const faqs = [
  {
    question: 'What is UK 49s?',
    answer: 'UK 49s is a lottery-style game that takes place twice daily in the United Kingdom. Six main numbers and one Booster ball are drawn from a pool of 1 to 49. Unlike traditional lotteries, there is no fixed ticket price or jackpot. Instead, players choose how many numbers to bet on (1 to 5) and how much to stake, with payouts based on the odds of their chosen bet type.',
  },
  {
    question: 'When are the UK 49s draws?',
    answer: 'There are two draws every day, seven days a week. The Lunchtime draw takes place at 12:49 PM UK time (GMT/BST), and the Teatime draw takes place at 5:49 PM UK time. Results are usually available within minutes of each draw.',
  },
  {
    question: 'How do I play UK 49s?',
    answer: 'To play UK 49s, you place a bet with a licensed bookmaker rather than buying a traditional lottery ticket. You choose between 1 and 5 numbers from the range 1-49, decide your stake amount, and choose whether to include the Booster ball in your bet. If your chosen numbers match the drawn numbers, you win based on the odds for your bet type.',
  },
  {
    question: 'What are the odds of winning UK 49s?',
    answer: 'The odds depend on how many numbers you pick. For a Pick 1 bet, the odds are 1 in 49 (without Booster) or 1 in 48 (with Booster). Pick 2 odds are 1 in 1,176 or 1 in 1,128 with Booster. Pick 5 odds are 1 in 1,906,884 or 1 in 1,712,304 with Booster. The fewer numbers you pick, the better your chances of winning, but the lower the payout.',
  },
  {
    question: 'How does the Booster ball work?',
    answer: 'The Booster ball (also called the bonus ball) is the 7th number drawn in each UK 49s draw. When you place a bet, you can choose to include the Booster ball. If you opt in, your selected numbers can match against 7 drawn numbers instead of 6, which improves your odds of winning slightly. However, the payout for a Booster ball match is typically lower than a main number match.',
  },
  {
    question: 'Can I play UK 49s from South Africa?',
    answer: 'Yes, UK 49s is extremely popular in South Africa. South African players can place bets through licensed bookmakers that operate in the country, including many online betting platforms. The game is widely covered by South African betting shops and has a large following there.',
  },
  {
    question: 'Can I play UK 49s from outside the UK?',
    answer: 'Yes, UK 49s can be played from many countries around the world through licensed online bookmakers. The game is particularly popular in South Africa, Ireland, and other countries. You need to find a licensed bookmaker that operates in your jurisdiction and accepts UK 49s bets.',
  },
  {
    question: 'How are the predictions on this site calculated?',
    answer: 'Our predictions are generated using statistical analysis of recent draw results. We analyze number frequency patterns, identify hot numbers (frequently drawn) and cold numbers (rarely drawn), and use weighted probability models to generate prediction sets. However, each lottery draw is an independent random event, and no prediction method can guarantee results.',
  },
  {
    question: 'What are hot and cold numbers?',
    answer: 'Hot numbers are those that have appeared more frequently than average in recent draws, suggesting they are on a streak. Cold numbers are those drawn less frequently than average, meaning they are overdue. Some players prefer to bet on hot numbers following the trend, while others choose cold numbers expecting them to appear soon. Neither strategy is statistically proven to improve winning chances.',
  },
  {
    question: 'Are the results on this site guaranteed accurate?',
    answer: 'We source our results directly from official UK 49s data and update them as quickly as possible after each draw. While we strive for 100% accuracy, we always recommend verifying results with your bookmaker or the official UK 49s website before claiming any winnings. Our site is for informational purposes.',
  },
  {
    question: 'How quickly are results updated after a draw?',
    answer: 'Results are typically updated within minutes of each draw taking place. Our system automatically fetches the latest results from official sources. The Lunchtime draw results are available shortly after 12:49 PM UK time, and Teatime results shortly after 5:49 PM UK time.',
  },
  {
    question: 'What is the number generator?',
    answer: 'Our random number generator is a free tool that creates random UK 49s number combinations for you to use. It picks 6 random numbers from 1-49 plus a Booster ball. You can use Quick Pick for completely random selections or Smart Pick which factors in recent hot number trends. The generated numbers are meant as suggestions for entertainment purposes.',
  },
  {
    question: 'Where can I place UK 49s bets?',
    answer: 'UK 49s bets can be placed at licensed bookmakers both online and in betting shops. Popular options include major high street bookmakers in the UK and licensed online platforms internationally. Always ensure you are using a licensed and regulated operator in your jurisdiction. We do not accept bets on this website.',
  },
  {
    question: 'What are the UK 49s prize payouts?',
    answer: 'UK 49s does not have fixed prizes like traditional lotteries. Instead, payouts are based on your stake amount multiplied by the odds for your bet type. For example, a Pick 1 match might pay around 6/1, while a Pick 5 match could pay significantly higher odds. Exact payout rates vary between bookmakers, so it is worth comparing odds before placing your bet.',
  },
  {
    question: 'Is UK 49s legal?',
    answer: 'Yes, UK 49s is a legal and regulated game. The draws are conducted by a licensed operator in the United Kingdom. Betting on UK 49s results is legal in jurisdictions where sports and numbers betting is permitted. Always make sure you place bets with licensed and regulated bookmakers in your country.',
  },
  {
    question: 'What is the difference between Lunchtime and Teatime draws?',
    answer: 'The Lunchtime and Teatime draws are two separate, independent draws that occur each day. The Lunchtime draw is at 12:49 PM UK time and the Teatime draw is at 5:49 PM UK time. Both use the same format (6 numbers plus 1 Booster from 1-49), but the results are completely independent of each other. You can bet on either or both draws.',
  },
];

export default function FAQPage() {
  // Schema.org FAQPage markup
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">FAQ</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Frequently Asked Questions
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Everything you need to know about the UK 49s lottery, draw times, odds, and how to play.
      </p>

      {/* FAQ Accordion */}
      <div className="space-y-3 mb-10">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 list-none">
              <span className="pr-4">{faq.question}</span>
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Learn More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/how-to-play" className="block bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">How to Play UK 49s</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete guide to playing the game</p>
          </Link>
          <Link href="/odds" className="block bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400">Odds & Payouts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Detailed odds table and payout info</p>
          </Link>
          <Link href="/predictions" className="block bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400">Today&apos;s Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Statistical predictions for upcoming draws</p>
          </Link>
          <Link href="/hot-cold-numbers" className="block bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-red-700 dark:text-red-400">Hot & Cold Numbers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Most and least frequently drawn numbers</p>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose dark:prose-invert max-w-none">
        <h2>About UK 49s Lottery</h2>
        <p>
          UK 49s is one of the most popular lottery-style betting games, with draws happening
          twice daily at lunchtime and teatime. Unlike traditional national lotteries, UK 49s
          gives players the flexibility to choose how many numbers to play and how much to
          stake, making it accessible and customizable for different playing styles.
        </p>
        <p>
          If you have a question that is not answered above, feel free to explore our other
          guides or <Link href="/how-to-play">read our complete how-to-play guide</Link> for
          more detailed information.
        </p>
      </section>
    </div>
  );
}
