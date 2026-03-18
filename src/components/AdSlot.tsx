'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pushed.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense not loaded yet
      }
    }
  }, []);

  return (
    <div className={`ad-container my-4 text-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
