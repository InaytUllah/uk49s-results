'use client';

import { useState } from 'react';
import LotteryBalls from '@/components/LotteryBalls';

export default function NumberGeneratorPage() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [booster, setBooster] = useState<number>(0);
  const [count, setCount] = useState(6);
  const [includeBooster, setIncludeBooster] = useState(true);
  const [history, setHistory] = useState<{ numbers: number[]; booster: number }[]>([]);

  function generateNumbers() {
    const pool = Array.from({ length: 49 }, (_, i) => i + 1);
    const selected: number[] = [];

    for (let i = 0; i < count; i++) {
      const randIndex = Math.floor(Math.random() * pool.length);
      selected.push(pool[randIndex]);
      pool.splice(randIndex, 1);
    }

    selected.sort((a, b) => a - b);

    let boost = 0;
    if (includeBooster) {
      const randIndex = Math.floor(Math.random() * pool.length);
      boost = pool[randIndex];
    }

    setNumbers(selected);
    setBooster(boost);
    setHistory(prev => [{ numbers: selected, booster: boost }, ...prev].slice(0, 10));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Number Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate random numbers for your next UK 49s Lunchtime or Teatime bet
      </p>

      {/* Generator Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              How many numbers?
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>Pick {n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBooster}
                onChange={(e) => setIncludeBooster(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Booster Ball</span>
            </label>
          </div>
        </div>

        <button
          onClick={generateNumbers}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
        >
          Generate Numbers
        </button>

        {numbers.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your numbers:</p>
            <LotteryBalls
              numbers={numbers}
              booster={includeBooster ? booster : undefined}
              size="lg"
            />
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generated History</h2>
          <div className="space-y-3">
            {history.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <LotteryBalls
                  numbers={item.numbers}
                  booster={includeBooster ? item.booster : undefined}
                  size="sm"
                  animated={false}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="prose dark:prose-invert max-w-none">
        <h2>How to Use the UK 49s Number Generator</h2>
        <p>
          This tool generates random numbers for your UK 49s bets. Select how many numbers
          you want to pick (1-6) and whether to include a Booster ball. The numbers are
          generated completely at random from the pool of 1 to 49.
        </p>
        <h3>UK 49s Betting Options</h3>
        <ul>
          <li><strong>Pick 1:</strong> Choose 1 number — highest odds of winning</li>
          <li><strong>Pick 2:</strong> Choose 2 numbers</li>
          <li><strong>Pick 3:</strong> Choose 3 numbers</li>
          <li><strong>Pick 4:</strong> Choose 4 numbers</li>
          <li><strong>Pick 5:</strong> Choose 5 numbers</li>
          <li><strong>Pick 6:</strong> Choose 6 numbers — highest potential payout</li>
        </ul>
      </section>
    </div>
  );
}
