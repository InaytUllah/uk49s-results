'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <span className="text-8xl font-bold text-red-500">!</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Something Went Wrong
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        We encountered an unexpected error. This is usually temporary — try refreshing the page.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
