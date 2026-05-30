import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, getHotNumbers, getColdNumbers, getPredictionDate, getPredictionDateForDraw, calculateFrequency } from '@/lib/data/draws';
import { generateDailyPredictions, generatePrediction as generatePredictionShared, STRATEGY_META } from '@/lib/data/predictions';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { DrawType, DRAW_META, ALL_DRAW_TYPES } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

type SlugInfo =
  | { type: 'result'; drawType: DrawType; date: string }
  | { type: 'prediction-combined'; date: string }
  | { type: 'prediction'; drawType: DrawType; date: string };

const DRAW_PATTERN = '(brunchtime|lunchtime|drivetime|teatime)';

function parseSlug(slug: string): SlugInfo | null {
  // Result slug: uk-49s-lunchtime-results-2026-03-18
  const resultMatch = slug.match(new RegExp(`^uk-49s-${DRAW_PATTERN}-results-(\\d{4}-\\d{2}-\\d{2})$`));
  if (resultMatch) {
    return { type: 'result', drawType: resultMatch[1] as DrawType, date: resultMatch[2] };
  }

  // Per-draw prediction slug: uk-49s-lunchtime-predictions-2026-03-30
  const drawPredMatch = slug.match(new RegExp(`^uk-49s-${DRAW_PATTERN}-predictions-(\\d{4}-\\d{2}-\\d{2})$`));
  if (drawPredMatch) {
    return { type: 'prediction', drawType: drawPredMatch[1] as DrawType, date: drawPredMatch[2] };
  }

  // OLD combined prediction slug: uk-49s-predictions-2026-03-19 → redirect
  const predMatch = slug.match(/^uk-49s-predictions-(\d{4}-\d{2}-\d{2})$/);
  if (predMatch) {
    return { type: 'prediction-combined', date: predMatch[1] };
  }

  return null;
}

function formatDate(date: string): string {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Per-draw theme classes (Tailwind needs literals at build time)
const DRAW_THEME: Record<DrawType, {
  badgeBg: string;
  bg: string;
  border: string;
  text: string;
  accentBg: string;
  accentBgHover: string;
  bar: string;
}> = {
  brunchtime: {
    badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-400',
    accentBg: 'bg-orange-500',
    accentBgHover: 'hover:bg-orange-600',
    bar: 'bg-orange-500',
  },
  lunchtime: {
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-400',
    accentBg: 'bg-amber-500',
    accentBgHover: 'hover:bg-amber-600',
    bar: 'bg-amber-500',
  },
  drivetime: {
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-400',
    accentBg: 'bg-rose-500',
    accentBgHover: 'hover:bg-rose-600',
    bar: 'bg-rose-500',
  },
  teatime: {
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-400',
    accentBg: 'bg-indigo-500',
    accentBgHover: 'hover:bg-indigo-600',
    bar: 'bg-indigo-500',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: `Blog Post | ${SITE_NAME}` };

  if (parsed.type === 'result' || parsed.type === 'prediction-combined') {
    return { title: `Redirecting... | ${SITE_NAME}` };
  }

  const { drawType, date } = parsed;
  const meta = DRAW_META[drawType];
  const formattedDate = formatDate(date);
  const selfUrl = `${SITE_URL}/blog/${slug}`;

  return {
    title: `UK 49s ${meta.label} Predictions for ${formattedDate} — Analysis & Hot Numbers | ${SITE_NAME}`,
    description: `In-depth UK 49s ${meta.label} predictions for ${formattedDate}. Statistical analysis of hot & cold number trends and 3 weighted prediction sets for the ${meta.ukDrawTime} draw.`,
    alternates: { canonical: selfUrl },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `UK 49s ${meta.label} Predictions — ${formattedDate}`,
      description: `Statistical analysis and prediction sets for the ${meta.ukDrawTime} ${meta.label} draw.`,
      type: 'article',
      url: selfUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `UK 49s ${meta.label} Predictions — ${formattedDate}`,
    },
  };
}

// Static export: every slug we want indexed must be pre-generated below.
// Legacy result URLs (e.g. /blog/uk-49s-lunchtime-results-DATE) redirect to
// canonical /lunchtime/results/DATE via public/_redirects at the Cloudflare
// edge — those don't need Next pages at all.
export const dynamicParams = false;

