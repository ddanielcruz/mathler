import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useStatistics } from '@/contexts/statistics';
import { getTodayTimestamp } from '@/utils/dates';
import { getDailyEquation } from '@/utils/equations';

import { GUESS_LENGTH } from './constants';
import { GameContext, initialGameState } from './context';
import { isGuessKey, KeyboardKey } from './keys';
import { GameStorageKeys } from './storage';
import { Guess } from './types';
import { getGuessSolutionMap, isValidEquation } from './validation';

export function GameProvider({ children }: { children: ReactNode }) {
  const { equation, cumulativeEquations, result: equationResult } = getDailyEquation();
  const [guesses, setGuesses] = useLocalStorage(GameStorageKeys.guesses, initialGameState.guesses);
  const [keys, setKeys] = useLocalStorage(GameStorageKeys.keys, initialGameState.keys);
  const [error, setError] = useState(initialGameState.error);
  const { addGameResult } = useStatistics();

  const status = useMemo(() => {
    if (guesses.some((guess) => guess.state === 'correct')) {
      return 'won';
    }

    return guesses.some((guess) => guess.state === 'in-progress') ? 'in-progress' : 'lost';
  }, [guesses]);

  const currentGuessIndex = useMemo(() => {
    const index = guesses.findIndex((guess) => guess.state === 'in-progress');
    return index !== -1 ? index : null;
  }, [guesses]);

  // Clear the game state when the daily equation changes
  useEffect(() => {
    const todayTimestamp = getTodayTimestamp().toString();
    const storedTimestamp = localStorage.getItem(GameStorageKeys.timestamp) || todayTimestamp;

    if (storedTimestamp !== todayTimestamp) {
      setGuesses(initialGameState.guesses);
      setKeys(initialGameState.keys);
      localStorage.removeItem(GameStorageKeys.confetti);
    }

    localStorage.setItem(GameStorageKeys.timestamp, todayTimestamp);
  }, [setGuesses, setKeys]);

  const handleValidateEquation = useCallback(() => {
    if (currentGuessIndex === null) {
      return;
    }

    const currentGuess = guesses[currentGuessIndex];
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
    const nextGuessIndex = currentGuessIndex + 1;
    setGuesses((prevGuesses) =>
      prevGuesses.map((guess, index) => {
        if (index === currentGuessIndex) {
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

    // Update statistics when game is won or lost
    const isGameOver = isCorrect || nextGuessIndex >= guesses.length;
    if (isGameOver) {
      addGameResult(isCorrect, currentGuessIndex + 1);
    }
  }, [
    addGameResult,
    currentGuessIndex,
    cumulativeEquations,
    equation,
    equationResult,
    guesses,
    setGuesses,
    setKeys,
  ]);

  const handleKeyPress = useCallback(
    (key: KeyboardKey) => {
      if (currentGuessIndex === null) {
        return;
      }

      // Clear error on key press
      setError(null);

      if (key === 'Enter') {
        handleValidateEquation();
        return;
      }

      // Append key to current guess
      const currentGuess = guesses[currentGuessIndex];
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
        prevGuesses.map((guess, index) => {
          if (index === currentGuessIndex) {
            return { ...guess, guess: updatedGuess };
          }

          return guess;
        }),
      );
    },
    [currentGuessIndex, guesses, handleValidateEquation, setError, setGuesses],
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
