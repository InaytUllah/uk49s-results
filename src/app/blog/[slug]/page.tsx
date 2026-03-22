import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getResultByDate, getHotNumbers, getColdNumbers, getPredictionDate } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

type SlugInfo =
  | { type: 'result'; drawType: 'lunchtime' | 'teatime'; date: string }
  | { type: 'prediction'; date: string };

function parseSlug(slug: string): SlugInfo | null {
  // Result slug: uk-49s-lunchtime-results-2026-03-18
  const resultMatch = slug.match(/^uk-49s-(lunchtime|teatime)-results-(\d{4}-\d{2}-\d{2})$/);
  if (resultMatch) {
    return { type: 'result', drawType: resultMatch[1] as 'lunchtime' | 'teatime', date: resultMatch[2] };
  }

  // Prediction slug: uk-49s-predictions-2026-03-19
  const predMatch = slug.match(/^uk-49s-predictions-(\d{4}-\d{2}-\d{2})$/);
  if (predMatch) {
    return { type: 'prediction', date: predMatch[1] };
  }

  return null;
}

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Seeded random for consistent predictions
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generatePrediction(hot: number[], seed: number): { numbers: number[]; booster: number } {
  const random = seededRandom(seed);
  const pool = Array.from({ length: 49 }, (_, i) => i + 1);
  const selected: number[] = [];

  const hotPicks = hot.slice(0, 4);
  for (const num of hotPicks) {
    if (selected.length < 4) selected.push(num);
  }

  const remaining = pool.filter(n => !selected.includes(n));
  while (selected.length < 6) {
    const idx = Math.floor(random() * remaining.length);
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  selected.sort((a, b) => a - b);
  const booster = remaining[Math.floor(random() * remaining.length)];
  return { numbers: selected, booster };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: `Blog Post | ${SITE_NAME}` };

  if (parsed.type === 'prediction') {
    const formattedDate = formatDate(parsed.date);
    return {
      title: `UK 49s Predictions for ${formattedDate} | ${SITE_NAME}`,
      description: `UK 49s Lunchtime and Teatime predictions for ${formattedDate}. Statistical analysis based on hot & cold numbers from recent draws.`,
      alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    };
  }

  const { drawType, date } = parsed;
  const drawLabel = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const formattedDate = formatDate(date);
  const result = await getResultByDate(date, drawType);
  const numbersText = result ? `${result.numbers.join(', ')} + Booster ${result.booster}` : '';

  return {
    title: `UK 49s ${drawLabel} Results for ${formattedDate} | ${SITE_NAME}`,
    description: `UK 49s ${drawLabel} draw results for ${formattedDate}. Winning numbers: ${numbersText}. Full analysis, hot & cold numbers, and predictions.`,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const results = await getLatestResults();

  // Result blog posts
  const resultSlugs = results.map(r => ({
    slug: `uk-49s-${r.drawType}-results-${r.date}`,
  }));

  // Prediction blog posts (for dates we have results + next day)
  const dates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const predictionSlugs = dates.slice(0, 5).map(date => {
    const nextDay = new Date(date + 'T00:00:00');
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateISO = nextDay.toISOString().substring(0, 10);
    return { slug: `uk-49s-predictions-${nextDateISO}` };
  });

  // Also add today's and tomorrow's prediction
  const predDate = getPredictionDate(results);
  predictionSlugs.push({ slug: `uk-49s-predictions-${predDate.date}` });

  return [...resultSlugs, ...predictionSlugs];
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

  // ======== PREDICTION POST ========
  if (parsed.type === 'prediction') {
    const formattedDate = formatDate(parsed.date);
    const allResults = await getLatestResults();
    const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
    const teatimeResults = allResults.filter(r => r.drawType === 'teatime');
    const hotLunch = getHotNumbers(lunchtimeResults, 10);
    const hotTea = getHotNumbers(teatimeResults, 10);

    const dateSeed = parseInt(parsed.date.replace(/-/g, ''), 10);
    const lunchPreds = [
      generatePrediction(hotLunch, dateSeed + 1),
      generatePrediction(hotLunch, dateSeed + 2),
      generatePrediction(hotLunch, dateSeed + 3),
    ];
    const teaPreds = [
      generatePrediction(hotTea, dateSeed + 4),
      generatePrediction(hotTea, dateSeed + 5),
      generatePrediction(hotTea, dateSeed + 6),
    ];

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">Predictions {parsed.date}</span>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                Predictions
              </span>
              <time className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              UK 49s Predictions for {formattedDate}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Statistical predictions for both Lunchtime and Teatime draws based on recent number analysis.
            </p>
          </header>

          <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 mb-8">
            Disclaimer: These predictions are based on statistical analysis of past results. Lottery draws are random and no prediction can guarantee a win.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-4">
              Lunchtime Predictions — {formattedDate}
            </h2>
            <div className="space-y-4">
              {lunchPreds.map((pred, i) => (
                <div key={i} className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-3">
                    Prediction Set {i + 1}
                  </p>
                  <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
              Teatime Predictions — {formattedDate}
            </h2>
            <div className="space-y-4">
              {teaPreds.map((pred, i) => (
                <div key={i} className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
                    Prediction Set {i + 1}
                  </p>
                  <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How These Predictions Are Made</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our <strong className="text-gray-900 dark:text-white">UK 49s predictions</strong> for {formattedDate} are generated using statistical analysis of
                  the most recent draws. We identify <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot numbers</Link> (frequently drawn) and use a weighted
                  selection algorithm to produce three unique prediction sets for each draw.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The UK 49s <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Lunchtime</span></span> draw takes place at <strong className="text-gray-900 dark:text-white">12:49 PM</strong> UK time, and the <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Teatime</span></span> draw at
                  <strong className="text-gray-900 dark:text-white"> 5:49 PM</strong> UK time. Check back after each draw to see the actual results and updated
                  predictions for the next day.
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href="/predictions" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              Live Predictions Page
            </Link>
            <Link href="/lunchtime" className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
              Lunchtime Results
            </Link>
            <Link href="/teatime" className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors">
              Teatime Results
            </Link>
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: `UK 49s Predictions for ${formattedDate}`,
              datePublished: parsed.date,
              dateModified: parsed.date,
              description: `Statistical predictions for UK 49s Lunchtime and Teatime draws on ${formattedDate}`,
              author: { '@type': 'Organization', name: 'UK49s Results' },
            }),
          }}
        />
      </div>
    );
  }

  // ======== RESULT POST ========
  const { drawType, date } = parsed;
  const drawLabel = drawType === 'lunchtime' ? 'Lunchtime' : 'Teatime';
  const formattedDate = formatDate(date);

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

            <section className="mb-8">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Draw Summary</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  The <strong className="text-gray-900 dark:text-white">UK 49s {drawLabel}</strong> draw on <strong className="text-gray-900 dark:text-white">{formattedDate}</strong> produced the winning numbers{' '}
                  <strong className="text-gray-900 dark:text-white">{result.numbers.join(', ')}</strong> with Booster ball <strong className="text-gray-900 dark:text-white">{result.booster}</strong>.
                  The draw took place at {result.drawTime} UK time as scheduled.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Players who matched all 6 numbers would have won the top prize. The Booster ball
                  ({result.booster}) provides additional winning opportunities for players who included
                  the Booster option in their bet.
                </p>
              </div>
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

        <section className="mb-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About UK 49s {drawLabel} Draw</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The <strong className="text-gray-900 dark:text-white">UK 49s {drawLabel}</strong> draw takes place every day at{' '}
              <strong className="text-gray-900 dark:text-white">{drawType === 'lunchtime' ? '12:49 PM' : '5:49 PM'}</strong> UK time. Six main numbers
              are drawn from a pool of 1 to 49, followed by a <strong className="text-gray-900 dark:text-white">Booster ball</strong>. Players can choose
              to bet on 1 to 5 numbers with various prize tiers. Check our <Link href="/odds" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">odds and payouts</Link> page for full details.
            </p>
          </div>
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
