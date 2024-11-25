import { createContext, ReactNode, useContext, useState } from 'react';

import { getDailyEquation } from '@/lib/equations';

import { GameState } from './types';

const GameContext = createContext<GameState | null>(null);

const initialGameState: GameState = {
  equationResult: 0,
  guesses: Array.from({ length: 6 }).map((_, index) => ({
    guess: '',
    state: index === 0 ? 'in-progress' : 'not-played',
  })),
  keys: {},
};

export function GameProvider({ children }: { children: ReactNode }) {
  const { result } = getDailyEquation();
  const [guesses, _setGuesses] = useState(initialGameState.guesses);
  const [keys, _setKeys] = useState(initialGameState.keys);

  return (
    <GameContext.Provider value={{ guesses, keys, equationResult: result }}>
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
