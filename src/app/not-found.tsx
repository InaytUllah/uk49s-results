import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: `Page Not Found | ${SITE_NAME}`,
  description: 'The page you are looking for could not be found. Browse our latest UK 49s results, predictions, and tools.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <span className="text-8xl font-bold text-emerald-600">404</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Page Not Found
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of these popular pages instead:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
        <Link href="/" className="px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors text-sm">
          Latest Results
        </Link>
        <Link href="/lunchtime" className="px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors text-sm">
          Lunchtime
        </Link>
        <Link href="/teatime" className="px-4 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors text-sm">
          Teatime
        </Link>
        <Link href="/predictions" className="px-4 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors text-sm">
          Predictions
        </Link>
        <Link href="/hot-cold-numbers" className="px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors text-sm">
          Hot & Cold
        </Link>
        <Link href="/how-to-play" className="px-4 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm">
          How to Play
        </Link>
      </div>

      <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
        &larr; Back to Homepage
      </Link>
    </div>
  );
}
