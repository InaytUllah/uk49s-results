'use client';

import { useState, useMemo } from 'react';

interface OddsRow {
  pick: number;
  oddsWithoutNum: number;
  oddsWithNum: number;
  payoutWithout: number; // multiplier (e.g. 6 means 6:1)
  payoutWith: number;
}

const ODDS: OddsRow[] = [
  { pick: 1, oddsWithoutNum: 49, oddsWithNum: 48, payoutWithout: 6, payoutWith: 5 },
  { pick: 2, oddsWithoutNum: 1176, oddsWithNum: 1128, payoutWithout: 55, payoutWith: 50 },
  { pick: 3, oddsWithoutNum: 18424, oddsWithNum: 17296, payoutWithout: 600, payoutWith: 500 },
  { pick: 4, oddsWithoutNum: 211876, oddsWithNum: 194580, payoutWithout: 6000, payoutWith: 5000 },
  { pick: 5, oddsWithoutNum: 1906884, oddsWithNum: 1712304, payoutWithout: 40000, payoutWith: 30000 },
];

export default function PayoutCalculator() {
  const [pick, setPick] = useState<number>(3);
  const [withBooster, setWithBooster] = useState(false);
  const [stake, setStake] = useState<number>(1);
  const [currency, setCurrency] = useState<'£' | 'R' | '€' | '$'>('£');

  const row = ODDS.find(r => r.pick === pick) ?? ODDS[2];

  const result = useMemo(() => {
    const odds = withBooster ? row.oddsWithNum : row.oddsWithoutNum;
    const payoutMultiplier = withBooster ? row.payoutWith : row.payoutWithout;
    const winAmount = stake * payoutMultiplier;
    const profit = winAmount - stake;
    const probability = (1 / odds) * 100;
    return { odds, payoutMultiplier, winAmount, profit, probability };
  }, [row, withBooster, stake]);

  const fmt = (n: number) => {
    if (n >= 1000) return n.toLocaleString('en-GB', { maximumFractionDigits: 0 });
    return n.toFixed(2);
  };

  return (
    <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payout Calculator</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        See what you&apos;d win for any UK 49s bet type and stake.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Pick selector */}
        <div>
          <label htmlFor="pick" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            How many numbers?
          </label>
          <select
            id="pick"
            value={pick}
            onChange={e => setPick(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
          >
            {ODDS.map(r => (
              <option key={r.pick} value={r.pick}>Pick {r.pick} ({r.pick} number{r.pick > 1 ? 's' : ''})</option>
            ))}
          </select>
        </div>

        {/* Stake */}
        <div>
          <label htmlFor="stake" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Stake
          </label>
          <div className="flex">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as '£' | 'R' | '€' | '$')}
              className="px-3 py-2 rounded-l-lg border-2 border-r-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
              aria-label="Currency"
            >
              <option value="£">£</option>
              <option value="R">R</option>
              <option value="€">€</option>
              <option value="$">$</option>
            </select>
            <input
              id="stake"
              type="number"
              min="1"
              step="1"
              value={stake}
              onChange={e => setStake(Math.max(1, Number(e.target.value) || 1))}
              className="w-full px-3 py-2 rounded-r-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Booster toggle */}
        <div>
          <label htmlFor="booster" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Booster ball?
          </label>
          <div className="inline-flex w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setWithBooster(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${!withBooster ? 'bg-emerald-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Without
            </button>
            <button
              type="button"
              onClick={() => setWithBooster(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${withBooster ? 'bg-emerald-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              With
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Odds</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">1 in {result.odds.toLocaleString('en-GB')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Payout</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{result.payoutMultiplier.toLocaleString('en-GB')}/1</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">If you win</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{currency}{fmt(result.winAmount)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Profit</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{currency}{fmt(result.profit)}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Probability of winning this bet: <strong>{result.probability.toFixed(4)}%</strong>. Payouts are typical bookmaker rates and may vary. Booster bets pay slightly less but win more often. Gamble responsibly.
      </p>
    </div>
  );
}
