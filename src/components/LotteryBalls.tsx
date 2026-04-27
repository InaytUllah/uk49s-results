'use client';

interface LotteryBallsProps {
  numbers: number[];
  booster?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

function getBallColor(num: number): string {
  if (num <= 9) return 'from-red-500 to-red-600';
  if (num <= 19) return 'from-orange-500 to-orange-600';
  if (num <= 29) return 'from-yellow-500 to-yellow-600';
  if (num <= 39) return 'from-green-500 to-green-600';
  return 'from-blue-500 to-blue-600';
}

export default function LotteryBalls({ numbers, booster, size = 'md', animated = true }: LotteryBallsProps) {
  // Mobile-first sizing: smaller on narrow viewports, full size on tablet+
  // Computed widths for "md" with 7 items + 6 gaps:
  //   mobile  : 7×40 + 6×4  = 304px (fits 320px viewport)
  //   sm 640+ : 7×48 + 6×8  = 384px
  //   md 768+ : 7×56 + 6×12 = 464px
  const sizeClasses = {
    sm: 'w-9 h-9 text-xs sm:w-10 sm:h-10 sm:text-sm',
    md: 'w-10 h-10 text-sm sm:w-12 sm:h-12 sm:text-base md:w-14 md:h-14 md:text-lg',
    lg: 'w-12 h-12 text-base sm:w-14 sm:h-14 sm:text-lg md:w-18 md:h-18 md:text-2xl',
  };

  const numbersLabel = numbers.join(', ') + (booster !== undefined ? ` + Booster ${booster}` : '');

  return (
    <div
      className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3"
      role="img"
      aria-label={`Lottery balls: ${numbersLabel}`}
    >
      {numbers.map((num, i) => (
        <div
          key={`${num}-${i}`}
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getBallColor(num)} text-white font-bold flex items-center justify-center shadow-lg ${animated ? 'motion-safe:animate-bounce' : ''}`}
          style={animated ? { animationDelay: `${i * 0.1}s`, animationDuration: '0.6s', animationIterationCount: '1' } : undefined}
          aria-label={`Ball number ${num}`}
        >
          {num}
        </div>
      ))}
      {booster !== undefined && (
        <>
          <span className="text-gray-400 font-bold text-base sm:text-lg mx-0.5 sm:mx-1" aria-hidden="true">+</span>
          <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold flex items-center justify-center shadow-lg ring-2 ring-purple-300 ${animated ? 'motion-safe:animate-bounce' : ''}`}
            style={animated ? { animationDelay: `${numbers.length * 0.1}s`, animationDuration: '0.6s', animationIterationCount: '1' } : undefined}
            aria-label={`Booster ball number ${booster}`}
          >
            {booster}
          </div>
        </>
      )}
    </div>
  );
}
