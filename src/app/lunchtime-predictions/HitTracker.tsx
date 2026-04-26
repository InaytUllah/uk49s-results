import LotteryBalls from '@/components/LotteryBalls';
import type { UK49sResult } from '@/lib/types';

interface Props {
  drawType: 'lunchtime' | 'teatime';
  drawResults: UK49sResult[];
  hotNumbers: number[];
  seedOffsetStart: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generatePrediction(hot: number[], seed: number): { numbers: number[]; booster: number } {
  const random = seededRandom(seed);
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const selected: number[] = [];
  const hotPicks = hot.slice(0, 4);
  for (const num of hotPicks) {
    if (selected.length < 4) selected.push(num);
  }
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

export default function HitTracker({ drawType, drawResults, hotNumbers, seedOffsetStart }: Props) {
  const drawLabel = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const recent = drawResults.slice(0, 7);

  let totalSetsChecked = 0;
  let setsWith1Plus = 0;
  let setsWith2Plus = 0;
  let setsWith3Plus = 0;
  let totalNumbersHit = 0;
  let totalNumbersPredicted = 0;
  let boostersHit = 0;
  let boostersChecked = 0;

  const dailyBreakdown = recent.map(actual => {
    const dateSeed = parseInt(actual.date.replace(/-/g, ''), 10);
    const predictions = [
      generatePrediction(hotNumbers, dateSeed + seedOffsetStart),
      generatePrediction(hotNumbers, dateSeed + seedOffsetStart + 1),
      generatePrediction(hotNumbers, dateSeed + seedOffsetStart + 2),
    ];

    const setHits = predictions.map(pred => {
      const matched = pred.numbers.filter(n => actual.numbers.includes(n));
      const boosterHit = pred.booster === actual.booster;
      totalSetsChecked += 1;
      totalNumbersHit += matched.length;
      totalNumbersPredicted += pred.numbers.length;
      if (matched.length >= 1) setsWith1Plus += 1;
      if (matched.length >= 2) setsWith2Plus += 1;
      if (matched.length >= 3) setsWith3Plus += 1;
      boostersChecked += 1;
      if (boosterHit) boostersHit += 1;
      return { matched, boosterHit, predicted: pred };
    });

    const bestSet = setHits.reduce((best, cur) => (cur.matched.length > best.matched.length ? cur : best), setHits[0]);

    return { date: actual.date, actual, bestSet, setHits };
  });

  const accuracyAny = totalSetsChecked === 0 ? 0 : (setsWith1Plus / totalSetsChecked) * 100;
  const accuracy2Plus = totalSetsChecked === 0 ? 0 : (setsWith2Plus / totalSetsChecked) * 100;
  const accuracy3Plus = totalSetsChecked === 0 ? 0 : (setsWith3Plus / totalSetsChecked) * 100;
  const avgHitRate = totalNumbersPredicted === 0 ? 0 : (totalNumbersHit / totalNumbersPredicted) * 100;

  return (
    <section className="mb-10">
      <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Track record — how our {drawLabel.toLowerCase()} predictions did recently
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          We re-ran the same prediction model against the last {recent.length} {drawLabel} draws to see how it performed. Honest numbers, no spin.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Sets checked</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSetsChecked}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400 mb-1">≥ 1 number hit</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{accuracyAny.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{setsWith1Plus}/{totalSetsChecked} sets</p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400 mb-1">≥ 2 numbers hit</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{accuracy2Plus.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{setsWith2Plus}/{totalSetsChecked} sets</p>
          </div>
          <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-purple-700 dark:text-purple-400 mb-1">≥ 3 numbers hit</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{accuracy3Plus.toFixed(0)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{setsWith3Plus}/{totalSetsChecked} sets</p>
          </div>
        </div>

        {/* Daily breakdown */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Day-by-day breakdown</h3>
        <div className="space-y-3">
          {dailyBreakdown.map(day => (
            <div key={day.date} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <time dateTime={day.date} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </time>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Best set hit {day.bestSet.matched.length}/6 numbers{day.bestSet.boosterHit ? ' + Booster' : ''}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Actual draw</p>
                  <LotteryBalls numbers={day.actual.numbers} booster={day.actual.booster} size="sm" animated={false} />
                </div>
                {day.bestSet.matched.length > 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    ✓ Matched: {day.bestSet.matched.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Random baseline:</strong> picking 6 numbers from 49 at random gives roughly a 53% chance of hitting at least 1 of the 6 drawn numbers, and about 13% for hitting 2+. Average hit rate per number predicted: <strong>{avgHitRate.toFixed(1)}%</strong>{boostersChecked > 0 && <>, Booster matches: <strong>{boostersHit}/{boostersChecked}</strong></>}.
          </p>
        </div>
      </div>
    </section>
  );
}
