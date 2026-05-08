'use client';

import { useState, useEffect } from 'react';
import { DrawType, DRAW_META } from '@/lib/types';

interface UpcomingDrawProps {
  drawType: DrawType;
  latestDate: string; // ISO date of the latest result e.g. "2026-03-18"
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

  if (!showPlaceholder) return null;

  const meta = DRAW_META[drawType];
  const todayUK = getTodayUK();
  const theme = THEME_CLASSES[drawType];

  // Status badge changes based on whether draw time has passed
  const statusBadge = timeLeft.isPast
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

      {/* Placeholder balls — pulse when in progress to suggest activity */}
      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-4 ${timeLeft.isPast ? 'motion-safe:animate-pulse' : ''}`}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold border-2 border-gray-300"
          >
            ?
          </div>
        ))}
        <span className="text-gray-300 text-lg font-bold mx-1">+</span>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-400 text-xl font-bold border-2 border-yellow-300">
          ?
        </div>
      </div>

      {/* Countdown timer / In-progress state */}
      {timeLeft.isPast ? (
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
