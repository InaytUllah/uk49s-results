'use client';

import { useState, useMemo } from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import type { UK49sResult } from '@/lib/types';

interface Match {
  result: UK49sResult;
  matched: number[];
  matchedBooster: boolean;
}

interface Props {
  results: UK49sResult[];
}

export default function NumberCheckerForm({ results }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [includeBooster, setIncludeBooster] = useState(false);
  const [boosterPick, setBoosterPick] = useState<number | null>(null);
  const [drawType, setDrawType] = useState<'all' | 'lunchtime' | 'teatime'>('all');
  const [submitted, setSubmitted] = useState(false);

  const toggleNumber = (n: number) => {
    if (selected.includes(n)) {
      setSelected(selected.filter(x => x !== n));
    } else if (selected.length < 5) {
      setSelected([...selected, n].sort((a, b) => a - b));
    }
  };

  const reset = () => {
    setSelected([]);
    setBoosterPick(null);
    setIncludeBooster(false);
    setSubmitted(false);
  };

  const matches: Match[] = useMemo(() => {
    if (!submitted || selected.length === 0) return [];
    const filtered = drawType === 'all' ? results : results.filter(r => r.drawType === drawType);
    return filtered
      .map(r => {
        const matched = selected.filter(n => r.numbers.includes(n));
        const matchedBooster = boosterPick !== null && includeBooster && r.booster === boosterPick;
        return { result: r, matched, matchedBooster };
      })
      .filter(m => m.matched.length === selected.length || (m.matched.length > 0 && selected.length <= 2))
      .sort((a, b) => b.result.date.localeCompare(a.result.date));
  }, [submitted, selected, includeBooster, boosterPick, drawType, results]);

  const fullMatches = matches.filter(m => m.matched.length === selected.length);
  const totalDrawsChecked = drawType === 'all' ? results.length : results.filter(r => r.drawType === drawType).length;

  return (
    <div>
      {/* Step 1: Pick numbers */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Step 1 — Pick 1 to 5 numbers
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Tap your bet numbers below ({selected.length}/5 selected)
        </p>
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {Array.from({ length: 49 }, (_, i) => i + 1).map(n => {
            const active = selected.includes(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleNumber(n)}
                disabled={!active && selected.length >= 5}
                className={`aspect-square rounded-full font-bold text-xs sm:text-sm md:text-base flex items-center justify-center transition-all ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
                aria-pressed={active}
                aria-label={`Number ${n}${active ? ' (selected)' : ''}`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Booster */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Step 2 — Booster ball (optional)
        </h2>
        <label className="inline-flex items-center gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeBooster}
            onChange={e => {
              setIncludeBooster(e.target.checked);
              if (!e.target.checked) setBoosterPick(null);
            }}
            className="w-4 h-4 accent-emerald-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">My bet included a Booster pick</span>
        </label>
        {includeBooster && (
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
            {Array.from({ length: 49 }, (_, i) => i + 1).map(n => {
              const active = boosterPick === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBoosterPick(active ? null : n)}
                  className={`aspect-square rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-md scale-105'
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-400'
                  }`}
                  aria-pressed={active}
                >
                  {n}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Step 3: Filter draw type */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Step 3 — Which draws?
        </h2>
        <div className="inline-flex flex-wrap rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden max-w-full">
          {[
            { v: 'all', label: 'Both' },
            { v: 'lunchtime', label: 'Lunchtime' },
            { v: 'teatime', label: 'Teatime' },
          ].map(opt => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setDrawType(opt.v as 'all' | 'lunchtime' | 'teatime')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                drawType === opt.v
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={selected.length === 0}
          className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Check my numbers
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-4 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {submitted && selected.length > 0 && (
        <section className="mb-8">
          <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 mb-6">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Result</p>
            <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              Your numbers <strong>{selected.join(', ')}</strong>
              {boosterPick !== null && includeBooster && <> with Booster <strong>{boosterPick}</strong></>}
              {' '}would have hit a <strong>full {selected.length}/{selected.length} match</strong> in <strong className="text-emerald-700 dark:text-emerald-400">{fullMatches.length} of the last {totalDrawsChecked} {drawType === 'all' ? '' : drawType + ' '}draws</strong>
              {fullMatches.length > 0 && totalDrawsChecked > 0 && (
                <> ({((fullMatches.length / totalDrawsChecked) * 100).toFixed(2)}%)</>
              )}.
            </p>
          </div>

          {matches.length > 0 ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Draws where your numbers matched
              </h3>
              <div className="space-y-3">
                {matches.slice(0, 50).map((m, i) => (
                  <div
                    key={`${m.result.date}-${m.result.drawType}-${i}`}
                    className={`rounded-xl border p-4 ${
                      m.matched.length === selected.length
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          m.result.drawType === 'lunchtime'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
                        }`}>
                          {m.result.drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime'}
                        </span>
                        <time dateTime={m.result.date} className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(m.result.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        </time>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {m.matched.length}/{selected.length} matched
                        {m.matchedBooster && ' + Booster'}
                      </span>
                    </div>
                    <LotteryBalls numbers={m.result.numbers} booster={m.result.booster} size="sm" animated={false} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Your numbers haven&apos;t matched in any of the last {totalDrawsChecked} draws. Don&apos;t take it personally — every draw is independent.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
