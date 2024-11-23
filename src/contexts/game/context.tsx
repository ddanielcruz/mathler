import { createContext, ReactNode, useContext, useState } from 'react';

import { GameState } from './types';

const GameContext = createContext<GameState | null>(null);

const initialGameState: GameState = {
  equationResult: '75',
  guesses: Array.from({ length: 6 }).map((_, index) => {
    if (index === 0) {
      return {
        guess: '7*10+5',
        state: 'submitted',
      };
    }

    if (index === 1) {
      return {
        guess: '17',
        state: 'in-progress',
      };
    }

    return {
      guess: '',
      state: 'not-played',
    };
  }),
  keys: {
    '0': 'absent',
    '1': 'present',
    '5': 'absent',
    '7': 'present',
    '*': 'present',
    '+': 'correct',
    '-': 'absent',
  },
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, _setGameState] = useState(initialGameState);

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
}
