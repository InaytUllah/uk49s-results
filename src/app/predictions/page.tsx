import { Metadata } from 'next';
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

      <section className="prose dark:prose-invert max-w-none">
        <h2>How Our UK 49s Predictions Work</h2>
        <p>
          Our predictions are generated using statistical analysis of recent UK 49s draw results.
          We analyze number frequency patterns, hot and cold numbers, and overdue numbers to
          produce prediction sets for both Lunchtime and Teatime draws.
        </p>
        <p>
          Predictions are automatically updated after each draw is announced — once lunchtime
          results are in, lunchtime predictions switch to the next day. Same for teatime.
        </p>
        <p>
          Remember: The UK 49s lottery is a game of chance. No prediction system can guarantee
          winning numbers. Always play responsibly and within your means.
        </p>
      </section>
    </div>
  );
}
