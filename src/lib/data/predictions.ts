/**
 * Prediction set generation.
 *
 * Each daily prediction page shows 3 sets. Previously all 3 sets shared the
 * top 4 hot numbers, which made them look near-identical. This module gives
 * each set a distinct strategy so users see real variety:
 *
 *   - HOT_STREAK   "Bold play"     — chase the 3 hottest numbers, pad with random
 *   - BALANCED     "Mixed"         — 2 hottest + 2 warm (rank 5-10) + 2 random
 *   - SPREAD       "Diverse"       — 1 hot + 1 cold + 4 random, lowest correlation
 *
 * The 3 sets share at most 1-2 numbers instead of all 4, so each post on
 * social feels like 3 genuinely different bets.
 */

export type PredictionStrategy = 'hot-streak' | 'balanced' | 'spread';

export interface PredictionStrategyMeta {
  key: PredictionStrategy;
  label: string;
  emoji: string;
  tagline: string;
}

export const STRATEGY_META: Record<PredictionStrategy, PredictionStrategyMeta> = {
  'hot-streak': {
    key: 'hot-streak',
    label: 'Hot Streak',
    emoji: '🔥',
    tagline: 'Chase the trend — built around the 3 hottest numbers',
  },
  'balanced': {
    key: 'balanced',
    label: 'Balanced',
    emoji: '⚖️',
    tagline: 'Mix of hot and warm numbers — moderate risk',
  },
  'spread': {
    key: 'spread',
    label: 'Spread',
    emoji: '🎲',
    tagline: 'One hot, one cold, four random — diverse coverage',
  },
};

export const PREDICTION_STRATEGIES: PredictionStrategy[] = ['hot-streak', 'balanced', 'spread'];

export interface Prediction {
  numbers: number[];
  booster: number;
  strategy: PredictionStrategy;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function generatePrediction(
  hot: number[],
  cold: number[],
  seed: number,
  strategy: PredictionStrategy,
): Prediction {
  const random = seededRandom(seed);
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const selected: number[] = [];

  if (strategy === 'hot-streak') {
    // 3 hottest + 3 random — the "all in on the trend" play
    for (const n of hot.slice(0, 3)) {
      if (!selected.includes(n)) selected.push(n);
    }
  } else if (strategy === 'balanced') {
    // 2 hottest + 2 warm (ranked 5-10) + 2 random — mixed exposure
    for (const n of hot.slice(0, 2)) {
      if (!selected.includes(n)) selected.push(n);
    }
    const warm = hot.slice(4, 10).slice();
    while (selected.length < 4 && warm.length > 0) {
      const idx = Math.floor(random() * warm.length);
      const num = warm[idx];
      if (!selected.includes(num)) selected.push(num);
      warm.splice(idx, 1);
    }
  } else {
    // spread: 1 hot + 1 cold + 4 random — lowest correlation between sets
    if (hot.length > 0) selected.push(hot[0]);
    if (cold.length > 0 && !selected.includes(cold[0])) selected.push(cold[0]);
  }

  // Fill remaining with random picks from the leftover pool
  const remaining = pool.filter(n => !selected.includes(n));
  while (selected.length < 6) {
    const idx = Math.floor(random() * remaining.length);
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  selected.sort((a, b) => a - b);
  const booster = remaining[Math.floor(random() * remaining.length)];
  return { numbers: selected, booster, strategy };
}

/**
 * Generate the standard 3-set daily prediction for a given date.
 * Seeds are derived from the date so the same date always shows the same
 * sets (deterministic). Different seedOffset for lunch (1) vs tea (4) so
 * the two draws have different number selections on the same day.
 */
export function generateDailyPredictions(
  hot: number[],
  cold: number[],
  date: string,
  seedOffset: number,
): Prediction[] {
  const dateSeed = parseInt(date.replace(/-/g, ''), 10);
  return PREDICTION_STRATEGIES.map((strategy, i) =>
    generatePrediction(hot, cold, dateSeed + seedOffset + i, strategy),
  );
}
