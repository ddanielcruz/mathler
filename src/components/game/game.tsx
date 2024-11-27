import { useGame } from '@/contexts/game';

import { Alert } from '../ui/alert';
import { Guesses } from './guesses';
import { Keyboard } from './keyboard';

export function Game() {
  const { equationResult, error } = useGame();

  return (
    <div className="relative flex flex-col items-center gap-8">
      <h2 className="text-center text-xl font-medium text-white">
        Find the hidden calculation that{' '}
        <div className="mx-auto w-fit rounded-lg bg-amber-500 px-1 sm:inline-flex">
          equals {equationResult}
        </div>
      </h2>

      {error && (
        <Alert variant="error" className="w-full max-w-xl">
          {error}
        </Alert>
      )}

      <Guesses />
      <Keyboard />
    </div>
  );
}
