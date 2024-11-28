import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { GameProvider } from '@/contexts/game';
import { GUESSES_COUNT } from '@/contexts/game/constants';
import { StatisticsProvider } from '@/contexts/statistics';

import { Guesses } from './guesses';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <StatisticsProvider>
      <GameProvider>{children}</GameProvider>
    </StatisticsProvider>
  );
}

describe('Guesses', () => {
  it('renders game state correctly', () => {
    render(<Guesses />, { wrapper });

    // Get the container
    const container = screen.getByTestId('guesses');

    // Should render GUESSES_COUNT number of guesses
    const guessElements = container.children;
    expect(guessElements).toHaveLength(GUESSES_COUNT);

    // First guess should be in-progress, others should be empty
    const firstGuess = guessElements[0];
    expect(firstGuess).toHaveAttribute('data-state', 'in-progress');

    Array.from(guessElements)
      .slice(1)
      .forEach((guess) => {
        expect(guess).toHaveAttribute('data-state', 'not-played');
      });
  });
});
