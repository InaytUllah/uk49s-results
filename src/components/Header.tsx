'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/lunchtime', label: 'Lunchtime' },
    { href: '/teatime', label: 'Teatime' },
    { href: '/hot-cold-numbers', label: 'Hot & Cold' },
    { href: '/predictions', label: 'Predictions' },
    { href: '/number-generator', label: 'Generator' },
    { href: '/history', label: 'History' },
    { href: '/how-to-play', label: 'How to Play' },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">49</div>
            <span className="font-bold text-xl hidden sm:inline">UK49s Results</span>
            <span className="font-bold text-lg sm:hidden">UK49s</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/20 pt-2">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
