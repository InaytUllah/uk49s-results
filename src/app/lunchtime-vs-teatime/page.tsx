import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { getLatestResults, calculateFrequency, getHotNumbers, getColdNumbers } from '@/lib/data/draws';
import { SITE_NAME, SITE_URL } from '@/lib/data/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `UK 49s Lunchtime vs Teatime - Which Draw Has Better Odds? | ${SITE_NAME}`,
  description: 'Compare UK 49s Lunchtime and Teatime draws. See which numbers appear more in each draw, hot and cold number differences, and statistical analysis.',
  alternates: {
    canonical: `${SITE_URL}/lunchtime-vs-teatime`,
  },
};

function getBallColor(num: number): string {
  if (num <= 9) return 'from-red-500 to-red-600';
  if (num <= 19) return 'from-orange-500 to-orange-600';
  if (num <= 29) return 'from-yellow-500 to-yellow-600';
  if (num <= 39) return 'from-green-500 to-green-600';
  return 'from-blue-500 to-blue-600';
}

export default async function LunchtimeVsTeatimePage() {
  const allResults = await getLatestResults();
  const lunchtimeResults = allResults.filter(r => r.drawType === 'lunchtime');
  const teatimeResults = allResults.filter(r => r.drawType === 'teatime');

  const freqLunch = calculateFrequency(lunchtimeResults);
  const freqTea = calculateFrequency(teatimeResults);

  const hotLunch = getHotNumbers(lunchtimeResults, 7);
  const coldLunch = getColdNumbers(lunchtimeResults, 7);
  const hotTea = getHotNumbers(teatimeResults, 7);
  const coldTea = getColdNumbers(teatimeResults, 7);

  // Find numbers that appear significantly more in one draw vs the other
  const differences: { num: number; lunchCount: number; teaCount: number; diff: number; favours: 'lunchtime' | 'teatime' }[] = [];
  for (let i = 1; i <= 49; i++) {
    const lc = freqLunch.get(i) || 0;
    const tc = freqTea.get(i) || 0;
    const diff = Math.abs(lc - tc);
    if (diff > 0) {
      differences.push({
        num: i,
        lunchCount: lc,
        teaCount: tc,
        diff,
        favours: lc > tc ? 'lunchtime' : 'teatime',
      });
    }
  }
  differences.sort((a, b) => b.diff - a.diff);

  // Numbers unique to each draw's hot list
  const onlyHotLunch = hotLunch.filter(n => !hotTea.includes(n));
  const onlyHotTea = hotTea.filter(n => !hotLunch.includes(n));
  const sharedHot = hotLunch.filter(n => hotTea.includes(n));

  // Average frequency calculation
  const lunchCounts = [...freqLunch.values()];
  const teaCounts = [...freqTea.values()];
  const avgLunch = lunchCounts.reduce((a, b) => a + b, 0) / lunchCounts.length;
  const avgTea = teaCounts.reduce((a, b) => a + b, 0) / teaCounts.length;

  // Max count for bars
  const maxCount = Math.max(...lunchCounts, ...teaCounts, 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Lunchtime vs Teatime</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        UK 49s Lunchtime vs Teatime
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Statistical comparison of the two daily UK 49s draws. See how numbers perform differently across Lunchtime and Teatime.
      </p>

      {/* Draw Times Comparison */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Draw Times</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-2">Lunchtime Draw</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">12:49 PM</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">UK Time (GMT/BST)</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {lunchtimeResults.length} recent draws analysed
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">Teatime Draw</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">5:49 PM</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">UK Time (GMT/BST)</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {teatimeResults.length} recent draws analysed
            </p>
          </div>
        </div>
      </section>

      {/* Hot Numbers Comparison */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hot Numbers Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-3">Lunchtime Hot Numbers</h3>
            <LotteryBalls numbers={hotLunch} size="md" animated={false} />
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
            <h3 className="font-bold text-indigo-700 dark:text-indigo-400 mb-3">Teatime Hot Numbers</h3>
            <LotteryBalls numbers={hotTea} size="md" animated={false} />
          </div>
        </div>

        {/* Venn-style breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {onlyHotLunch.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Only Hot in Lunchtime</h4>
              <LotteryBalls numbers={onlyHotLunch} size="sm" animated={false} />
            </div>
          )}
          {sharedHot.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Hot in Both Draws</h4>
              <LotteryBalls numbers={sharedHot} size="sm" animated={false} />
            </div>
          )}
          {onlyHotTea.length > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Only Hot in Teatime</h4>
              <LotteryBalls numbers={onlyHotTea} size="sm" animated={false} />
            </div>
          )}
        </div>
      </section>

      {/* Cold Numbers Comparison */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cold Numbers Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 mb-3">Lunchtime Cold Numbers</h3>
            <LotteryBalls numbers={coldLunch} size="md" animated={false} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 mb-3">Teatime Cold Numbers</h3>
            <LotteryBalls numbers={coldTea} size="md" animated={false} />
          </div>
        </div>
      </section>

      {/* Biggest Differences Table */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Biggest Differences Between Draws
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Numbers that appear significantly more in one draw compared to the other.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left py-3 px-3 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">Number</th>
                <th className="text-center py-3 px-3 font-bold text-amber-700 dark:text-amber-400 border-b-2 border-gray-200 dark:border-gray-700">Lunchtime</th>
                <th className="text-center py-3 px-3 font-bold text-indigo-700 dark:text-indigo-400 border-b-2 border-gray-200 dark:border-gray-700">Teatime</th>
                <th className="text-left py-3 px-3 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">Favours</th>
                <th className="text-left py-3 px-3 font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 hidden sm:table-cell">Comparison</th>
              </tr>
            </thead>
            <tbody>
              {differences.slice(0, 15).map((row, index) => (
                <tr key={row.num} className={`border-b border-gray-100 dark:border-gray-800 ${index % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-850'}`}>
                  <td className="py-3 px-3">
                    <Link href={`/numbers/${row.num}`} className="flex items-center gap-2 hover:underline">
                      <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${getBallColor(row.num)} text-white font-bold flex items-center justify-center text-xs shadow`}>
                        {row.num}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-amber-700 dark:text-amber-400">
                    {row.lunchCount}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-indigo-700 dark:text-indigo-400">
                    {row.teaCount}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.favours === 'lunchtime' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                      {row.favours === 'lunchtime' ? 'Lunch' : 'Tea'} (+{row.diff})
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1 max-w-[200px]">
                      <div className="flex-1 flex justify-end">
                        <div
                          className="h-3 rounded-l-full bg-amber-500"
                          style={{ width: `${maxCount > 0 ? (row.lunchCount / maxCount) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div
                          className="h-3 rounded-r-full bg-indigo-500"
                          style={{ width: `${maxCount > 0 ? (row.teaCount / maxCount) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Statistical Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Lunchtime Stats</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Draws analysed</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{lunchtimeResults.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Avg appearances per number</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{avgLunch.toFixed(1)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Most drawn number</dt>
                <dd className="font-semibold text-amber-700 dark:text-amber-400">{hotLunch[0]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Least drawn number</dt>
                <dd className="font-semibold text-blue-700 dark:text-blue-400">{coldLunch[0]}</dd>
              </div>
            </dl>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Teatime Stats</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Draws analysed</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{teatimeResults.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Avg appearances per number</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{avgTea.toFixed(1)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Most drawn number</dt>
                <dd className="font-semibold text-indigo-700 dark:text-indigo-400">{hotTea[0]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Least drawn number</dt>
                <dd className="font-semibold text-blue-700 dark:text-blue-400">{coldTea[0]}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/lunchtime" className="block bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-amber-700 dark:text-amber-400">Lunchtime Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest Lunchtime draw results</p>
          </Link>
          <Link href="/teatime" className="block bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-indigo-700 dark:text-indigo-400">Teatime Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest Teatime draw results</p>
          </Link>
          <Link href="/predictions" className="block bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Predictions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Predictions for both draws</p>
          </Link>
          <Link href="/numbers" className="block bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400">Number Statistics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Detailed stats for all 49 numbers</p>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="prose dark:prose-invert max-w-none">
        <h2>Lunchtime vs Teatime: Key Differences</h2>
        <p>
          While both the Lunchtime and Teatime UK 49s draws use the same format and number pool,
          the results are completely independent of each other. Over time, certain numbers may
          show patterns of appearing more in one draw than the other, though this is due to
          random variation rather than any systematic bias.
        </p>
        <p>
          Both draws offer identical odds. The mathematical probability of any number being
          drawn is the same whether it is a Lunchtime or Teatime draw. The differences shown
          on this page reflect the natural variation that occurs in random processes over
          a limited sample of draws.
        </p>
        <p>
          Many players enjoy analysing both draws separately to find their preferred betting
          strategies. Whether you focus on one draw or play both, the key is to bet responsibly
          and within your means.
        </p>
      </section>
    </div>
  );
}
