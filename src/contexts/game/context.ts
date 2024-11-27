import { createContext } from 'react';

import { GUESSES_COUNT } from './constants';
import { GameContextState, GameContextType } from './types';

export const GameContext = createContext<GameContextType | null>(null);

export const initialGameState: GameContextState = {
  equationResult: 0,
  guesses: Array.from({ length: GUESSES_COUNT }).map((_, index) => ({
    guess: [],
    state: index === 0 ? 'in-progress' : 'not-played',
  })),
  keys: {},
  error: null,
  status: 'in-progress',
};
