'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    // Only render ad if AdSense script is loaded
    if (!pushed.current && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
        setAdsLoaded(true);
      } catch {
        // AdSense not loaded yet
      }
    }
  }, []);

  // Don't render anything if AdSense isn't active
  if (!adsLoaded) return null;

  return (
    <div className={`text-center ${className}`} ref={adRef}>
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
