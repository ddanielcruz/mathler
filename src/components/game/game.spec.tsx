import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { GameContext } from '@/contexts/game';

import { Game } from './game';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <GameContext.Provider
      value={{
        guesses: [],
        keys: {},
        equationResult: 42,
        error: null,
        onKeyPress: () => {},
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

describe('Game', () => {
  it('renders the game components', () => {
    render(<Game />, { wrapper });

    // Check if main components are rendered
    expect(screen.getByTestId('guesses')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard')).toBeInTheDocument();
  });

  it('displays the equation result', () => {
    render(<Game />, { wrapper });

    expect(screen.getByText('equals 42')).toBeInTheDocument();
  });
});
