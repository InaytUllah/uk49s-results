'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  drawType: 'lunchtime' | 'teatime';
}

function getNextDrawTime(drawType: 'lunchtime' | 'teatime'): Date {
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));

  const target = new Date(ukTime);

  if (drawType === 'lunchtime') {
    target.setHours(12, 49, 0, 0);
    if (ukTime > target) {
      target.setDate(target.getDate() + 1);
    }
  } else {
    target.setHours(17, 49, 0, 0);
    if (ukTime > target) {
      target.setDate(target.getDate() + 1);
    }
  }

  // Convert back to local time for countdown
  const diff = target.getTime() - ukTime.getTime();
  return new Date(now.getTime() + diff);
}

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

  const label = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const time = drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM';
  const bgColor = drawType === 'lunchtime'
    ? 'from-amber-500 to-orange-500'
    : 'from-indigo-500 to-purple-500';

  return (
    <div className={`bg-gradient-to-r ${bgColor} rounded-xl p-4 text-white`}>
      <p className="text-sm font-medium opacity-90">Next {label} Draw ({time} UK)</p>
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
