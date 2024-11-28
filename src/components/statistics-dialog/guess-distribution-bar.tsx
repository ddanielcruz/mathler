import { cn } from '@/lib/tailwind';

interface GuessDistributionBarProps {
  count: number;
  isMax: boolean;
  total: number;
}

export function GuessDistributionBar({ count, isMax, total }: GuessDistributionBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex gap-1">
      <div className="w-3 text-sm">{count}</div>
      <div
        className={cn(
          'h-5 min-w-4 rounded px-1.5 text-right text-sm text-white',
          isMax ? 'bg-green-500' : 'bg-gray-500',
        )}
        style={{ width: `${Math.max(percentage, 8)}%` }}
      >
        {count}
      </div>
    </div>
  );
}
