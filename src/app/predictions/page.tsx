import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDate, getPredictionDateForLunchtime } from '@/lib/data/draws';
import { generatePrediction } from '@/lib/data/predictions';
import { PAGE_SEO, SITE_URL } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: PAGE_SEO.predictions.title,
  description: PAGE_SEO.predictions.description,
  alternates: { canonical: '/predictions' },
  openGraph: {
    title: 'UK 49s Predictions Today — Lunchtime & Teatime',
    description: 'Statistical predictions for both UK 49s draws. View Lunchtime and Teatime prediction sets.',
    type: 'website',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('UK 49s Predictions Today')}&subtitle=${encodeURIComponent('Lunchtime & Teatime Statistical Analysis')}&type=prediction`,
      width: 1200, height: 630,
    }],
  },
};

export const revalidate = 60;

export default async function PredictionsPage() {
  const allResults = await getLatestResults();
  const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');

  const hotLunch = getHotNumbers(lunchtimeResults, 10);
  const coldLunch = getColdNumbers(lunchtimeResults, 10);
  const hotTea = getHotNumbers(teatimeResults, 10);
  const coldTea = getColdNumbers(teatimeResults, 10);

  const predInfo = getPredictionDate(allResults);
  const lunchInfo = getPredictionDateForLunchtime(allResults);

  const lunchDateSeed = parseInt(lunchInfo.date.replace(/-/g, ''), 10);
  const teaDateSeed = parseInt(predInfo.date.replace(/-/g, ''), 10);

  // Hub page shows ONE preview per draw — the "Hot Streak" set (boldest play).
  const lunchPreview = generatePrediction(hotLunch, coldLunch, lunchDateSeed + 1, 'hot-streak');
  const teaPreview = generatePrediction(hotTea, coldTea, teaDateSeed + 4, 'hot-streak');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Predictions Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Statistical predictions for both Lunchtime and Teatime draws, updated after every result
      </p>

      {/* Lunchtime Preview + Link to Full Page */}
      <section className="mb-8">
        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                Lunchtime Predictions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                For {lunchInfo.formatted} — Draw at 12:49 PM UK
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              12:49 PM
            </span>
          </div>

          <div className="mb-4">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-2">Preview — Prediction Set 1</p>
            <LotteryBalls numbers={lunchPreview.numbers} booster={lunchPreview.booster} size="md" animated={false} />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              3 prediction sets + hot/cold analysis + trending numbers
            </p>
            <Link
              href="/lunchtime-predictions"
              className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm whitespace-nowrap"
            >
              View All Lunchtime Predictions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Teatime Preview + Link to Full Page */}
      <section className="mb-10">
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                Teatime Predictions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                For {predInfo.formatted} — Draw at 5:49 PM UK
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              5:49 PM
            </span>
          </div>

          <div className="mb-4">
            <p className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold mb-2">Preview — Prediction Set 1</p>
            <LotteryBalls numbers={teaPreview.numbers} booster={teaPreview.booster} size="md" animated={false} />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              3 prediction sets + hot/cold analysis + trending numbers
            </p>
            <Link
              href="/teatime-predictions"
              className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm whitespace-nowrap"
            >
              View All Teatime Predictions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Numbers Quick View */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Hot Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Lunchtime Hot</p>
            <LotteryBalls numbers={hotLunch.slice(0, 7)} size="sm" animated={false} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Teatime Hot</p>
            <LotteryBalls numbers={hotTea.slice(0, 7)} size="sm" animated={false} />
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Our UK 49s Predictions</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We provide separate prediction pages for each UK 49s draw because <strong className="text-gray-900 dark:text-white">Lunchtime and Teatime are independent events</strong> with different frequency patterns. A number that is hot in the 12:49 PM draw may not be hot in the 5:49 PM draw.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Choose Your Draw</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/lunchtime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime Predictions</Link> — for the 12:49 PM draw, using Lunchtime-only frequency data</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/teatime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime Predictions</Link> — for the 5:49 PM draw, using Teatime-only frequency data</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How Predictions Auto-Update</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Lunchtime predictions switch to next day once 12:49 PM results are in</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Teatime predictions switch to next day once 5:49 PM results are in</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Hot/cold numbers recalculate with every new draw added</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
                <span>The <strong>UK 49s lottery</strong> is a game of chance. No prediction system can guarantee winning numbers. Always play responsibly and within your means.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Predictions', url: '/predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.predictions.title, PAGE_SEO.predictions.description, '/predictions')) }} />
    </div>
  );
}
