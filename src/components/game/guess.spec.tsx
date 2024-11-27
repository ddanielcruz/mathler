import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Guess as GuessType } from '@/contexts/game';
import { GUESS_LENGTH } from '@/contexts/game/constants';

import { Guess } from './guess';

describe('Guess', () => {
  it('renders empty guess slots when no guess is provided', () => {
    const emptyGuess: GuessType = {
      guess: [],
      state: 'not-played',
    };

    render(<Guess guess={emptyGuess} />);

    // Should render GUESS_LENGTH empty slots
    const emptySlots = screen.getAllByTestId('guess-key');
    expect(emptySlots).toHaveLength(GUESS_LENGTH);
  });

  it('renders partial guess correctly', () => {
    const partialGuess: GuessType = {
      guess: [
        { key: '1', state: null },
        { key: '+', state: null },
      ],
      state: 'in-progress',
    };

    render(<Guess guess={partialGuess} />);

    const guessKeys = screen.getAllByTestId('guess-key');
    expect(guessKeys[0]).toHaveTextContent('1');
    expect(guessKeys[1]).toHaveTextContent('+');

    // Should still have (GUESS_LENGTH - 2) empty slots
    const emptySlots = guessKeys.filter((slot) => slot.textContent === '');
    expect(emptySlots).toHaveLength(GUESS_LENGTH - 2);
  });

  it('renders complete guess with states correctly', () => {
    const completeGuess: GuessType = {
      guess: [
        { key: '1', state: 'correct' },
        { key: '+', state: 'present' },
        { key: '2', state: 'absent' },
        { key: '3', state: 'absent' },
        { key: '*', state: 'correct' },
        { key: '4', state: 'correct' },
      ],
      state: 'submitted',
    };

    render(<Guess guess={completeGuess} />);

    // Check if all letters are rendered
    const guessKeys = screen.getAllByTestId('guess-key');
    completeGuess.guess.forEach((key) => {
      expect(guessKeys.find((slot) => slot.textContent === key.key)).toBeInTheDocument();
    });
  });

  it('renders with the correct data-state attribute', () => {
    const emptyGuess: GuessType = {
      guess: [],
      state: 'not-played',
    };

    render(<Guess guess={emptyGuess} />);

    const guess = screen.getByTestId('guess');
    expect(guess).toHaveAttribute('data-state', 'not-played');
  });
});