export async function generateStaticParams() {
  const results = await getLatestResults();
  const dates = [...new Set(results.map(r => r.date))].sort((a, b) => b.localeCompare(a));
  const predDate = getPredictionDate(results);

  // Generate a dated post for every date in our (now persisted) history plus the
  // upcoming prediction date. This keeps previously-indexed dated posts returning
  // 200 instead of 404ing once they roll out of the live ~10-draw scrape window.
  const dateSet = new Set<string>([predDate.date, ...dates]);
  for (const drawType of ALL_DRAW_TYPES) {
    dateSet.add(getPredictionDateForDraw(drawType, results).date);
  }
  const uniqueDates = [...dateSet];

  const slugs: { slug: string }[] = [];
  for (const date of uniqueDates) {
    for (const drawType of ALL_DRAW_TYPES) {
      slugs.push({ slug: `uk-49s-${drawType}-predictions-${date}` });
    }
  }

  return slugs;
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

  // Result-style and old-combined-prediction slugs are handled by
  // public/_redirects at the Cloudflare edge (308 permanent). If we somehow
  // reach this code path with one (e.g. legacy build artefact), bail out.
  if (parsed.type === 'result' || parsed.type === 'prediction-combined') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post moved</h1>
        <Link href="/blog" className="text-emerald-600 hover:text-emerald-700">Back to Blog</Link>
      </div>
    );
  }

  // ======== DRAW-SPECIFIC PREDICTION POST ========
  const { drawType, date } = parsed;
  const drawMeta = DRAW_META[drawType];
  const drawLabel = drawMeta.label;
  const drawTime = drawMeta.ukDrawTime;
  const theme = DRAW_THEME[drawType];
  const formattedDate = formatDate(date);

  // Pick a sensible "other draw" for the cross-link — Lunchtime <-> Teatime,
  // Brunchtime <-> Drivetime keep within the closer halves of the day.
  const otherDraw: DrawType =
    drawType === 'lunchtime' ? 'teatime'
    : drawType === 'teatime' ? 'lunchtime'
    : drawType === 'brunchtime' ? 'drivetime'
    : 'brunchtime';
  const otherMeta = DRAW_META[otherDraw];
  const otherTheme = DRAW_THEME[otherDraw];

  const allResults = await getLatestResults();
  const drawResults = allResults.filter(r => r.drawType === drawType);
  const hot = getHotNumbers(drawResults, 10);
  const cold = getColdNumbers(drawResults, 7);
  const freq = calculateFrequency(drawResults);

  const seedOffset = drawMeta.predictionSeedOffset;
  const predictions = generateDailyPredictions(hot, cold, date, seedOffset);

  const topTrending = hot.slice(0, 5);

  // Previous day performance
  const prevDate = new Date(date + 'T00:00:00');
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().substring(0, 10);
  const prevResult = allResults.find(r => r.date === prevDateStr && r.drawType === drawType);
  // Backtest previous day with the "hot-streak" strategy (Set 1) for headline match count
  const prevSeed = parseInt(prevDateStr.replace(/-/g, ''), 10);
  const prevPred = generatePredictionShared(hot, cold, prevSeed + seedOffset, 'hot-streak');
  const matches = prevResult ? prevPred.numbers.filter(n => prevResult.numbers.includes(n)) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{drawLabel} Predictions {date}</span>
      </nav>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.badgeBg}`}>
              {drawLabel} Predictions
            </span>
            <time className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            UK 49s {drawLabel} Predictions for {formattedDate}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Statistical analysis and weighted prediction sets for the {drawTime} {drawLabel} draw.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>By <Link href="/about" className="text-emerald-600 dark:text-emerald-400 hover:underline">UK49s Results Analysis Team</Link></span>
            <span>&middot;</span>
            <span>Based on {drawResults.length} {drawLabel} draws</span>
          </div>
        </header>

        {/* Trending Numbers */}
        <section className="mb-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{drawLabel} Trending Numbers</h2>
            <div className="space-y-3">
              {topTrending.map(num => {
                const count = freq.get(num) || 0;
                const pct = drawResults.length > 0 ? ((count / drawResults.length) * 100).toFixed(1) : '0';
                return (
                  <div key={num} className="flex items-center gap-3">
                    <LotteryBalls numbers={[num]} size="sm" animated={false} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Drawn {count} times</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div className={`h-2 rounded-full ${theme.bar}`} style={{ width: `${Math.min(parseFloat(pct) * 3, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Prediction Sets */}
        <section className="mb-8">
          <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
            {drawLabel} Prediction Sets — {formattedDate}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on weighted analysis of the top {hot.length} hot {drawLabel} numbers. Each set combines statistically favoured numbers with randomised picks.
          </p>
          <div className="space-y-4">
            {predictions.map((pred, i) => {
              const meta = STRATEGY_META[pred.strategy];
              return (
                <div key={i} className={`${theme.bg} ${theme.border} border rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${theme.text}`}>Set {i + 1}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${theme.badgeBg} inline-flex items-center gap-1`}>
                        <span aria-hidden="true">{meta.emoji}</span>
                        {meta.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">{meta.tagline}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 sm:hidden">{meta.tagline}</p>
                  <LotteryBalls numbers={pred.numbers} booster={pred.booster} size="md" animated={false} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Hot & Cold */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{drawLabel} Hot & Cold Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Hot (Most Drawn)</p>
              <LotteryBalls numbers={hot.slice(0, 7)} size="sm" animated={false} />
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Cold (Least Drawn)</p>
              <LotteryBalls numbers={cold} size="sm" animated={false} />
            </div>
          </div>
        </section>

        {/* Previous Day Performance */}
        {prevResult && (
          <section className="mb-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Previous Prediction Performance</h2>
              <div className={`${theme.bg} rounded-lg p-4`}>
                <p className={`text-sm font-semibold ${theme.text} mb-2`}>
                  {drawLabel} — {formatDate(prevDateStr)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {matches.length > 0 ? (
                    <>Our prediction matched <strong className="text-gray-900 dark:text-white">{matches.length} number{matches.length !== 1 ? 's' : ''}</strong>: {matches.join(', ')}</>
                  ) : (
                    <>No direct matches in yesterday&apos;s {drawLabel} draw. Hot number trends continue to evolve.</>
                  )}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Methodology */}
        <section className="mb-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How these predictions work</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                These <strong className="text-gray-900 dark:text-white">UK 49s {drawLabel} predictions</strong> for {formattedDate} are based on number frequency from the <strong className="text-gray-900 dark:text-white">{drawTime} {drawLabel} draw</strong> only. We don&apos;t mix {drawLabel} data with <Link href={`/blog/uk-49s-${otherDraw}-predictions-${date}`} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">{otherMeta.label} predictions</Link> because the four daily UK 49s draws are separate events.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Each set blends top-hot {drawLabel} numbers with random picks for variety. The Booster is picked separately. Once today&apos;s {drawLabel} results come in, the predictions update. See our <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot &amp; cold numbers</Link> page for the full {drawLabel} breakdown.
              </p>
            </div>
          </div>
        </section>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <Link href={`/blog/uk-49s-${otherDraw}-predictions-${date}`} className={`px-2 sm:px-4 py-3 ${otherTheme.accentBg} ${otherTheme.accentBgHover} text-white rounded-lg font-medium text-center text-xs sm:text-sm leading-tight transition-colors`}>
            {otherMeta.label} Predictions
          </Link>
          <Link href={`/${drawType}-predictions`} className="px-2 sm:px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-center text-xs sm:text-sm leading-tight">
            Live {drawLabel}
          </Link>
          <Link href={`/${drawType}`} className={`px-2 sm:px-4 py-3 ${theme.accentBg} ${theme.accentBgHover} text-white rounded-lg font-medium text-center text-xs sm:text-sm leading-tight transition-colors`}>
            {drawLabel} Results
          </Link>
          <Link href="/hot-cold-numbers" className="px-2 sm:px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-center text-xs sm:text-sm leading-tight">
            Hot & Cold
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 mt-6">
          Disclaimer: Predictions are based on statistical analysis of past results. Lottery draws are random — no prediction guarantees a win. Play responsibly.
        </p>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Blog', url: '/blog' }, { name: `${drawLabel} Predictions ${date}`, url: `/blog/${slug}` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: `UK 49s ${drawLabel} Predictions for ${formattedDate}`,
        datePublished: date, dateModified: date,
        description: `Statistical ${drawLabel} predictions and trend analysis for UK 49s ${drawTime} draw on ${formattedDate}`,
        author: { '@type': 'Person', name: 'UK49s Results Analysis Team', url: 'https://uk49sresults.co.uk/about', jobTitle: 'Lottery Data Analysts', worksFor: { '@type': 'Organization', name: 'UK49s Results', url: 'https://uk49sresults.co.uk' } },
        publisher: { '@type': 'Organization', name: 'UK49s Results', url: 'https://uk49sresults.co.uk' },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: `What are the UK 49s ${drawLabel} predictions for ${formattedDate}?`, acceptedAnswer: { '@type': 'Answer', text: `Our statistical predictions for the ${formattedDate} ${drawLabel} draw use weighted analysis of hot numbers from recent ${drawLabel} draws. We provide 3 unique prediction sets.` } },
          { '@type': 'Question', name: `How are ${drawLabel} predictions calculated?`, acceptedAnswer: { '@type': 'Answer', text: `Predictions analyse number frequency from recent ${drawLabel} draws only. Top hot numbers are blended with random picks for balance. ${drawLabel} data is kept separate from the other three daily UK 49s draws.` } },
        ],
      }) }} />
    </div>
  );
}
