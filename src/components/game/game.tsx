import { useGame } from '@/contexts/game';

import { Guesses } from './guesses';
import { Keyboard } from './keyboard';

export function Game() {
  const { equationResult } = useGame();

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-center text-xl font-medium text-white">
        Find the hidden calculation that{' '}
        <div className="mx-auto w-fit rounded-lg bg-amber-500 px-1 sm:inline-flex">
          equals {equationResult}
        </div>
      </h2>

      <Guesses />
      <Keyboard />
    </div>
  );
}
