import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestResults } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL, ogMeta } from '@/lib/data/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import NumberCheckerForm from './NumberCheckerForm';

const pageTitle = `UK 49s Number Checker — Did Your Numbers Win? | ${SITE_NAME}`;
const pageDesc = 'Paste your UK 49s numbers and instantly check how many times they would have won across recent Lunchtime and Teatime draws. Free, no sign-up.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDesc,
  alternates: { canonical: '/check' },
  ...ogMeta(pageTitle, pageDesc, '/check'),
};

export const revalidate = 60;

export default async function CheckPage() {
  const results = await getLatestResults();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-emerald-600">Home</Link></li>
          <li><span className="mx-1">/</span></li>
          <li className="text-gray-900 dark:text-white font-medium">Number Checker</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Number Checker
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        Tap the numbers you bet on. We&apos;ll check them against the last {results.length} draws and tell you how often they would have won.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <time dateTime={new Date().toISOString()}>Updated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time> · Based on {results.length} recent draws
      </p>

      <NumberCheckerForm results={results} />

      {/* SEO Content */}
      <section className="mt-12">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How the checker works</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Pick the numbers you bet on (1 to 5). The checker scans every UK 49s draw we have on file and shows you which draws contained those numbers. You&apos;ll also see how many full matches your selection would have hit, and the percentage of draws where it matched.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What counts as a match?</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Each UK 49s draw produces 6 main numbers plus a Booster ball. If you bet on 3 numbers and all 3 came up in the main 6, that&apos;s a full <strong>3/3 match</strong>. The checker also shows partial matches when you&apos;ve picked 1 or 2 numbers, in case you want to see how often any of your picks have come up.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">A reality check</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Past matches don&apos;t mean future ones. UK 49s draws are independent random events. Use this tool to double-check old tickets or to see how a strategy would have played out historically. See <Link href="/odds" className="text-emerald-600 dark:text-emerald-400 hover:underline">odds and payouts</Link> for the actual chance of winning each bet type. Always play responsibly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Other tools you might like</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg aria-hidden="true" className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Hot &amp; cold numbers</Link> — see which numbers come up most</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg aria-hidden="true" className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Number generator</Link> — random picks if you can&apos;t decide</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg aria-hidden="true" className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Predictions</Link> — statistically informed number sets</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg aria-hidden="true" className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span><Link href="/history" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Past results</Link> — full archive by date</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: 'Number Checker', url: '/check' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(pageTitle, pageDesc, '/check')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I check if my UK 49s numbers won?',
            acceptedAnswer: { '@type': 'Answer', text: 'Use this number checker. Tap the numbers you bet on (1 to 5), optionally add a Booster pick, and click "Check my numbers". The tool will scan recent UK 49s Lunchtime and Teatime draws and show how often your selection would have hit.' },
          },
          {
            '@type': 'Question',
            name: 'How many past draws does the UK 49s checker scan?',
            acceptedAnswer: { '@type': 'Answer', text: `The checker scans the most recent ${results.length} UK 49s draws across both Lunchtime (12:49 PM) and Teatime (5:49 PM). You can filter by draw type if you only bet on one of them.` },
          },
          {
            '@type': 'Question',
            name: 'Does past performance predict future UK 49s wins?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Each UK 49s draw is an independent random event. The checker shows historical hit rates so you can see how a number selection would have done, but it cannot tell you what will happen in future draws.' },
          },
        ],
      }) }} />
    </div>
  );
}
