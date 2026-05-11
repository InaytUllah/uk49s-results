import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDateForDraw } from '@/lib/data/draws';
import { generatePrediction } from '@/lib/data/predictions';
import { PAGE_SEO, SITE_URL } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { ALL_DRAW_TYPES, DRAW_META, DrawType } from '@/lib/types';

export const metadata: Metadata = {
  title: PAGE_SEO.predictions.title,
  description: PAGE_SEO.predictions.description,
  alternates: { canonical: '/predictions' },
  openGraph: {
    title: 'UK 49s Predictions Today — Brunchtime, Lunchtime, Drivetime & Teatime',
    description: 'Statistical predictions for all four UK 49s draws.',
    type: 'website',
    images: [{
      url: `${SITE_URL}/api/og?title=${encodeURIComponent('UK 49s Predictions Today')}&subtitle=${encodeURIComponent('All Four Daily Draws — Statistical Analysis')}&type=prediction`,
      width: 1200, height: 630,
    }],
  },
};

export const revalidate = 300;

const HUB_THEME: Record<DrawType, {
  bg: string;
  border: string;
  heading: string;
  badge: string;
  accentBg: string;
  accentBgHover: string;
  preview: string;
}> = {
  brunchtime: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    heading: 'text-orange-700 dark:text-orange-400',
    badge: 'bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    accentBg: 'bg-orange-500',
    accentBgHover: 'hover:bg-orange-600',
    preview: 'text-orange-700 dark:text-orange-400',
  },
  lunchtime: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    heading: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    accentBg: 'bg-amber-500',
    accentBgHover: 'hover:bg-amber-600',
    preview: 'text-amber-700 dark:text-amber-400',
  },
  drivetime: {
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    border: 'border-rose-200 dark:border-rose-800',
    heading: 'text-rose-700 dark:text-rose-400',
    badge: 'bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    accentBg: 'bg-rose-500',
    accentBgHover: 'hover:bg-rose-600',
    preview: 'text-rose-700 dark:text-rose-400',
  },
  teatime: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    heading: 'text-indigo-700 dark:text-indigo-400',
    badge: 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    accentBg: 'bg-indigo-500',
    accentBgHover: 'hover:bg-indigo-600',
    preview: 'text-indigo-700 dark:text-indigo-400',
  },
};

export default async function PredictionsPage() {
  const allResults = await getLatestResults();

  // Build per-draw preview info
  const previews = ALL_DRAW_TYPES.map(drawType => {
    const meta = DRAW_META[drawType];
    const drawResults = allResults.filter(r => r.drawType === drawType);
    const hot = getHotNumbers(drawResults, 10);
    const cold = getColdNumbers(drawResults, 10);
    const info = getPredictionDateForDraw(drawType, allResults);
    const dateSeed = parseInt(info.date.replace(/-/g, ''), 10);
    const preview = generatePrediction(hot, cold, dateSeed + meta.predictionSeedOffset, 'hot-streak');
    return { drawType, meta, info, preview, hot };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Predictions Today
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Statistical predictions for all four daily UK 49s draws — Brunchtime, Lunchtime, Drivetime, and Teatime — updated after every result.
      </p>

      {/* Per-draw preview cards */}
      <section className="mb-8 space-y-4">
        {previews.map(({ drawType, meta, info, preview }) => {
          const theme = HUB_THEME[drawType];
          return (
            <div key={drawType} className={`${theme.bg} border-2 ${theme.border} rounded-2xl p-6 sm:p-8`}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h2 className={`text-2xl font-bold ${theme.heading}`}>
                    {meta.label} Predictions
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    For {info.formatted} — Draw at {meta.ukDrawTime} UK
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.badge}`}>
                  {meta.ukDrawTime}
                </span>
              </div>

              <div className="mb-4">
                <p className={`text-xs font-semibold mb-2 ${theme.preview}`}>Preview — Prediction Set 1</p>
                <LotteryBalls numbers={preview.numbers} booster={preview.booster} size="md" animated={false} />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3 prediction sets + hot/cold analysis + trending numbers
                </p>
                <Link
                  href={`/${drawType}-predictions`}
                  className={`px-5 py-2.5 ${theme.accentBg} ${theme.accentBgHover} text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap`}
                >
                  View All {meta.label} Predictions &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Hot Numbers Quick View */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Hot Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {previews.map(({ drawType, meta, hot }) => {
            const theme = HUB_THEME[drawType];
            return (
              <div key={drawType} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className={`text-sm font-semibold ${theme.heading} mb-2`}>{meta.label} Hot</p>
                <LotteryBalls numbers={hot.slice(0, 7)} size="sm" animated={false} />
              </div>
            );
          })}
        </div>
      </section>

      {/* SEO Content */}
      <section>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Our UK 49s Predictions</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We provide separate prediction pages for each of the four UK 49s draws because <strong className="text-gray-900 dark:text-white">Brunchtime, Lunchtime, Drivetime and Teatime are independent events</strong> with different frequency patterns. A number that&apos;s hot in the 10:49 AM Brunchtime draw may not be hot in the 5:49 PM Teatime draw.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Choose Your Draw</h3>
              <ul className="space-y-2">
                {ALL_DRAW_TYPES.map(drawType => {
                  const meta = DRAW_META[drawType];
                  return (
                    <li key={drawType} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <span className="mt-0.5 flex-shrink-0">{meta.emoji}</span>
                      <span>
                        <Link href={`/${drawType}-predictions`} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                          {meta.label} Predictions
                        </Link>
                        {' '}— for the {meta.ukDrawTime} draw, using {meta.label}-only frequency data
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How Predictions Auto-Update</h3>
              <ul className="space-y-2">
                {ALL_DRAW_TYPES.map(drawType => {
                  const meta = DRAW_META[drawType];
                  return (
                    <li key={drawType} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span>{meta.label} predictions switch to next day once {meta.ukDrawTime} results are in</span>
                    </li>
                  );
                })}
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span>Hot/cold numbers recalculate with every new draw added</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" /></svg>
                <span>The <strong>UK 49s lottery</strong> is a game of chance. No prediction system can guarantee winning numbers. Always play responsibly and within your means.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Predictions', url: '/predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(PAGE_SEO.predictions.title, PAGE_SEO.predictions.description, '/predictions')) }} />
    </div>
  );
}
