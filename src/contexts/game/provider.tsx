import { ReactNode, useCallback, useMemo, useState } from 'react';

import { getDailyEquation } from '@/utils/equations';

import { GUESS_LENGTH, GUESSES_COUNT } from './constants';
import { GameContext } from './context';
import { isGuessKey, KeyboardKey } from './keys';
import { GameState } from './types';
import { isValidEquation } from './validation';

// TODO Move to separate file
const initialGameState: GameState = {
  equationResult: 0,
  guesses: Array.from({ length: GUESSES_COUNT }).map((_, index) => ({
    guess: [],
    state: index === 0 ? 'in-progress' : 'not-played',
  })),
  keys: {},
  error: null,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const { result: equationResult } = getDailyEquation();
  const [guesses, setGuesses] = useState(initialGameState.guesses);
  const [keys, _setKeys] = useState(initialGameState.keys);
  const [error, setError] = useState(initialGameState.error);

  const currentGuess = useMemo(
    () => guesses.find((guess) => guess.state === 'in-progress') ?? null,
    [guesses],
  );

  const handleValidateEquation = useCallback(() => {
    if (!currentGuess) {
      return;
    }

    const equation = currentGuess.guess.map((key) => key.key).join('');
    const error = isValidEquation(equation, equationResult);

    if (error) {
      setError(error);
      return;
    }
  }, [currentGuess, equationResult]);

  const handleKeyPress = useCallback(
    (key: KeyboardKey) => {
      if (!currentGuess) {
        return;
      }

      // Clear error on key press
      setError(null);

      if (key === 'Enter') {
        handleValidateEquation();
        return;
      }

      // Append key to current guess
      const updatedGuess = [...currentGuess.guess];
      if (isGuessKey(key)) {
        if (updatedGuess.length < GUESS_LENGTH) {
          updatedGuess.push({ key, state: null });
        }
      } else if (key === 'Delete') {
        // Delete last key
        updatedGuess.pop();
      }

      // Update the guesses
      setGuesses((prevGuesses) =>
        prevGuesses.map((guess) =>
          guess === currentGuess ? { ...guess, guess: updatedGuess } : guess,
        ),
      );
    },
    [currentGuess, handleValidateEquation],
  );

  return (
    <GameContext.Provider
      value={{
        guesses,
        keys,
        equationResult,
        error,
        onKeyPress: handleKeyPress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
