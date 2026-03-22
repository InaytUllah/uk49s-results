import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import { getResultByDate, getRecentDates } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return {
    title: `UK 49s Teatime Results ${formattedDate} | ${SITE_NAME}`,
    description: `UK 49s Teatime winning numbers for ${formattedDate}. Check the draw results and Booster ball.`,
    alternates: {
      canonical: `${SITE_URL}/teatime/results/${date}`,
    },
  };
}

export const revalidate = 60;
export const dynamicParams = true; // Allow new dates to be generated on-demand via ISR

export async function generateStaticParams() {
  const dates = await getRecentDates();
  return dates.map(date => ({ date }));
}

export default async function TeatimeResultPage({ params }: Props) {
  const { date } = await params;
  const result = await getResultByDate(date, 'teatime');

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/teatime" className="hover:text-emerald-600">Teatime</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{formattedDate}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        UK 49s Teatime Results — {formattedDate}
      </h1>

      {result ? (
        <ResultCard result={result} featured showDate={false} />
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
          <p className="text-yellow-800 dark:text-yellow-300">
            Results for this date are not available yet. Please check back later.
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link
          href="/teatime"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
        >
          All Teatime Results
        </Link>
        <Link
          href={`/lunchtime/results/${date}`}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          Lunchtime Results for {date}
        </Link>
      </div>
    </div>
  );
}
