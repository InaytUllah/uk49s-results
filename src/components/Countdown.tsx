'use client';

import { useState, useEffect } from 'react';
import { DrawType, DRAW_META } from '@/lib/types';

interface CountdownProps {
  drawType: DrawType;
}

function getNextDrawTime(drawType: DrawType): Date {
  const meta = DRAW_META[drawType];
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));

  const target = new Date(ukTime);
  target.setHours(meta.ukHour, meta.ukMinute, 0, 0);
  if (ukTime > target) {
    target.setDate(target.getDate() + 1);
  }

  // Convert back to local time for countdown
  const diff = target.getTime() - ukTime.getTime();
  return new Date(now.getTime() + diff);
}

const THEME_GRADIENTS: Record<DrawType, string> = {
  brunchtime: 'from-orange-500 to-red-500',
  lunchtime: 'from-amber-500 to-orange-500',
  drivetime: 'from-rose-500 to-pink-500',
  teatime: 'from-indigo-500 to-purple-500',
};

export default function Countdown({ drawType }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = getNextDrawTime(drawType);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [drawType]);

  const meta = DRAW_META[drawType];
  const bgColor = THEME_GRADIENTS[drawType];

  return (
    <div className={`bg-gradient-to-r ${bgColor} rounded-xl p-4 text-white`}>
      <p className="text-sm font-medium opacity-90">Next {meta.label} Draw ({meta.ukDrawTime} UK)</p>
      <div className="flex items-center gap-3 mt-2">
        <div className="text-center">
          <span className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
          <p className="text-xs opacity-75">Hours</p>
        </div>
        <span className="text-2xl font-bold">:</span>
        <div className="text-center">
          <span className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <p className="text-xs opacity-75">Mins</p>
        </div>
        <span className="text-2xl font-bold">:</span>
        <div className="text-center">
          <span className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <p className="text-xs opacity-75">Secs</p>
        </div>
      </div>
    </div>
  );
}
