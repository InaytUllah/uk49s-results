import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, calculateFrequency } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL, ogMeta } from '@/lib/data/seo';
import { ALL_DRAW_TYPES, DRAW_META, DrawType, UK49sResult } from '@/lib/types';

// Number stats change slowly. 1h revalidate is plenty.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ number: string }>;
}

export async function generateStaticParams() {
  return Array.from({ length: 49 }, (_, i) => ({
    number: String(i + 1),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { number } = await params;
  const num = parseInt(number, 10);
  if (isNaN(num) || num < 1 || num > 49) return {};

  return {
    title: `Number ${num} - UK 49s Statistics & History | ${SITE_NAME}`,
    description: `Number ${num} frequency analysis for UK 49s. See how often number ${num} appears across Brunchtime, Lunchtime, Drivetime and Teatime draws, last drawn dates, and prediction data.`,
    alternates: {
      canonical: `${SITE_URL}/numbers/${num}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...ogMeta(
      `Number ${num} - UK 49s Statistics & History`,
      `Number ${num} frequency analysis for UK 49s across all four daily draws.`,
      `/numbers/${num}`,
    ),
  };
}

function getNumberStatus(count: number, avgCount: number): { label: string; color: string; bgColor: string } {
  if (count >= avgCount * 1.2) return { label: 'Hot', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
  if (count <= avgCount * 0.8) return { label: 'Cold', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
  return { label: 'Neutral', color: 'text-gray-700 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' };
}

const PER_DRAW_THEME: Record<DrawType, {
  cardBg: string;
  cardBorder: string;
  cardText: string;
  bar: string;
  badge: string;
}> = {
  brunchtime: {
    cardBg: 'bg-orange-50 dark:bg-orange-950/20',
    cardBorder: 'border-orange-200 dark:border-orange-800',
    cardText: 'text-orange-700 dark:text-orange-400',
    bar: 'bg-gradient-to-r from-orange-500 to-orange-600',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  lunchtime: {
    cardBg: 'bg-amber-50 dark:bg-amber-950/20',
    cardBorder: 'border-amber-200 dark:border-amber-800',
    cardText: 'text-amber-700 dark:text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-600',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  drivetime: {
    cardBg: 'bg-rose-50 dark:bg-rose-950/20',
    cardBorder: 'border-rose-200 dark:border-rose-800',
    cardText: 'text-rose-700 dark:text-rose-400',
    bar: 'bg-gradient-to-r from-rose-500 to-rose-600',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  teatime: {
    cardBg: 'bg-indigo-50 dark:bg-indigo-950/20',
    cardBorder: 'border-indigo-200 dark:border-indigo-800',
    cardText: 'text-indigo-700 dark:text-indigo-400',
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
};

export default async function NumberPage({ params }: PageProps) {
  const { number } = await params;
  const num = parseInt(number, 10);

  if (isNaN(num) || num < 1 || num > 49) {
    notFound();
  }

  const allResults = await getLatestResults();

  const resultsByDraw: Record<DrawType, UK49sResult[]> = {
    brunchtime: allResults.filter(r => r.drawType === 'brunchtime'),
    lunchtime: allResults.filter(r => r.drawType === 'lunchtime'),
    drivetime: allResults.filter(r => r.drawType === 'drivetime'),
    teatime: allResults.filter(r => r.drawType === 'teatime'),
  };

  const freqAll = calculateFrequency(allResults);
  const countByDraw: Record<DrawType, number> = {
    brunchtime: calculateFrequency(resultsByDraw.brunchtime).get(num) || 0,
    lunchtime: calculateFrequency(resultsByDraw.lunchtime).get(num) || 0,
    drivetime: calculateFrequency(resultsByDraw.drivetime).get(num) || 0,
    teatime: calculateFrequency(resultsByDraw.teatime).get(num) || 0,
  };

  const totalDraws = allResults.length;
  const countAll = freqAll.get(num) || 0;

  const percentageAll = totalDraws > 0 ? ((countAll / totalDraws) * 100).toFixed(1) : '0.0';
  const percentageByDraw: Record<DrawType, string> = {
    brunchtime: resultsByDraw.brunchtime.length > 0 ? ((countByDraw.brunchtime / resultsByDraw.brunchtime.length) * 100).toFixed(1) : '0.0',
    lunchtime: resultsByDraw.lunchtime.length > 0 ? ((countByDraw.lunchtime / resultsByDraw.lunchtime.length) * 100).toFixed(1) : '0.0',
    drivetime: resultsByDraw.drivetime.length > 0 ? ((countByDraw.drivetime / resultsByDraw.drivetime.length) * 100).toFixed(1) : '0.0',
    teatime: resultsByDraw.teatime.length > 0 ? ((countByDraw.teatime / resultsByDraw.teatime.length) * 100).toFixed(1) : '0.0',
  };

  // Calculate average count for hot/cold status
  const allCounts = [...freqAll.values()];
  const avgCount = allCounts.reduce((a, b) => a + b, 0) / allCounts.length;
  const status = getNumberStatus(countAll, avgCount);

  // Find max count for bar width
  const maxCount = Math.max(...allCounts, 1);

  // Last 5 dates this number appeared
  const appearedIn = allResults
    .filter(r => r.numbers.includes(num) || r.booster === num)
    .slice(0, 5);

  // Rank among all numbers
  const sortedFreq = [...freqAll.entries()].sort((a, b) => b[1] - a[1]);
  const rank = sortedFreq.findIndex(([n]) => n === num) + 1;

  // Schema.org Article markup
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Number ${num} - UK 49s Statistics & History`,
    description: `Number ${num} frequency analysis for UK 49s across all four daily draws.`,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/numbers/${num}`,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>/</li>
          <li><Link href="/numbers" className="hover:text-blue-600 dark:hover:text-blue-400">Numbers</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Number {num}</li>
        </ol>
      </nav>

      {/* Header with large ball display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <LotteryBalls numbers={[num]} size="lg" animated={false} />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Number {num}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            UK 49s Statistics & Frequency Analysis
          </p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${status.color} ${status.bgColor}`}>
            {status.label} Number
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{countAll}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Draws</p>
        </div>
        {ALL_DRAW_TYPES.map(d => {
          const meta = DRAW_META[d];
          const theme = PER_DRAW_THEME[d];
          return (
            <div key={d} className={`${theme.cardBg} border ${theme.cardBorder} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${theme.cardText}`}>{countByDraw[d]}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{meta.shortLabel}</p>
            </div>
          );
        })}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">#{rank}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
        </div>
      </section>

      {/* Frequency Bar */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequency Overview</h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Overall ({percentageAll}%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{countAll} / {totalDraws} draws</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-5">
              <div
                className="h-5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                style={{ width: `${(countAll / maxCount) * 100}%` }}
              />
            </div>
          </div>
          {ALL_DRAW_TYPES.map(d => {
            const meta = DRAW_META[d];
            const theme = PER_DRAW_THEME[d];
            return (
              <div key={d}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{meta.label} ({percentageByDraw[d]}%)</span>
                  <span className={`font-semibold ${theme.cardText}`}>{countByDraw[d]} draws</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${theme.bar} transition-all`}
                    style={{ width: `${maxCount > 0 ? (countByDraw[d] / maxCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Last 5 Appearances */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Last 5 Appearances</h2>
        {appearedIn.length > 0 ? (
          <div className="space-y-3">
            {appearedIn.map((result, i) => {
              const isBooster = result.booster === num;
              const dateFormatted = new Date(result.date + 'T12:00:00').toLocaleDateString('en-GB', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
              });
              const meta = DRAW_META[result.drawType];
              const theme = PER_DRAW_THEME[result.drawType];
              return (
                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${theme.badge}`}>
                      {meta.shortLabel}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{dateFormatted}</span>
                    {isBooster && (
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        Booster
                      </span>
                    )}
                  </div>
                  <div className="sm:ml-auto">
                    <LotteryBalls numbers={result.numbers} booster={result.booster} size="sm" animated={false} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Number {num} has not appeared in recent draws.</p>
        )}
      </section>

      {/* Internal Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/predictions" className="block bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Today&apos;s Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See predicted numbers for upcoming draws</p>
          </Link>
          <Link href="/hot-cold-numbers" className="block bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-red-700 dark:text-red-400">Hot & Cold Numbers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">See which numbers are drawn most and least often</p>
          </Link>
          <Link href="/numbers" className="block bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">All Number Statistics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Browse stats for all 49 numbers</p>
          </Link>
          <Link href="/number-generator" className="block bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400">Number Generator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate random numbers for your next bet</p>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Number {num} in UK 49s</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Number <strong className="text-gray-900 dark:text-white">{num}</strong> has been drawn <strong className="text-gray-900 dark:text-white">{countAll} time{countAll !== 1 ? 's' : ''}</strong> across
                all recent UK 49s draws, appearing in <strong className="text-gray-900 dark:text-white">{percentageAll}%</strong> of draws. Per-draw breakdown:{' '}
                <Link href="/brunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Brunchtime</Link> {countByDraw.brunchtime},{' '}
                <Link href="/lunchtime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Lunchtime</Link> {countByDraw.lunchtime},{' '}
                <Link href="/drivetime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Drivetime</Link> {countByDraw.drivetime},{' '}
                <Link href="/teatime" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Teatime</Link> {countByDraw.teatime}.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Status</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Currently ranked <strong className="text-gray-900 dark:text-white">#{rank}</strong> out of 49 numbers, number {num} is classified as
                a <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>{status.label}</span> number. This classification is based
                on how its draw frequency compares to the average across all numbers.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
                <span>Each UK 49s draw is independent and random. Past performance does not predict future results. Always play responsibly.</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
