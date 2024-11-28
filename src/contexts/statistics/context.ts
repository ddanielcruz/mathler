import { createContext } from 'react';

import { GuessDistribution, Statistics, StatisticsContextType } from './types';

export const initialGuessDistribution: GuessDistribution = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

export const initialStatistics: Statistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  guessDistribution: initialGuessDistribution,
};

export const StatisticsContext = createContext<StatisticsContextType | null>(null);
