import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import { getLatestResults } from '@/lib/data/draws';
import { PAGE_SEO } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: PAGE_SEO.teatime.title,
  description: PAGE_SEO.teatime.description,
};

export const revalidate = 60;

export default async function TeatimePage() {
  const results = await getLatestResults('teatime');
  const latest = results[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Teatime Results
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Today&apos;s winning numbers drawn at 5:49 PM UK time
      </p>

      <Countdown drawType="teatime" />

      {latest && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Teatime Result</h2>
          <ResultCard result={latest} featured />
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Teatime Results</h2>
          <Link href="/history" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View All &rarr;
          </Link>
        </div>
        <div className="space-y-4">
          {results.slice(1).map(result => (
            <ResultCard key={`${result.date}-${result.drawType}`} result={result} />
          ))}
        </div>
      </section>

      <section className="prose dark:prose-invert max-w-none">
        <h2>About UK 49s Teatime Draw</h2>
        <p>
          The UK 49s Teatime draw takes place every day at 5:49 PM UK time (GMT/BST).
          Six main numbers are drawn from a pool of 1 to 49, followed by a Booster ball.
          This page is updated immediately after each draw with the latest winning numbers.
        </p>
        <h3>Teatime Draw Schedule</h3>
        <ul>
          <li><strong>Time:</strong> 5:49 PM UK time (every day)</li>
          <li><strong>Numbers drawn:</strong> 6 main + 1 Booster</li>
          <li><strong>Number range:</strong> 1 to 49</li>
        </ul>
        <p>
          Check back after each Teatime draw for the latest results. You can also view
          the <Link href="/lunchtime">Lunchtime results</Link> which take place at 12:49 PM UK time.
        </p>
      </section>
    </div>
  );
}
