import LotteryBalls from './LotteryBalls';
import { UK49sResult, DRAW_META, DrawType } from '@/lib/types';

interface ResultCardProps {
  result: UK49sResult;
  showDate?: boolean;
  featured?: boolean;
}

const BADGE_THEME: Record<DrawType, string> = {
  brunchtime: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  lunchtime: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  drivetime: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  teatime: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
};

export default function ResultCard({ result, showDate = true, featured = false }: ResultCardProps) {
  const meta = DRAW_META[result.drawType];
  const bgClass = featured
    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800'
    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  const formattedDate = new Date(result.date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`rounded-xl border-2 ${bgClass} p-4 sm:p-6 transition-all hover:shadow-lg`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${BADGE_THEME[result.drawType]}`}>
              {meta.label}
            </span>
            {featured && (
              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                LATEST
              </span>
            )}
          </div>
          {showDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Draw Time: {meta.ukDrawTime} (UK)
        </div>
      </div>

      <LotteryBalls numbers={result.numbers} booster={result.booster} size={featured ? 'lg' : 'md'} animated={featured} />

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>Numbers: {result.numbers.join(', ')}</span>
        <span>Booster: {result.booster}</span>
      </div>
    </div>
  );
}
