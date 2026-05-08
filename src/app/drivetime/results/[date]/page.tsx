import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import LotteryBalls from '@/components/LotteryBalls';
import { getResultByDate, getRecentDates, getLatestResults, getHotNumbers, getColdNumbers } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const result = await getResultByDate(date, 'drivetime');
  const numbersText = result ? `Winning numbers: ${result.numbers.join(', ')} + Booster ${result.booster}. ` : '';
  const ogNumbers = result ? result.numbers.join(',') : '';
  const ogBooster = result ? String(result.booster) : '';

  return {
    title: `UK 49s Drivetime Results ${formattedDate} | ${SITE_NAME}`,
    description: `UK 49s Drivetime draw results for ${formattedDate}. ${numbersText}Full analysis, hot & cold numbers, and draw breakdown.`,
    alternates: {
      canonical: `${SITE_URL}/drivetime/results/${date}`,
    },
    openGraph: {
      title: `UK 49s Drivetime Results — ${formattedDate}`,
      description: `${numbersText}Full draw analysis and hot number breakdown.`,
      type: 'article',
      images: [{
        url: `${SITE_URL}/api/og?title=${encodeURIComponent(`Drivetime Results — ${formattedDate}`)}&subtitle=${encodeURIComponent('UK 49s Winning Numbers')}&type=result&numbers=${ogNumbers}&booster=${ogBooster}`,
        width: 1200,
        height: 630,
        alt: `UK 49s Drivetime Results for ${formattedDate}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `UK 49s Drivetime Results — ${formattedDate}`,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(`Drivetime Results — ${formattedDate}`)}&subtitle=${encodeURIComponent('UK 49s Winning Numbers')}&type=result&numbers=${ogNumbers}&booster=${ogBooster}`],
    },
  };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const dates = await getRecentDates();
  return dates.map(date => ({ date }));
}

export default async function DrivetimeResultPage({ params }: Props) {
  const { date } = await params;
  const result = await getResultByDate(date, 'drivetime');
  const allDrivetime = await getLatestResults('drivetime');
  const hot = getHotNumbers(allDrivetime, 7);
  const cold = getColdNumbers(allDrivetime, 7);

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const hotMatches = result ? result.numbers.filter(n => hot.includes(n)) : [];
  const coldMatches = result ? result.numbers.filter(n => cold.includes(n)) : [];

  const faqSchema = result ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What were the UK 49s Drivetime results on ${formattedDate}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The UK 49s Drivetime winning numbers on ${formattedDate} were ${result.numbers.join(', ')} with Booster ball ${result.booster}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What time was the UK 49s Drivetime draw on ${formattedDate}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The UK 49s Drivetime draw on ${formattedDate} took place at 4:49 PM UK time, as scheduled every day.`,
        },
      },
      {
        '@type': 'Question',
        name: `Were any hot numbers drawn in the UK 49s Drivetime on ${formattedDate}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: hotMatches.length > 0
            ? `Yes, ${hotMatches.length} hot number${hotMatches.length !== 1 ? 's were' : ' was'} drawn: ${hotMatches.join(', ')}. Hot numbers are those drawn more frequently than average in recent draws.`
            : `No currently hot numbers appeared in this draw. Hot numbers are based on recent frequency trends and change after each draw.`,
        },
      },
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/drivetime" className="hover:text-emerald-600">Drivetime</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{formattedDate}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        UK 49s Drivetime Results — {formattedDate}
      </h1>

      {result ? (
        <>
          <section className="mb-8">
            <ResultCard result={result} featured showDate={false} />
          </section>

          <section className="mb-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Draw Summary</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                The <strong className="text-gray-900 dark:text-white">UK 49s Drivetime</strong> draw on <strong className="text-gray-900 dark:text-white">{formattedDate}</strong> produced the winning numbers{' '}
                <strong className="text-gray-900 dark:text-white">{result.numbers.join(', ')}</strong> with Booster ball <strong className="text-gray-900 dark:text-white">{result.booster}</strong>.
                The draw took place at {result.drawTime} UK time as scheduled.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Players who matched all 6 numbers would have won the top prize. The Booster ball ({result.booster}) provides additional winning opportunities for players who included the Booster option in their bet.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hot Number Analysis</h2>
              {hotMatches.length > 0 ? (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  <strong className="text-gray-900 dark:text-white">{hotMatches.length}</strong> of today&apos;s winning numbers ({hotMatches.join(', ')}) are currently classified as <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Hot</span> numbers — drawn more frequently than average in recent Drivetime draws.
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  None of today&apos;s winning numbers are currently in the hot numbers list. This is a reminder that each draw is independent and random — past frequency patterns don&apos;t determine future results.
                </p>
              )}
              {coldMatches.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  <strong className="text-gray-900 dark:text-white">{coldMatches.length}</strong> cold number{coldMatches.length !== 1 ? 's' : ''} appeared: {coldMatches.join(', ')}. Cold numbers are those drawn less frequently than average.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Current Hot Numbers (Most Drawn)</p>
                  <LotteryBalls numbers={hot} size="sm" animated={false} />
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">Current Cold Numbers (Least Drawn)</p>
                  <LotteryBalls numbers={cold} size="sm" animated={false} />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the UK 49s Drivetime Draw</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The <strong className="text-gray-900 dark:text-white">UK 49s Drivetime</strong> draw takes place every day at <strong className="text-gray-900 dark:text-white">4:49 PM</strong> UK time. Six main numbers are drawn from a pool of 1 to 49, followed by a <strong className="text-gray-900 dark:text-white">Booster ball</strong>. Players can choose to bet on 1 to 5 numbers with various prize tiers. Check our <Link href="/odds" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">odds and payouts</Link> page for full details on how betting works.
              </p>
            </div>
          </section>
        </>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center mb-8">
          <p className="text-yellow-800 dark:text-yellow-300">
            Results for this date are not available yet. Please check back later.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/drivetime"
          className="px-4 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium text-center text-sm"
        >
          All Drivetime Results
        </Link>
        <Link
          href={`/teatime/results/${date}`}
          className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-center text-sm"
        >
          Teatime {date}
        </Link>
        <Link
          href="/drivetime-predictions"
          className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-center text-sm"
        >
          Drivetime Predictions
        </Link>
        <Link
          href="/hot-cold-numbers"
          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-center text-sm"
        >
          Hot & Cold Numbers
        </Link>
      </div>
    </div>
  );
}
