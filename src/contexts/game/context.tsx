import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import { getDailyEquation } from '@/utils/equations';

import { GUESS_LENGTH, GUESSES_COUNT } from './constants';
import { isGuessKey, KeyboardKey } from './keys';
import { GameContextType, GameState } from './types';

const GameContext = createContext<GameContextType | null>(null);

const initialGameState: GameState = {
  equationResult: 0,
  guesses: Array.from({ length: GUESSES_COUNT }).map((_, index) => ({
    guess: [],
    state: index === 0 ? 'in-progress' : 'not-played',
  })),
  keys: {},
};

export function GameProvider({ children }: { children: ReactNode }) {
  const { result } = getDailyEquation();
  const [guesses, setGuesses] = useState(initialGameState.guesses);
  const [keys, _setKeys] = useState(initialGameState.keys);

  const handleKeyPress = useCallback(
    (key: KeyboardKey) => {
      // Find the current guess in progress
      const currentGuess = guesses.find((guess) => guess.state === 'in-progress');
      if (!currentGuess) {
        return;
      }

      // Append key to current guess
      const updatedGuess = [...currentGuess.guess];
      if (isGuessKey(key)) {
        if (updatedGuess.length < GUESS_LENGTH) {
          updatedGuess.push({ key, state: null });
        }
      } else if (key === 'Enter') {
        // TODO Submit guess
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
    [guesses],
  );

  return (
    <GameContext.Provider
      value={{
        guesses,
        keys,
        equationResult: result,
        onKeyPress: handleKeyPress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
}
