'use client';

import { useState, useEffect } from 'react';

interface UpcomingDrawProps {
  drawType: 'lunchtime' | 'teatime';
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

function getTimeUntilDraw(drawType: 'lunchtime' | 'teatime'): { hours: number; minutes: number; seconds: number; isPast: boolean } {
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));

  const target = new Date(ukTime);
  if (drawType === 'lunchtime') {
    target.setHours(12, 49, 0, 0);
  } else {
    target.setHours(17, 49, 0, 0);
  }

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

export default function UpcomingDraw({ drawType, latestDate }: UpcomingDrawProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isPast: false });
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const checkAndUpdate = () => {
      const todayUK = getTodayUK();
      const hasToday = latestDate >= todayUK;
      const time = getTimeUntilDraw(drawType);

      // Show placeholder if: today's results not yet available AND draw hasn't happened yet
      setShowPlaceholder(!hasToday && !time.isPast);
      setTimeLeft(time);
    };

    checkAndUpdate();
    const timer = setInterval(checkAndUpdate, 1000);
    return () => clearInterval(timer);
  }, [drawType, latestDate]);

  if (!showPlaceholder) return null;

  const todayUK = getTodayUK();
  const label = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const time = drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM';
  const borderColor = drawType === 'lunchtime' ? 'border-amber-300' : 'border-indigo-300';
  const bgColor = drawType === 'lunchtime' ? 'bg-amber-50' : 'bg-indigo-50';
  const badgeBg = drawType === 'lunchtime' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700';
  const timerBg = drawType === 'lunchtime'
    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
    : 'bg-gradient-to-r from-indigo-500 to-purple-500';

  return (
    <div className={`rounded-xl border-2 ${borderColor} ${bgColor} p-5 mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeBg}`}>{label}</span>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">UPCOMING</span>
        </div>
        <span className="text-sm text-gray-500">Draw Time: {time} (UK)</span>
      </div>

      <p className="text-gray-700 font-medium mb-4">{formatDateLong(todayUK)}</p>

      {/* Placeholder balls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
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

      {/* Countdown timer */}
      <div className={`${timerBg} rounded-lg p-3 text-white inline-flex items-center gap-3`}>
        <span className="text-sm font-medium">Draw in:</span>
        <span className="text-lg font-bold">
          {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    </div>
  );
}
