'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function ResponsibleGamingPopup() {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'fading' | 'gone'>('hidden');
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    setPhase('fading');
    setTimeout(() => {
      setPhase('gone');
      try {
        sessionStorage.setItem('responsible-gaming-dismissed', '1');
      } catch {
        // sessionStorage blocked — ignore
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (sessionStorage.getItem('responsible-gaming-dismissed')) {
        setPhase('gone');
        return;
      }
    } catch {
      // sessionStorage blocked — show anyway
    }

    // Show after 5 seconds
    const showTimer = setTimeout(() => {
      setPhase('visible');

      // Auto-dismiss after 10 seconds of being visible
      autoDismissRef.current = setTimeout(() => {
        setPhase('fading');
        setTimeout(() => {
          setPhase('gone');
          try {
            sessionStorage.setItem('responsible-gaming-dismissed', '1');
          } catch {
            // ignore
          }
        }, 500);
      }, 10000);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    };
  }, []);

  if (phase === 'hidden' || phase === 'gone') return null;

  return (
    <div
      className={`fixed bottom-4 right-4 max-sm:right-2 max-sm:left-2 max-sm:bottom-2 w-full max-w-sm max-sm:max-w-none rounded-2xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500 ${
        phase === 'fading' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
      style={{ zIndex: 999 }}
      role="alert"
    >
      {/* Amber accent bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

      <div className="p-4">
        {/* Header with icon and close */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              Responsible Gaming
            </span>
          </div>
          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-0.5"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          Gambling is considered sinful in many faiths and traditions. If your beliefs discourage it,
          please honor them. No tool or strategy can change lottery odds — play responsibly or not at all.
        </p>

        {/* Link */}
        <Link
          href="/responsible-gaming"
          onClick={dismiss}
          className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          Get Help &amp; Support
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Shrinking progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-800">
        <div className="h-full bg-amber-400 animate-shrink-bar" />
      </div>
    </div>
  );
}
