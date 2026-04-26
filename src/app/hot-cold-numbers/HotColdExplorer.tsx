'use client';

import { useState, useMemo } from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import type { UK49sResult } from '@/lib/types';

interface Props {
  results: UK49sResult[];
  lunchtimeResults: UK49sResult[];
  teatimeResults: UK49sResult[];
}

type WindowSize = 10 | 20 | 50 | 100 | 0;
type DrawScope = 'all' | 'lunchtime' | 'teatime';
type Tab = 'hot' | 'cold' | 'overdue';

function frequency(results: UK49sResult[]): Map<number, number> {
  const f = new Map<number, number>();
  for (let i = 1; i <= 49; i++) f.set(i, 0);
  for (const r of results) {
    for (const n of r.numbers) f.set(n, (f.get(n) || 0) + 1);
    f.set(r.booster, (f.get(r.booster) || 0) + 1);
  }
  return f;
}

// Returns map: number → days since last drawn (or Infinity if never)
function gapSinceLastDrawn(results: UK49sResult[]): Map<number, number> {
  const sorted = [...results].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date();
  const gaps = new Map<number, number>();
  for (let i = 1; i <= 49; i++) gaps.set(i, Infinity);
  for (const r of sorted) {
    for (const n of [...r.numbers, r.booster]) {
      if (gaps.get(n) === Infinity) {
        const drawDate = new Date(r.date + 'T12:00:00');
        const days = Math.floor((today.getTime() - drawDate.getTime()) / (1000 * 60 * 60 * 24));
        gaps.set(n, days);
      }
    }
  }
  return gaps;
}

export default function HotColdExplorer({ results, lunchtimeResults, teatimeResults }: Props) {
  const [windowSize, setWindowSize] = useState<WindowSize>(20);
  const [scope, setScope] = useState<DrawScope>('all');
  const [tab, setTab] = useState<Tab>('hot');

  const filtered = useMemo(() => {
    const base = scope === 'lunchtime' ? lunchtimeResults : scope === 'teatime' ? teatimeResults : results;
    if (windowSize === 0) return base;
    return base.slice(0, windowSize);
  }, [results, lunchtimeResults, teatimeResults, scope, windowSize]);

  const sortedHot = useMemo(() => {
    const f = frequency(filtered);
    return [...f.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  }, [filtered]);

  const sortedCold = useMemo(() => [...sortedHot].reverse(), [sortedHot]);

  const sortedByGap = useMemo(() => {
    const g = gapSinceLastDrawn(filtered);
    return [...g.entries()]
      .filter(([, days]) => days !== Infinity)
      .sort((a, b) => b[1] - a[1])
      .concat([...g.entries()].filter(([, days]) => days === Infinity));
  }, [filtered]);

  const visibleData = tab === 'hot' ? sortedHot : tab === 'cold' ? sortedCold : sortedByGap;
  const top = visibleData.slice(0, 10);
  const maxValue = top[0]?.[1] === Infinity ? filtered.length : (top[0]?.[1] || 1);

  const windows: { v: WindowSize; label: string }[] = [
    { v: 10, label: 'Last 10' },
    { v: 20, label: 'Last 20' },
    { v: 50, label: 'Last 50' },
    { v: 100, label: 'Last 100' },
    { v: 0, label: 'All time' },
  ];

  return (
    <section className="mb-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Explore the data</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Slice by draw type, time window, and metric. Currently showing {filtered.length} draws.
        </p>
      </div>

      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['hot', 'cold', 'overdue'] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? t === 'hot' ? 'bg-red-600 text-white' : t === 'cold' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t === 'hot' ? '🔥 Hot' : t === 'cold' ? '🧊 Cold' : '⏰ Overdue'}
          </button>
        ))}
      </div>

      {/* Window selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 self-center mr-1">WINDOW:</span>
        {windows.map(w => (
          <button
            key={w.v}
            type="button"
            onClick={() => setWindowSize(w.v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              windowSize === w.v
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Scope selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 self-center mr-1">DRAW:</span>
        {(['all', 'lunchtime', 'teatime'] as DrawScope[]).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setScope(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              scope === s
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {s === 'all' ? 'Both' : s === 'lunchtime' ? 'Lunchtime' : 'Teatime'}
          </button>
        ))}
      </div>

      {/* Top 10 list */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          Top 10 — {tab === 'hot' ? 'Most drawn' : tab === 'cold' ? 'Least drawn' : 'Longest gap since last drawn'}
        </h3>
        <div className="mb-4">
          <LotteryBalls numbers={top.map(([n]) => n)} size="sm" animated={false} />
        </div>
        <div className="space-y-2">
          {top.map(([num, value]) => {
            const display = tab === 'overdue'
              ? (value === Infinity ? 'Not yet drawn' : `${value} day${value === 1 ? '' : 's'} ago`)
              : `${value} time${value === 1 ? '' : 's'}`;
            const widthVal = value === Infinity ? 100 : (value / maxValue) * 100;
            return (
              <div key={num} className="flex items-center gap-3">
                <span className="w-8 text-sm font-bold text-gray-700 dark:text-gray-300">{num}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">{display}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${tab === 'hot' ? 'bg-red-500' : tab === 'cold' ? 'bg-blue-500' : 'bg-purple-500'}`}
                      style={{ width: `${Math.min(widthVal, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
