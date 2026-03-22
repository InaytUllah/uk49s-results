import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDate, getPredictionDateForLunchtime } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.predictions.title,
  description: PAGE_SEO.predictions.description,
};

export const revalidate = 60;

// Use date-based seed for consistent predictions (don't change on every page load)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generatePrediction(hot: number[], cold: number[], seed: number): { numbers: number[]; booster: number } {
  const random = seededRandom(seed);
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const selected: number[] = [];

  // Pick 3-4 from hot numbers
  const hotPicks = hot.slice(0, 4);
  for (const num of hotPicks) {
    if (selected.length < 4) selected.push(num);
  }

  // Fill remaining with randoms (avoiding already selected)
  const remaining = pool.filter(n => !selected.includes(n));
  while (selected.length < 6) {
    const idx = Math.floor(random() * remaining.length);
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  selected.sort((a, b) => a - b);
  const booster = remaining[Math.floor(random() * remaining.length)];

  return { numbers: selected, booster };
}

export default async function PredictionsPage() {
  const allResults = await getLatestResults();
  const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');

  const hotLunch = getHotNumbers(lunchtimeResults, 10);
  const coldLunch = getColdNumbers(lunchtimeResults, 10);
  const hotTea = getHotNumbers(teatimeResults, 10);
  const coldTea = getColdNumbers(teatimeResults, 10);

  // Smart date: shows tomorrow if today's results are already announced
  const predInfo = getPredictionDate(allResults);
  const lunchInfo = getPredictionDateForLunchtime(allResults);

  // Use date as seed so predictions stay consistent for the same day
  const dateSeed = parseInt(predInfo.date.replace(/-/g, ''), 10);
  const lunchDateSeed = parseInt(lunchInfo.date.replace(/-/g, ''), 10);

  const lunchPredictions = [
    generatePrediction(hotLunch, coldLunch, lunchDateSeed + 1),
    generatePrediction(hotLunch, coldLunch, lunchDateSeed + 2),
    generatePrediction(hotLunch, coldLunch, lunchDateSeed + 3),
  ];

  const teaPredictions = [
    generatePrediction(hotTea, coldTea, dateSeed + 4),
    generatePrediction(hotTea, coldTea, dateSeed + 5),
    generatePrediction(hotTea, coldTea, dateSeed + 6),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Predictions Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Statistical predictions updated after every draw
      </p>
      <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 mb-8">
        Disclaimer: These predictions are based on statistical analysis of past results. Lottery draws are random and no prediction can guarantee a win.
      </p>

      {/* Lunchtime Predictions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-1">
          Lunchtime Predictions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          For {lunchInfo.formatted} — Draw at 12:49 PM UK
        </p>
        <div className="space-y-4">
          {lunchPredictions.map((pred, i) => (
            <div key={i} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3">
                Prediction Set {i + 1}
              </p>
              <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
            </div>
          ))}
        </div>
      </section>

      {/* Teatime Predictions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1">
          Teatime Predictions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          For {predInfo.formatted} — Draw at 5:49 PM UK
        </p>
        <div className="space-y-4">
          {teaPredictions.map((pred, i) => (
            <div key={i} className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
                Prediction Set {i + 1}
              </p>
              <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
            </div>
          ))}
        </div>
      </section>

      {/* Hot Numbers Used */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Based on These Hot Numbers</h2>
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

      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Our UK 49s Predictions Work</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our predictions are generated using <strong className="text-gray-900 dark:text-white">statistical analysis</strong> of recent UK 49s draw results.
                We analyze number frequency patterns, <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot and cold numbers</Link>, and overdue numbers to
                produce prediction sets for both <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Lunchtime</span></span> and <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Teatime</span></span> draws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Auto-Updated Predictions</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Predictions refresh automatically after each draw is announced</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Once lunchtime results are in, lunchtime predictions switch to the next day</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Same automatic rollover happens for teatime predictions</span>
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
    </div>
  );
}
