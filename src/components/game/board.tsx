import { Guess as GuessType } from '@/contexts/game';

import { Guess } from './guess';

export function Board() {
  const guesses = Array.from({ length: 6 }).map<GuessType>((_, index) => {
    if (index === 0) {
      return { guess: '12*2+4', state: 'submitted' };
    }

    if (index === 1) {
      return { guess: '26+4-2', state: 'in-progress' };
    }

    return { guess: '', state: 'not-played' };
  });

  return (
    <div className="flex flex-col gap-1.5">
      {guesses.map((guess, index) => (
        <Guess key={index} guess={guess} />
      ))}
    </div>
  );
}
