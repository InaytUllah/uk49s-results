'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';

interface MenuItem {
  href: string;
  icon: string;
  title: string;
  description: string;
}

interface MenuCategory {
  label: string;
  icon: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    label: 'Results',
    icon: '🎱',
    items: [
      { href: '/', icon: '🏠', title: 'Home', description: 'Latest UK 49s results overview' },
      { href: '/lunchtime', icon: '☀️', title: 'Lunchtime Results', description: '12:49 PM draw winning numbers' },
      { href: '/teatime', icon: '🌙', title: 'Teatime Results', description: '5:49 PM draw winning numbers' },
      { href: '/history', icon: '📊', title: 'Past Results', description: 'Complete results history archive' },
      { href: '/lunchtime-vs-teatime', icon: '⚖️', title: 'Lunchtime vs Teatime', description: 'Compare both daily draws' },
    ],
  },
  {
    label: 'Predictions',
    icon: '🎯',
    items: [
      { href: '/predictions', icon: '🔮', title: "Today's Predictions", description: 'Lunchtime & Teatime prediction hub' },
      { href: '/lunchtime-predictions', icon: '☀️', title: 'Lunchtime Predictions', description: '12:49 PM draw analysis & numbers' },
      { href: '/teatime-predictions', icon: '🌙', title: 'Teatime Predictions', description: '5:49 PM draw analysis & numbers' },
      { href: '/hot-cold-numbers', icon: '🔥', title: 'Hot & Cold Numbers', description: 'Most and least drawn numbers' },
      { href: '/numbers', icon: '📈', title: 'Number Statistics', description: 'Frequency data for all 49 numbers' },
      { href: '/odds', icon: '🎰', title: 'Odds & Payouts', description: 'Betting odds and payout tables' },
    ],
  },
  {
    label: 'Tools & Info',
    icon: '🛠️',
    items: [
      { href: '/check', icon: '✅', title: 'Number Checker', description: 'Did your numbers win? Check the archive' },
      { href: '/number-generator', icon: '🎲', title: 'Number Generator', description: 'Generate random UK 49s numbers' },
      { href: '/how-to-play', icon: '📖', title: 'How to Play', description: 'Rules, odds and betting guide' },
      { href: '/faq', icon: '❓', title: 'FAQ', description: 'Frequently asked questions' },
      { href: '/blog', icon: '📰', title: 'Blog & News', description: 'Latest tips, analysis and results' },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDesktopMenu = useCallback((label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDesktopMenu(label);
  }, []);

  const closeDesktopMenu = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopMenu(null);
    }, 150);
  }, []);

  const toggleMobileAccordion = (label: string) => {
    setMobileAccordion(prev => (prev === label ? null : label));
  };

  return (
    <header className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">49</div>
            <span className="font-bold text-xl hidden sm:inline">UK49s Results</span>
            <span className="font-bold text-lg sm:hidden">UK49s</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuCategories.map(category => (
              <div
                key={category.label}
                className="relative"
                onMouseEnter={() => openDesktopMenu(category.label)}
                onMouseLeave={closeDesktopMenu}
              >
                <button
                  aria-expanded={activeDesktopMenu === category.label}
                  aria-haspopup="true"
                  aria-label={`${category.label} menu`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700 ${
                    activeDesktopMenu === category.label
                      ? 'text-white bg-white/15'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span aria-hidden="true">{category.icon}</span>
                  <span>{category.label}</span>
                  <svg
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDesktopMenu === category.label ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (mobileMenuOpen) setMobileAccordion(null);
            }}
            className="lg:hidden p-3 rounded-lg hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      {activeDesktopMenu && (
        <div
          className="hidden lg:block absolute left-0 right-0 z-50 animate-fadeInDown"
          onMouseEnter={() => openDesktopMenu(activeDesktopMenu)}
          onMouseLeave={closeDesktopMenu}
        >
          <div className="max-w-7xl mx-auto px-4 pb-1">
            <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-xl border-t-2 border-emerald-500 p-6">
              {menuCategories
                .filter(c => c.label === activeDesktopMenu)
                .map(category => (
                  <div key={category.label}>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                      {category.icon} {category.label}
                    </p>
                    <div className={`grid gap-2 ${category.items.length > 4 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {category.items.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDesktopMenu(null)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                          <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Main navigation" className="lg:hidden border-t border-white/20 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {menuCategories.map(category => (
              <div key={category.label}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleMobileAccordion(category.label)}
                  aria-expanded={mobileAccordion === category.label}
                  aria-controls={`mobile-menu-${category.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-white/90 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <span aria-hidden="true">{category.icon}</span>
                    <span>{category.label}</span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileAccordion === category.label ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Accordion Content */}
                {mobileAccordion === category.label && (
                  <div id={`mobile-menu-${category.label.toLowerCase().replace(/\s+/g, '-')}`} className="ml-2 mb-2 space-y-0.5 animate-fadeInDown">
                    {category.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileAccordion(null);
                        }}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <span className="text-base mt-0.5">{item.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
