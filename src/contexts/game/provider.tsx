import { ReactNode, useCallback, useMemo, useState } from 'react';

import { getDailyEquation } from '@/utils/equations';

import { GUESS_LENGTH } from './constants';
import { GameContext, initialGameState } from './context';
import { isGuessKey, KeyboardKey } from './keys';
import { Guess } from './types';
import { getGuessSolutionMap, isValidEquation } from './validation';

export function GameProvider({ children }: { children: ReactNode }) {
  const { equation, cumulativeEquations, result: equationResult } = getDailyEquation();
  const [guesses, setGuesses] = useState(initialGameState.guesses);
  const [keys, setKeys] = useState(initialGameState.keys);
  const [error, setError] = useState(initialGameState.error);
  const status = useMemo(() => {
    if (guesses.some((guess) => guess.state === 'correct')) {
      return 'win';
    }

    return guesses.some((guess) => guess.state === 'in-progress') ? 'in-progress' : 'lose';
  }, [guesses]);

  const currentGuess = useMemo(
    () => guesses.find((guess) => guess.state === 'in-progress') ?? null,
    [guesses],
  );

  const handleValidateEquation = useCallback(() => {
    if (!currentGuess) {
      return;
    }

    const userEquation = currentGuess.guess.map((key) => key.key).join('');
    const error = isValidEquation(userEquation, equationResult);

    if (error) {
      setError(error);
      return;
    }

    const isCorrect = userEquation === equation || cumulativeEquations.includes(userEquation);
    const solutionMap = getGuessSolutionMap(
      currentGuess.guess.map((guess) => guess.key),
      equation,
    );

    // Update guess with the solution map
    const updatedGuess: Guess = {
      state: isCorrect ? 'correct' : 'submitted',
      guess: solutionMap,
    };

    // Update guesses and mark the next guess as in-progress if the current guess is incorrect
    const guessIndex = guesses.findIndex((guess) => guess === currentGuess);
    const nextGuessIndex = guessIndex + 1;

    setGuesses((prevGuesses) =>
      prevGuesses.map((guess, index) => {
        if (index === guessIndex) {
          return updatedGuess;
        }

        if (!isCorrect && index === nextGuessIndex) {
          return { ...guess, state: 'in-progress' };
        }

        return guess;
      }),
    );

    // Update keyboard keys
    setKeys((prevKeys) => {
      const keysMap: typeof prevKeys = { ...prevKeys };
      solutionMap.forEach(({ key, state }) => {
        // Update key only if it's not present or new state is correct
        if (!keysMap[key] || state === 'correct') {
          keysMap[key] = state;
        }
      });

      return keysMap;
    });
  }, [cumulativeEquations, currentGuess, equation, equationResult, guesses]);

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
        status,
        onKeyPress: handleKeyPress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
