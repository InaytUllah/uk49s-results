'use client';

import { useState } from 'react';
import ResultCard from '@/components/ResultCard';
import { UK49sResult } from '@/lib/types';

const PAGE_SIZE = 20;

interface HistoryResultsProps {
  results: UK49sResult[];
}

export default function HistoryResults({ results }: HistoryResultsProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  return (
    <div>
      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {visibleResults.length} of {results.length} results
      </p>

      {/* Results */}
      <div className="space-y-4">
        {visibleResults.map((result) => (
          <div key={`${result.date}-${result.drawType}`}>
            <ResultCard result={result} />
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, results.length))}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          >
            Show More Results ({Math.min(PAGE_SIZE, results.length - visibleCount)} more)
          </button>
        </div>
      )}

      {!hasMore && results.length > PAGE_SIZE && (
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          All {results.length} results displayed
        </p>
      )}
    </div>
  );
}
