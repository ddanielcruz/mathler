import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { initialStatistics } from './context';
import { useStatistics } from './hooks';
import { StatisticsProvider } from './provider';

function wrapper({ children }: { children: ReactNode }) {
  return <StatisticsProvider>{children}</StatisticsProvider>;
}

describe('StatisticsProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useStatistics(), { wrapper });
    expect(result.current.statistics).toEqual(initialStatistics);
  });

  describe('addGameResult', () => {
    it('should update statistics when game is won', () => {
      const { result } = renderHook(() => useStatistics(), { wrapper });

      act(() => {
        result.current.addGameResult(true, 3);
      });

      expect(result.current.statistics).toEqual({
        gamesPlayed: 1,
        gamesWon: 1,
        currentStreak: 1,
        bestStreak: 1,
        guessDistribution: {
          ...initialStatistics.guessDistribution,
          3: 1,
        },
      });
    });

    it('should update statistics when game is lost', () => {
      const { result } = renderHook(() => useStatistics(), { wrapper });

      act(() => {
        result.current.addGameResult(false, 6);
      });

      expect(result.current.statistics).toEqual({
        gamesPlayed: 1,
        gamesWon: 0,
        currentStreak: 0,
        bestStreak: 0,
        guessDistribution: initialStatistics.guessDistribution,
      });
    });

    it('should maintain best streak when current streak is broken', () => {
      const { result } = renderHook(() => useStatistics(), { wrapper });

      // Win three games
      act(() => {
        result.current.addGameResult(true, 3);
        result.current.addGameResult(true, 4);
        result.current.addGameResult(true, 2);
      });

      // Lose one game
      act(() => {
        result.current.addGameResult(false, 6);
      });

      expect(result.current.statistics.bestStreak).toBe(3);
      expect(result.current.statistics.currentStreak).toBe(0);
    });

    it('should track games won correctly', () => {
      const { result } = renderHook(() => useStatistics(), { wrapper });

      act(() => {
        // Win two games
        result.current.addGameResult(true, 3);
        result.current.addGameResult(true, 4);
        // Lose one game
        result.current.addGameResult(false, 6);
      });

      expect(result.current.statistics.gamesWon).toBe(2);
      expect(result.current.statistics.gamesPlayed).toBe(3);
    });
  });
});
