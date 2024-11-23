import { Guess as GuessType } from '@/contexts/game';
import { cn } from '@/lib/tailwind';

interface GuessProps {
  guess: GuessType;
}

export function Guess({ guess: { guess, state } }: GuessProps) {
  const keys = Array.from({ length: 6 }).map((_, index) => {
    return guess[index] ?? '';
  });

  return (
    <div className="flex gap-1.5">
      {keys.map((key, index) => (
        <div
          key={index}
          className={cn(
            'flex size-12 items-center justify-center rounded-2xl bg-white/20 text-3xl text-white/50 sm:size-14',
            state === 'in-progress' && 'bg-white text-blue-700',
          )}
        >
          <span>{key}</span>
        </div>
      ))}
    </div>
  );
}
