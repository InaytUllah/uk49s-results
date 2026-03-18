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
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-18 h-18 text-2xl',
  };

  const numbersLabel = numbers.join(', ') + (booster !== undefined ? ` + Booster ${booster}` : '');

  return (
    <div
      className="flex flex-wrap items-center gap-2 sm:gap-3"
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
          <span className="text-gray-400 font-bold text-lg mx-1" aria-hidden="true">+</span>
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
