import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4">UK49s Results</h3>
            <p className="text-sm leading-relaxed">
              Your trusted source for the latest UK 49s Lunchtime and Teatime results. Updated daily with winning numbers, statistics, and analysis.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link>
              <Link href="/faq" className="text-sm hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lunchtime" className="hover:text-white transition-colors">Lunchtime Results</Link></li>
              <li><Link href="/teatime" className="hover:text-white transition-colors">Teatime Results</Link></li>
              <li><Link href="/history" className="hover:text-white transition-colors">Past Results</Link></li>
              <li><Link href="/hot-cold-numbers" className="hover:text-white transition-colors">Hot &amp; Cold Numbers</Link></li>
              <li><Link href="/predictions" className="hover:text-white transition-colors">Predictions</Link></li>
              <li><Link href="/odds" className="hover:text-white transition-colors">Odds &amp; Payouts</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/number-generator" className="hover:text-white transition-colors">Number Generator</Link></li>
              <li><Link href="/numbers" className="hover:text-white transition-colors">Number Stats</Link></li>
              <li><Link href="/lunchtime-vs-teatime" className="hover:text-white transition-colors">Lunchtime vs Teatime</Link></li>
              <li><Link href="/how-to-play" className="hover:text-white transition-colors">How to Play</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/responsible-gaming" className="hover:text-white transition-colors">Responsible Gaming</Link></li>
            </ul>

            {/* Draw Times */}
            <h3 className="text-white font-semibold mb-3 mt-6">Draw Times (UK)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Lunchtime: 12:49 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span>Teatime: 5:49 PM</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Draws take place 7 days a week</p>
            </div>
          </div>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="border-t border-gray-800 mt-6 pt-6">
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl border border-amber-500/30 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-white">Responsible Gaming</span>
                <span className="text-red-500 font-bold text-sm ml-auto">18+</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Gambling is considered sinful in many faiths and traditions. If your beliefs discourage it, please honor them. No tool or strategy can change lottery odds — play responsibly or not at all.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/responsible-gaming" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Get Help &amp; Support
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <span className="text-gray-600">|</span>
                <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">BeGambleAware.org</a>
                <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">GamCare</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; {currentYear} UK49s Results. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
