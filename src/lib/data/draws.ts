import { UK49sResult } from '../types';

// Draw schedule (UK time)
export const DRAW_SCHEDULE = {
  lunchtime: '12:49 PM',
  teatime: '5:49 PM',
};

// Sample/seed data - will be replaced by real API data
export const sampleResults: UK49sResult[] = [
  {
    date: '2026-03-18',
    drawType: 'lunchtime',
    numbers: [7, 14, 21, 28, 35, 42],
    booster: 49,
    drawTime: '12:49 PM',
  },
  {
    date: '2026-03-18',
    drawType: 'teatime',
    numbers: [3, 11, 19, 27, 36, 44],
    booster: 15,
    drawTime: '5:49 PM',
  },
  {
    date: '2026-03-17',
    drawType: 'lunchtime',
    numbers: [5, 12, 23, 31, 38, 46],
    booster: 8,
    drawTime: '12:49 PM',
  },
  {
    date: '2026-03-17',
    drawType: 'teatime',
    numbers: [2, 9, 18, 25, 33, 47],
    booster: 41,
    drawTime: '5:49 PM',
  },
  {
    date: '2026-03-16',
    drawType: 'lunchtime',
    numbers: [6, 15, 22, 29, 37, 43],
    booster: 10,
    drawTime: '12:49 PM',
  },
  {
    date: '2026-03-16',
    drawType: 'teatime',
    numbers: [1, 13, 20, 30, 39, 48],
    booster: 26,
    drawTime: '5:49 PM',
  },
  {
    date: '2026-03-15',
    drawType: 'lunchtime',
    numbers: [4, 16, 24, 32, 40, 45],
    booster: 17,
    drawTime: '12:49 PM',
  },
  {
    date: '2026-03-15',
    drawType: 'teatime',
    numbers: [8, 10, 19, 26, 34, 41],
    booster: 3,
    drawTime: '5:49 PM',
  },
  {
    date: '2026-03-14',
    drawType: 'lunchtime',
    numbers: [11, 17, 25, 33, 42, 49],
    booster: 6,
    drawTime: '12:49 PM',
  },
  {
    date: '2026-03-14',
    drawType: 'teatime',
    numbers: [2, 14, 21, 28, 36, 44],
    booster: 19,
    drawTime: '5:49 PM',
  },
];

export function getLatestResults(drawType?: 'lunchtime' | 'teatime'): UK49sResult[] {
  if (drawType) {
    return sampleResults.filter(r => r.drawType === drawType);
  }
  return sampleResults;
}

export function getResultByDate(date: string, drawType: 'lunchtime' | 'teatime'): UK49sResult | undefined {
  return sampleResults.find(r => r.date === date && r.drawType === drawType);
}

export function getRecentDates(): string[] {
  const dates = [...new Set(sampleResults.map(r => r.date))];
  return dates.sort((a, b) => b.localeCompare(a));
}

export function calculateFrequency(results: UK49sResult[]): Map<number, number> {
  const freq = new Map<number, number>();
  for (let i = 1; i <= 49; i++) freq.set(i, 0);

  results.forEach(result => {
    result.numbers.forEach(num => {
      freq.set(num, (freq.get(num) || 0) + 1);
    });
    freq.set(result.booster, (freq.get(result.booster) || 0) + 1);
  });

  return freq;
}

export function getHotNumbers(results: UK49sResult[], count: number = 10): number[] {
  const freq = calculateFrequency(results);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([num]) => num);
}

export function getColdNumbers(results: UK49sResult[], count: number = 10): number[] {
  const freq = calculateFrequency(results);
  return [...freq.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([num]) => num);
}
