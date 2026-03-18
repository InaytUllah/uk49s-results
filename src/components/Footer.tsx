import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">UK49s Results</h3>
            <p className="text-sm leading-relaxed">
              Your trusted source for the latest UK 49s Lunchtime and Teatime results. Updated daily with winning numbers, statistics, and analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lunchtime" className="hover:text-white transition-colors">Lunchtime Results</Link></li>
              <li><Link href="/teatime" className="hover:text-white transition-colors">Teatime Results</Link></li>
              <li><Link href="/history" className="hover:text-white transition-colors">Past Results</Link></li>
              <li><Link href="/hot-cold-numbers" className="hover:text-white transition-colors">Hot & Cold Numbers</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/number-generator" className="hover:text-white transition-colors">Number Generator</Link></li>
              <li><Link href="/predictions" className="hover:text-white transition-colors">Predictions</Link></li>
              <li><Link href="/how-to-play" className="hover:text-white transition-colors">How to Play</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Draw Schedule */}
          <div>
            <h3 className="text-white font-semibold mb-4">Draw Times (UK)</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Lunchtime: 12:49 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span>Teatime: 5:49 PM</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Draws take place 7 days a week</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} UK49s Results. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-600">
            This site is not affiliated with UK 49s or any lottery operator. For entertainment and informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
