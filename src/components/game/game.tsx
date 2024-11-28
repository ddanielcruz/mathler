import ConfettiExplosion from 'react-confetti-explosion';
import { useLocalStorage } from 'usehooks-ts';

import { useGame } from '@/contexts/game';
import { GameStorageKeys } from '@/contexts/game/storage';

import { Alert } from '../ui/alert';
import { Guesses } from './guesses';
import { Keyboard } from './keyboard';

export function Game() {
  const { equationResult, error, status } = useGame();
  const [showedConfetti, setShowedConfetti] = useLocalStorage(GameStorageKeys.confetti, false);

  return (
    <div className="flex flex-col items-center gap-8 sm:relative">
      {status === 'won' && !showedConfetti && (
        <div className="pointer-events-none absolute inset-y-0">
          <ConfettiExplosion
            particleCount={300}
            data-testid="confetti"
            onComplete={() => setShowedConfetti(true)}
          />
        </div>
      )}

      <h2 className="text-center text-xl font-medium text-white">
        Find the hidden calculation that{' '}
        <div className="mx-auto w-fit rounded-lg bg-amber-500 px-1 sm:inline-flex">
          equals {equationResult}
        </div>
      </h2>

      {error && (
        <Alert
          variant="error"
          // TODO Detect notch and adjust alert position
          className="fixed inset-x-4 top-0 z-10 sm:absolute sm:inset-x-auto sm:-top-3 sm:w-full sm:max-w-lg"
        >
          {error}
        </Alert>
      )}

      <Guesses />
      <Keyboard />
    </div>
  );
}
