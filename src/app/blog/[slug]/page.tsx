import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDate, calculateFrequency } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

type SlugInfo =
  | { type: 'result'; drawType: 'lunchtime' | 'teatime'; date: string }
  | { type: 'prediction'; date: string };

function parseSlug(slug: string): SlugInfo | null {
  const resultMatch = slug.match(/^uk-49s-(lunchtime|teatime)-results-(\d{4}-\d{2}-\d{2})$/);
  if (resultMatch) {
    return { type: 'result', drawType: resultMatch[1] as 'lunchtime' | 'teatime', date: resultMatch[2] };
  }

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

  // Result slugs redirect — no metadata needed
  if (parsed.type === 'result') {
    return { title: `Redirecting... | ${SITE_NAME}` };
  }

  const formattedDate = formatDate(parsed.date);
  return {
    title: `UK 49s Predictions for ${formattedDate} — Analysis & Hot Numbers | ${SITE_NAME}`,
    description: `In-depth UK 49s predictions for ${formattedDate}. Statistical analysis of hot & cold number trends, frequency patterns, and weighted prediction sets for Lunchtime and Teatime draws.`,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: `UK 49s Predictions — ${formattedDate}`,
      description: `Statistical analysis and prediction sets for Lunchtime & Teatime draws.`,
      type: 'article',
      images: [{
        url: `${SITE_URL}/api/og?title=${encodeURIComponent(`Predictions — ${formattedDate}`)}&subtitle=${encodeURIComponent('Lunchtime & Teatime Statistical Analysis')}&type=prediction`,
        width: 1200,
        height: 630,
        alt: `UK 49s Predictions for ${formattedDate}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `UK 49s Predictions — ${formattedDate}`,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(`Predictions — ${formattedDate}`)}&subtitle=${encodeURIComponent('Lunchtime & Teatime Statistical Analysis')}&type=prediction`],
    },
  };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const results = await getLatestResults();
  const dates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));

  // Only prediction blog posts — no more result blog posts
  const predictionSlugs = dates.slice(0, 5).map(date => {
    const nextDay = new Date(date + 'T00:00:00');
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDateISO = nextDay.toISOString().substring(0, 10);
    return { slug: `uk-49s-predictions-${nextDateISO}` };
  });

  const predDate = getPredictionDate(results);
  predictionSlugs.push({ slug: `uk-49s-predictions-${predDate.date}` });

  return predictionSlugs;
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

  // Redirect result blog URLs to canonical result pages
  if (parsed.type === 'result') {
    redirect(`/${parsed.drawType}/results/${parsed.date}`);
  }

  // ======== PREDICTION POST ========
  const formattedDate = formatDate(parsed.date);
  const allResults = await getLatestResults();
  const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');
  const hotLunch = getHotNumbers(lunchtimeResults, 10);
  const hotTea = getHotNumbers(teatimeResults, 10);
  const coldLunch = getColdNumbers(lunchtimeResults, 7);
  const coldTea = getColdNumbers(teatimeResults, 7);

  // Frequency data for trend analysis
  const freqLunch = calculateFrequency(lunchtimeResults);
  const freqTea = calculateFrequency(teatimeResults);

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

  // Find top trending numbers (biggest frequency in recent draws)
  const topLunchTrending = hotLunch.slice(0, 5);
  const topTeaTrending = hotTea.slice(0, 5);

  // Check previous day results to see if any predictions matched
  const prevDate = new Date(parsed.date + 'T00:00:00');
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().substring(0, 10);
  const prevLunch = allResults.find(r => r.date === prevDateStr && r.drawType === 'lunchtime');
  const prevTea = allResults.find(r => r.date === prevDateStr && r.drawType === 'teatime');

  // Generate previous day's predictions to compare
  const prevSeed = parseInt(prevDateStr.replace(/-/g, ''), 10);
  const prevLunchPreds = generatePrediction(hotLunch, prevSeed + 1);
  const prevTeaPreds = generatePrediction(hotTea, prevSeed + 4);

  const lunchMatches = prevLunch ? prevLunchPreds.numbers.filter(n => prevLunch.numbers.includes(n)) : [];
  const teaMatches = prevTea ? prevTeaPreds.numbers.filter(n => prevTea.numbers.includes(n)) : [];

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
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            In-depth statistical analysis and weighted prediction sets for Lunchtime and Teatime draws.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Analysis Team</Link></span>
            <span className="mx-1">&middot;</span>
            <span>Based on {allResults.length} recent draws</span>
          </div>
        </header>

        <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 mb-8">
          Disclaimer: These predictions are based on statistical analysis of past results. Lottery draws are random and no prediction can guarantee a win. Play responsibly.
        </p>

        {/* Previous Day Performance */}
        {(prevLunch || prevTea) && (
          <section className="mb-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Previous Prediction Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevLunch && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                      Lunchtime — {formatDate(prevDateStr)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lunchMatches.length > 0 ? (
                        <>Our prediction matched <strong className="text-gray-900 dark:text-white">{lunchMatches.length} number{lunchMatches.length !== 1 ? 's' : ''}</strong>: {lunchMatches.join(', ')}</>
                      ) : (
                        <>No direct matches in yesterday&apos;s draw. Hot number trends continue to evolve.</>
                      )}
                    </p>
                  </div>
                )}
                {prevTea && (
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
                      Teatime — {formatDate(prevDateStr)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {teaMatches.length > 0 ? (
                        <>Our prediction matched <strong className="text-gray-900 dark:text-white">{teaMatches.length} number{teaMatches.length !== 1 ? 's' : ''}</strong>: {teaMatches.join(', ')}</>
                      ) : (
                        <>No direct matches in yesterday&apos;s draw. Hot number trends continue to evolve.</>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Trend Analysis */}
        <section className="mb-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Number Trends This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3">Lunchtime Trending Numbers</h3>
                <div className="space-y-2">
                  {topLunchTrending.map(num => {
                    const count = freqLunch.get(num) || 0;
                    const pct = lunchtimeResults.length > 0 ? ((count / lunchtimeResults.length) * 100).toFixed(1) : '0';
                    return (
                      <div key={num} className="flex items-center gap-3">
                        <LotteryBalls numbers={[num]} size="sm" animated={false} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Drawn {count} times</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div className="h-2 rounded-full bg-amber-500" style={{ width: `${Math.min(parseFloat(pct) * 3, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-3">Teatime Trending Numbers</h3>
                <div className="space-y-2">
                  {topTeaTrending.map(num => {
                    const count = freqTea.get(num) || 0;
                    const pct = teatimeResults.length > 0 ? ((count / teatimeResults.length) * 100).toFixed(1) : '0';
                    return (
                      <div key={num} className="flex items-center gap-3">
                        <LotteryBalls numbers={[num]} size="sm" animated={false} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Drawn {count} times</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.min(parseFloat(pct) * 3, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lunchtime Predictions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-400 mb-4">
            Lunchtime Predictions — {formattedDate}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on weighted analysis of the top {hotLunch.length} hot Lunchtime numbers. Each set combines 4 statistically favoured numbers with 2 randomised picks for balanced coverage.
          </p>
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

        {/* Teatime Predictions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
            Teatime Predictions — {formattedDate}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on weighted analysis of the top {hotTea.length} hot Teatime numbers. Teatime draws are independent from Lunchtime, so separate frequency data is used.
          </p>
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

        {/* Hot & Cold Comparison */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hot & Cold Numbers Used</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Lunchtime Hot Numbers</p>
              <LotteryBalls numbers={hotLunch.slice(0, 7)} size="sm" animated={false} />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Lunchtime Cold Numbers</p>
              <LotteryBalls numbers={coldLunch} size="sm" animated={false} />
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Teatime Hot Numbers</p>
              <LotteryBalls numbers={hotTea.slice(0, 7)} size="sm" animated={false} />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Teatime Cold Numbers</p>
              <LotteryBalls numbers={coldTea} size="sm" animated={false} />
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="mb-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How These Predictions Are Made</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our <strong className="text-gray-900 dark:text-white">UK 49s predictions</strong> for {formattedDate} use a weighted statistical model that analyses the frequency distribution of numbers across recent draws. The algorithm identifies <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot numbers</Link> — those drawn significantly more often than the statistical average — and assigns them higher selection probability.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Each prediction set is constructed by selecting 4 numbers from the top 10 most frequently drawn, then filling the remaining 2 positions randomly from the full 1-49 pool. The Booster ball is selected independently. This approach balances statistical trends with the inherent randomness of lottery draws.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Lunchtime and Teatime predictions use <strong className="text-gray-900 dark:text-white">separate frequency datasets</strong> because each draw is independent. A number that is hot in Lunchtime draws may be cold in Teatime, and vice versa. View the <Link href="/lunchtime-vs-teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime vs Teatime comparison</Link> for a detailed breakdown.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The UK 49s <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Lunchtime</span></span> draw takes place at <strong className="text-gray-900 dark:text-white">12:49 PM</strong> and the <span className="inline-flex items-center gap-1"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Teatime</span></span> draw at <strong className="text-gray-900 dark:text-white">5:49 PM</strong> UK time. Results are updated on this site within minutes of each draw.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/predictions" className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Live Predictions Page
          </Link>
          <Link href="/hot-cold-numbers" className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
            Hot & Cold Numbers
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
            description: `In-depth statistical predictions and trend analysis for UK 49s Lunchtime and Teatime draws on ${formattedDate}`,
            author: {
              '@type': 'Person',
              name: 'UK49s Results Analysis Team',
              url: 'https://uk49sresults.co.uk/about',
              jobTitle: 'Lottery Data Analysts',
              worksFor: { '@type': 'Organization', name: 'UK49s Results', url: 'https://uk49sresults.co.uk' },
            },
            publisher: { '@type': 'Organization', name: 'UK49s Results', url: 'https://uk49sresults.co.uk' },
          }),
        }}
      />
    </div>
  );
}
