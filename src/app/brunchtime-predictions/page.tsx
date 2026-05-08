import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDateForDraw, calculateFrequency } from '@/lib/data/draws';
import { generateDailyPredictions, STRATEGY_META } from '@/lib/data/predictions';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { DRAW_META } from '@/lib/types';
import HitTracker from '../lunchtime-predictions/HitTracker';

export const metadata: Metadata = {
  title: `UK 49s Brunchtime Predictions for Today — Hot Numbers & Analysis | ${SITE_NAME}`,
  description: 'UK Brunchtime prediction for today\'s 10:49 AM draw. Get 3 statistically weighted prediction sets based on hot & cold number trends and frequency analysis.',
  alternates: { canonical: '/brunchtime-predictions' },
  openGraph: {
    title: 'UK 49s Brunchtime Predictions Today',
    description: 'Statistical predictions for today\'s UK 49s Brunchtime draw at 10:49 AM.',
    type: 'article',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('Brunchtime Predictions Today')}&subtitle=${encodeURIComponent('10:49 AM Draw — Statistical Analysis')}&type=prediction`,
      width: 1200, height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK 49s Brunchtime Predictions Today',
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent('Brunchtime Predictions Today')}&subtitle=${encodeURIComponent('10:49 AM Draw — Statistical Analysis')}&type=prediction`],
  },
};

export const revalidate = 60;

export default async function BrunchtimePredictionsPage() {
  const allResults = await getLatestResults();
  const brunchResults = allResults.filter(r => r.drawType === 'brunchtime');
  const hot = getHotNumbers(brunchResults, 10);
  const cold = getColdNumbers(brunchResults, 10);
  const freq = calculateFrequency(brunchResults);
  const info = getPredictionDateForDraw('brunchtime', allResults);
  const seedOffset = DRAW_META.brunchtime.predictionSeedOffset;

  const predictions = generateDailyPredictions(hot, cold, info.date, seedOffset);

  const topTrending = hot.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link href="/predictions" className="hover:text-emerald-600">Predictions</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Brunchtime</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Brunchtime Predictions Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Statistical predictions for the {info.formatted} draw at 10:49 AM UK time
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Analysis Team</Link></span>
        <span>&middot;</span>
        <span>Based on {brunchResults.length} Brunchtime draws</span>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400 mb-4">
          Brunchtime Prediction Sets — {info.formatted}
        </h2>
        <div className="space-y-4">
          {predictions.map((pred, i) => {
            const meta = STRATEGY_META[pred.strategy];
            return (
              <div key={i} className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                      Set {i + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 inline-flex items-center gap-1">
                      <span aria-hidden="true">{meta.emoji}</span>
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">{meta.tagline}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 sm:hidden">{meta.tagline}</p>
                <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
              </div>
            );
          })}
        </div>
      </section>

      <HitTracker
        drawType="brunchtime"
        drawResults={brunchResults}
        hotNumbers={hot}
        coldNumbers={cold}
        seedOffsetStart={seedOffset}
      />

      <section className="mb-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Brunchtime Trending Numbers</h2>
          <div className="space-y-3">
            {topTrending.map(num => {
              const count = freq.get(num) || 0;
              const pct = brunchResults.length > 0 ? ((count / brunchResults.length) * 100).toFixed(1) : '0';
              return (
                <div key={num} className="flex items-center gap-3">
                  <LotteryBalls numbers={[num]} size="sm" animated={false} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Drawn {count} times</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div className="h-2 rounded-full bg-orange-500" style={{ width: `${Math.min(parseFloat(pct) * 3, 100)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Brunchtime Hot & Cold Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Hot (Most Drawn)</p>
            <LotteryBalls numbers={hot.slice(0, 7)} size="sm" animated={false} />
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Cold (Least Drawn)</p>
            <LotteryBalls numbers={cold.slice(0, 7)} size="sm" animated={false} />
          </div>
        </div>
      </section>

      {(() => {
        const pastDates = [...new Set(brunchResults.map(r => r.date))]
          .sort((a, b) => b.localeCompare(a))
          .filter(d => d !== info.date)
          .slice(0, 5);
        if (pastDates.length === 0) return null;
        return (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Past Brunchtime Predictions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              See how earlier predictions stacked up against the actual draws.
            </p>
            <ul className="space-y-2">
              {pastDates.map(date => {
                const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                });
                return (
                  <li key={date}>
                    <Link
                      href={`/blog/uk-49s-brunchtime-predictions-${date}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">UK 49s Brunchtime Predictions for {formatted}</span>
                      <svg aria-hidden="true" className="w-4 h-4 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })()}

      <section className="mb-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How these predictions work</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                These <strong className="text-gray-900 dark:text-white">UK 49s Brunchtime predictions</strong> look at which numbers have been coming up most in the <strong className="text-gray-900 dark:text-white">10:49 AM Brunchtime draw</strong> specifically. We don&apos;t mix in <Link href="/lunchtime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime</Link>, <Link href="/drivetime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Drivetime</Link>, or <Link href="/teatime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime data</Link> because all four draws are separate events.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the Brunchtime draw</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The Brunchtime draw happens every day at <strong className="text-gray-900 dark:text-white">10:49 AM UK time</strong>, weekends and bank holidays included. Six numbers are drawn from 1 to 49, plus a Booster ball. See our <Link href="/how-to-play" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">How to Play</Link> guide or <Link href="/odds" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Odds &amp; Payouts</Link> page for more on betting options.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Link href="/lunchtime-predictions" className="px-2 sm:px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-center text-xs sm:text-sm leading-tight">
          Lunchtime Predictions
        </Link>
        <Link href="/brunchtime" className="px-2 sm:px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-center text-xs sm:text-sm leading-tight">
          Brunchtime Results
        </Link>
        <Link href="/hot-cold-numbers" className="px-2 sm:px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-center text-xs sm:text-sm leading-tight">
          Hot & Cold Numbers
        </Link>
        <Link href="/number-generator" className="px-2 sm:px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-center text-xs sm:text-sm leading-tight">
          Number Generator
        </Link>
      </div>

      <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 mt-6">
        Disclaimer: Predictions are based on statistical analysis of past results. Lottery draws are random — no prediction guarantees a win. Play responsibly.
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Predictions', url: '/predictions' }, { name: 'Brunchtime Predictions', url: '/brunchtime-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What are the UK 49s Brunchtime predictions for today?', acceptedAnswer: { '@type': 'Answer', text: `Our statistical predictions for the ${info.formatted} Brunchtime draw use weighted analysis of hot numbers from recent draws. We provide 3 unique prediction sets combining frequently drawn numbers with random selections.` } },
          { '@type': 'Question', name: 'How are UK 49s Brunchtime predictions calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Predictions are generated by analysing number frequency patterns in recent Brunchtime draws. The selections combine hot numbers with random picks for balanced coverage. Each draw is independent so Brunchtime data is used separately from the other three daily draws.' } },
          { '@type': 'Question', name: 'When do Brunchtime predictions update?', acceptedAnswer: { '@type': 'Answer', text: 'Brunchtime predictions automatically update to the next day once the 10:49 AM draw results are announced. This ensures predictions always target the upcoming draw.' } },
        ],
      }) }} />
    </div>
  );
}
