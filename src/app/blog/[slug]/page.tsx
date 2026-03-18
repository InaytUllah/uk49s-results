import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getResultByDate, getHotNumbers, getColdNumbers } from '@/lib/data/draws';
import { SITE_NAME } from '@/lib/data/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

function parseSlug(slug: string): { drawType: 'lunchtime' | 'teatime'; date: string } | null {
  // slug format: uk-49s-lunchtime-results-2026-03-18
  const match = slug.match(/^uk-49s-(lunchtime|teatime)-results-(\d{4}-\d{2}-\d{2})$/);
  if (!match) return null;
  return { drawType: match[1] as 'lunchtime' | 'teatime', date: match[2] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: `Blog Post | ${SITE_NAME}` };

  const { drawType, date } = parsed;
  const drawLabel = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const result = await getResultByDate(date, drawType);
  const numbersText = result ? `${result.numbers.join(', ')} + Booster ${result.booster}` : '';

  return {
    title: `UK 49s ${drawLabel} Results for ${formattedDate} | ${SITE_NAME}`,
    description: `UK 49s ${drawLabel} draw results for ${formattedDate}. Winning numbers: ${numbersText}. Full analysis, hot & cold numbers, and predictions.`,
  };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const results = await getLatestResults();
  return results.map(r => ({
    slug: `uk-49s-${r.drawType}-results-${r.date}`,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-emerald-600 hover:text-emerald-700">Back to Blog</Link>
      </div>
    );
  }

  const { drawType, date } = parsed;
  const drawLabel = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const result = await getResultByDate(date, drawType);
  const allResults = await getLatestResults(drawType);
  const hot = getHotNumbers(allResults, 7);
  const cold = getColdNumbers(allResults, 7);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{drawLabel} {date}</span>
      </nav>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              drawType === 'lunchtime'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
            }`}>
              {drawLabel}
            </span>
            <time className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            UK 49s {drawLabel} Results for {formattedDate}
          </h1>
        </header>

        {result ? (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Winning Numbers</h2>
              <ResultCard result={result} featured />
            </section>

            <section className="prose dark:prose-invert max-w-none mb-8">
              <h2>Draw Summary</h2>
              <p>
                The UK 49s {drawLabel} draw on {formattedDate} produced the winning numbers{' '}
                <strong>{result.numbers.join(', ')}</strong> with Booster ball <strong>{result.booster}</strong>.
                The draw took place at {result.drawTime} UK time as scheduled.
              </p>
              <p>
                Players who matched all 6 numbers would have won the top prize. The Booster ball
                ({result.booster}) provides additional winning opportunities for players who included
                the Booster option in their bet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Current {drawLabel} Hot & Cold Numbers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Hot (Most Drawn)</p>
                  <LotteryBalls numbers={hot} size="sm" animated={false} />
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Cold (Least Drawn)</p>
                  <LotteryBalls numbers={cold} size="sm" animated={false} />
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center mb-8">
            <p className="text-yellow-800 dark:text-yellow-300">
              Results for this draw are not available yet. Please check back later.
            </p>
          </div>
        )}

        <section className="prose dark:prose-invert max-w-none mb-8">
          <h2>About UK 49s {drawLabel} Draw</h2>
          <p>
            The UK 49s {drawLabel} draw takes place every day at{' '}
            {drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM'} UK time. Six main numbers
            are drawn from a pool of 1 to 49, followed by a Booster ball. Players can choose
            to bet on 1 to 5 numbers with various prize tiers.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${drawType}/results/${date}`}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
              drawType === 'lunchtime' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            View Full {drawLabel} Result
          </Link>
          <Link
            href={`/${drawType === 'lunchtime' ? 'teatime' : 'lunchtime'}/results/${date}`}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {drawType === 'lunchtime' ? 'Teatime' : 'Lunchtime'} Results for {date}
          </Link>
          <Link
            href="/predictions"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            View Predictions
          </Link>
        </div>
      </article>

      {/* Schema.org Article markup for SEO */}
      {result && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: `UK 49s ${drawLabel} Results for ${formattedDate}`,
              datePublished: date,
              dateModified: date,
              description: `Winning numbers: ${result.numbers.join(', ')} + Booster ${result.booster}`,
              author: { '@type': 'Organization', name: 'UK49s Results' },
            }),
          }}
        />
      )}
    </div>
  );
}
