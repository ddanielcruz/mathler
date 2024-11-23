import { Guess as GuessType } from '@/contexts/game';

import { GuessKey } from './guess-key';

interface GuessProps {
  guess: GuessType;
}

export function Guess({ guess: { guess, state } }: GuessProps) {
  const guessKeys = Array.from({ length: 6 }).map((_, index) => {
    return guess[index] ?? '';
  });

  return (
    <div className="flex gap-1.5">
      {guessKeys.map((key, index) => (
        <GuessKey key={index} value={key} active={state === 'in-progress'} />
      ))}
    </div>
  );
}
