import { useGame } from '@/contexts/game';

import { Guess } from './guess';

export function Guesses() {
  const { guesses } = useGame();

  return (
    <div className="flex flex-col gap-1.5">
      {guesses.map((guess, index) => (
        <Guess key={index} guess={guess} />
      ))}
    </div>
  );
}
