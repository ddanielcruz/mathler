import { ReactNode, useCallback } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { initialStatistics, StatisticsContext } from './context';
import { Statistics } from './types';

const STORAGE_KEY = '@mathler/statistics';

export function StatisticsProvider({ children }: { children: ReactNode }) {
  const [statistics, setStatistics] = useLocalStorage<Statistics>(STORAGE_KEY, initialStatistics);

  const addGameResult = useCallback(
    (won: boolean, guessCount: number) => {
      setStatistics((prev) => {
        // Calculate new games played and wins
        const gamesPlayed = prev.gamesPlayed + 1;
        const gamesWon = won ? prev.gamesWon + 1 : prev.gamesWon;

        // Calculate new streaks
        const currentStreak = won ? prev.currentStreak + 1 : 0;
        const bestStreak = Math.max(currentStreak, prev.bestStreak);

        // Update guess distribution if game was won
        const guessDistribution = { ...prev.guessDistribution };
        if (won && guessCount >= 1 && guessCount <= 6) {
          guessDistribution[guessCount as keyof typeof guessDistribution]++;
        }

        return {
          gamesPlayed,
          gamesWon,
          currentStreak,
          bestStreak,
          guessDistribution,
        };
      });
    },
    [setStatistics],
  );

  return (
    <StatisticsContext.Provider
      value={{
        statistics,
        addGameResult,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
}
