'use client';

import { useState, useEffect } from 'react';
import { DrawType, DRAW_META } from '@/lib/types';

interface UpcomingDrawProps {
  drawType: DrawType;
  latestDate: string; // ISO date of the latest result e.g. "2026-03-18"
}

/**
 * Shape returned by /api/draws.json (Cloudflare Pages Function).
 * Mirrors functions/api/draws.json.ts — keep them in sync.
 */
interface LiveDrawResult {
  date: string;
  drawType: DrawType;
  numbers: number[];
  booster: number;
  drawTime: string;
}

interface LiveDrawsResponse {
  fetchedAt: string;
  today: string;
  results: Partial<Record<DrawType, LiveDrawResult | null>>;
}

function getTodayUK(): string {
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return ukTime.toISOString().substring(0, 10);
}

function formatDateLong(isoDate: string): string {
  const date = new Date(isoDate + 'T12:00:00Z');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getTimeUntilDraw(drawType: DrawType): { hours: number; minutes: number; seconds: number; isPast: boolean } {
  const meta = DRAW_META[drawType];
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));

  const target = new Date(ukTime);
  target.setHours(meta.ukHour, meta.ukMinute, 0, 0);

  const diff = target.getTime() - ukTime.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  };
}

// Tailwind needs full literal class strings to be present at build time.
// Map each theme color to its concrete classes here.
const THEME_CLASSES: Record<DrawType, {
  border: string;
  bg: string;
  badge: string;
  timer: string;
}> = {
  brunchtime: {
    border: 'border-orange-300',
    bg: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    timer: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
  lunchtime: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    timer: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
  drivetime: {
    border: 'border-rose-300',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    timer: 'bg-gradient-to-r from-rose-500 to-pink-500',
  },
  teatime: {
    border: 'border-indigo-300',
    bg: 'bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-700',
    timer: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  },
};

export default function UpcomingDraw({ drawType, latestDate }: UpcomingDrawProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isPast: false });
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  // Live-fetched result for today, when the static HTML doesn't have it yet.
  // Polled from /api/draws.json once we're in the "draw in progress" state.
  const [liveResult, setLiveResult] = useState<LiveDrawResult | null>(null);

  useEffect(() => {
    const checkAndUpdate = () => {
      const todayUK = getTodayUK();
      const hasToday = latestDate >= todayUK;
      const time = getTimeUntilDraw(drawType);

      // Keep the card visible until today's actual results are in.
      // - Before draw time: show countdown
      // - After draw time but before results arrive: show "Draw in progress"
      // - Once results arrive: hide (the real result card below takes over)
      setShowPlaceholder(!hasToday);
      setTimeLeft(time);
    };

    checkAndUpdate();
    const timer = setInterval(checkAndUpdate, 1000);
    return () => clearInterval(timer);
  }, [drawType, latestDate]);

  // Live polling: once draw time has passed and we don't yet have today's
  // result from the static build, hit the edge-cached /api/draws.json every
  // 20 seconds until today's numbers show up. This shaves the rebuild gap
  // (5–20 min on GitHub Actions cron) down to ~30–60 sec for end users.
  useEffect(() => {
    if (!showPlaceholder || !timeLeft.isPast) return;
    // Already got the live result for today — no further polling needed
    if (liveResult && liveResult.date >= getTodayUK()) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch('/api/draws.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data: LiveDrawsResponse = await res.json();
        const r = data.results?.[drawType];
        // Accept only a result dated today (UK) — yesterday's would already
        // be in the static HTML, so it doesn't help us here.
        if (r && r.date >= getTodayUK() && !cancelled) {
          setLiveResult(r);
        }
      } catch {
        /* network blip — try again on next interval */
      }
    };

    poll(); // fire immediately so the first poll isn't delayed 20s
    const id = setInterval(poll, 20_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [drawType, showPlaceholder, timeLeft.isPast, liveResult]);

  if (!showPlaceholder) return null;
  // If we managed to fetch the live result, hide the placeholder card —
  // the real ResultCard rendered alongside it on the page will now have
  // data from the live response embedded by the parent re-render, or
  // visually we just render the numbers in-place. Easier: show them here.

  const meta = DRAW_META[drawType];
  const todayUK = getTodayUK();
  const theme = THEME_CLASSES[drawType];

  // Status badge changes based on whether draw time has passed
  const statusBadge = liveResult
    ? { label: 'LATEST RESULT', bg: 'bg-emerald-100 text-emerald-700' }
    : timeLeft.isPast
    ? { label: 'DRAW IN PROGRESS', bg: 'bg-emerald-100 text-emerald-700' }
    : { label: 'UPCOMING', bg: 'bg-blue-100 text-blue-700' };

  return (
    <div className={`rounded-xl border-2 ${theme.border} ${theme.bg} p-5 mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${theme.badge}`}>{meta.label}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusBadge.bg}`}>
            {statusBadge.label}
          </span>
        </div>
        <span className="text-sm text-gray-500">Draw Time: {meta.ukDrawTime} (UK)</span>
      </div>

      <p className="text-gray-700 font-medium mb-4">{formatDateLong(todayUK)}</p>

      {/* Balls: real numbers if we have a live result, otherwise '?' placeholders.
          Pulse only while we're still waiting (in-progress with no live result yet). */}
      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-4 ${timeLeft.isPast && !liveResult ? 'motion-safe:animate-pulse' : ''}`}>
        {liveResult
          ? liveResult.numbers.map((n, i) => (
              <div
                key={i}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xl font-bold shadow-md"
              >
                {n}
              </div>
            ))
          : [1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold border-2 border-gray-300"
              >
                ?
              </div>
            ))}
        <span className="text-gray-300 text-lg font-bold mx-1">+</span>
        {liveResult ? (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            {liveResult.booster}
          </div>
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-400 text-xl font-bold border-2 border-yellow-300">
            ?
          </div>
        )}
      </div>

      {/* Status footer: success once live result is in, otherwise countdown or in-progress */}
      {liveResult ? (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-lg p-3 text-white inline-flex items-center gap-2" role="status" aria-live="polite">
          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">
            Latest result — just published
          </span>
        </div>
      ) : timeLeft.isPast ? (
        <div className={`${theme.timer} rounded-lg p-3 text-white inline-flex items-center gap-2`} role="status" aria-live="polite">
          <span className="motion-safe:animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true" />
          <span className="text-sm font-semibold">
            Draw is in progress — results coming soon
          </span>
        </div>
      ) : (
        <div className={`${theme.timer} rounded-lg p-3 text-white inline-flex items-center gap-3`}>
          <span className="text-sm font-medium">Draw in:</span>
          <span className="text-lg font-bold">
            {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
      )}
    </div>
  );
}
