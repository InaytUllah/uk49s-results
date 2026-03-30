import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDate, calculateFrequency } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `UK 49s Teatime Predictions Today — Hot Numbers & Analysis | ${SITE_NAME}`,
  description: 'Get today\'s UK 49s Teatime predictions based on statistical analysis. Hot & cold number trends, frequency patterns, and 3 weighted prediction sets for the 5:49 PM draw.',
  alternates: { canonical: '/teatime-predictions' },
  openGraph: {
    title: 'UK 49s Teatime Predictions Today',
    description: 'Statistical predictions for today\'s UK 49s Teatime draw at 5:49 PM.',
    type: 'article',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('Teatime Predictions Today')}&subtitle=${encodeURIComponent('5:49 PM Draw — Statistical Analysis')}&type=prediction`,
      width: 1200, height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK 49s Teatime Predictions Today',
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent('Teatime Predictions Today')}&subtitle=${encodeURIComponent('5:49 PM Draw — Statistical Analysis')}&type=prediction`],
  },
};

export const revalidate = 60;

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

export default async function TeatimePredictionsPage() {
  const allResults = await getLatestResults();
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');
  const hot = getHotNumbers(teatimeResults, 10);
  const cold = getColdNumbers(teatimeResults, 10);
  const freq = calculateFrequency(teatimeResults);
  const predInfo = getPredictionDate(allResults);
  const dateSeed = parseInt(predInfo.date.replace(/-/g, ''), 10);

  const predictions = [
    generatePrediction(hot, dateSeed + 4),
    generatePrediction(hot, dateSeed + 5),
    generatePrediction(hot, dateSeed + 6),
  ];

  const topTrending = hot.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li><Link href="/predictions" className="hover:text-emerald-600">Predictions</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Teatime</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Teatime Predictions Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Statistical predictions for the {predInfo.formatted} draw at 5:49 PM UK time
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Analysis Team</Link></span>
        <span>&middot;</span>
        <span>Based on {teatimeResults.length} Teatime draws</span>
      </div>

      <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 mb-8">
        Disclaimer: Predictions are based on statistical analysis of past results. Lottery draws are random — no prediction guarantees a win. Play responsibly.
      </p>

      {/* Prediction Sets */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
          Teatime Prediction Sets — {predInfo.formatted}
        </h2>
        <div className="space-y-4">
          {predictions.map((pred, i) => (
            <div key={i} className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
                Prediction Set {i + 1}
              </p>
              <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Numbers */}
      <section className="mb-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Teatime Trending Numbers</h2>
          <div className="space-y-3">
            {topTrending.map(num => {
              const count = freq.get(num) || 0;
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
      </section>

      {/* Hot & Cold */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Teatime Hot & Cold Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Hot (Most Drawn)</p>
            <LotteryBalls numbers={hot.slice(0, 7)} size="sm" animated={false} />
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Cold (Least Drawn)</p>
            <LotteryBalls numbers={cold.slice(0, 7)} size="sm" animated={false} />
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="mb-10">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Teatime Predictions Work</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our <strong className="text-gray-900 dark:text-white">UK 49s Teatime predictions</strong> use a weighted statistical model analysing number frequency patterns from the <strong className="text-gray-900 dark:text-white">5:49 PM Teatime draw</strong> specifically. Teatime data is kept separate from <Link href="/lunchtime-predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime predictions</Link> because each draw is an independent event with its own frequency patterns.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prediction Methodology</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>4 numbers selected from the top 10 <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot Teatime numbers</Link></span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>2 numbers randomly selected from the remaining pool for balanced coverage</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Booster ball selected independently from the full 1-49 range</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Predictions auto-update to the next day once Teatime results are announced</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the Teatime Draw</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The UK 49s Teatime draw is the second daily draw, taking place at <strong className="text-gray-900 dark:text-white">5:49 PM UK time</strong> every day including weekends. It uses the same format as the Lunchtime draw — 6 main numbers from 1-49 plus a Booster ball — but results are completely independent. Check our <Link href="/lunchtime-vs-teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime vs Teatime comparison</Link> to see how the two draws differ statistically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/lunchtime-predictions" className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-center text-sm">
          Lunchtime Predictions
        </Link>
        <Link href="/teatime" className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-center text-sm">
          Teatime Results
        </Link>
        <Link href="/hot-cold-numbers" className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-center text-sm">
          Hot & Cold Numbers
        </Link>
        <Link href="/number-generator" className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-center text-sm">
          Number Generator
        </Link>
      </div>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Predictions', url: '/predictions' }, { name: 'Teatime Predictions', url: '/teatime-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What are the UK 49s Teatime predictions for today?', acceptedAnswer: { '@type': 'Answer', text: `Our statistical predictions for the ${predInfo.formatted} Teatime draw use weighted analysis of hot numbers from recent Teatime draws. We provide 3 unique prediction sets combining frequently drawn numbers with random selections.` } },
          { '@type': 'Question', name: 'How are UK 49s Teatime predictions calculated?', acceptedAnswer: { '@type': 'Answer', text: 'Predictions are generated by analysing number frequency patterns in recent Teatime draws only. 4 numbers are selected from the top 10 most frequently drawn in Teatime, and 2 are randomly selected for balance. Teatime data is kept separate from Lunchtime since each draw is independent.' } },
          { '@type': 'Question', name: 'When do Teatime predictions update?', acceptedAnswer: { '@type': 'Answer', text: 'Teatime predictions automatically update to the next day once the 5:49 PM draw results are announced. This ensures predictions always target the upcoming Teatime draw.' } },
        ],
      }) }} />
    </div>
  );
}
