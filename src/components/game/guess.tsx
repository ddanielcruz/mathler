import { Guess as GuessType } from '@/contexts/game';
import { GUESS_LENGTH } from '@/contexts/game/constants';
import { cn } from '@/lib/tailwind';

import { GuessKey } from './guess-key';

interface GuessProps {
  guess: GuessType;
  className?: string;
}

export function Guess({ guess: { guess, state }, className }: GuessProps) {
  const guessKeys = Array.from({ length: GUESS_LENGTH }).map((_, index) => {
    const key = guess[index];
    return {
      value: key?.key ?? '',
      state: key?.state ?? null,
    };
  });

  return (
    <div className={cn('relative flex gap-1.5', className)} data-testid="guess" data-state={state}>
      {guessKeys.map((key, index) => (
        <GuessKey key={index} active={state === 'in-progress'} {...key} />
      ))}
    </div>
  );
}
