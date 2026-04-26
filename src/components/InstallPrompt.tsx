'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'uk49s-install-dismissed';
const DISMISS_DAYS = 14;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Skip if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Skip if recently dismissed
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const ageMs = Date.now() - parseInt(dismissedAt, 10);
        if (ageMs < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
      }
    } catch {
      // localStorage blocked — show anyway
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay showing for 8 seconds so user can engage with the page first
      setTimeout(() => setVisible(true), 8000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore
    }
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-prompt-title"
      className="fixed bottom-4 right-4 max-sm:right-2 max-sm:left-2 max-sm:bottom-2 w-full max-w-sm max-sm:max-w-none rounded-2xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-center">49</span>
            <span id="install-prompt-title" className="font-semibold text-sm text-gray-900 dark:text-white">
              Install UK49s Results
            </span>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 -m-1"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
          Add to your home screen for faster access to today&apos;s draws, instant offline checks, and one-tap results.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={install}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Install
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg font-medium text-sm transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
