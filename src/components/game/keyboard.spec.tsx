import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { GameContext } from '@/contexts/game';
import { DIGITS } from '@/contexts/game';

import { Keyboard } from './keyboard';

function wrapper({
  children,
  onKeyPress = vi.fn(),
}: {
  children: ReactNode;
  onKeyPress?: (key: string) => void;
}) {
  return (
    <GameContext.Provider
      value={{
        guesses: [],
        keys: {},
        equationResult: 0,
        onKeyPress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

describe('Keyboard', () => {
  it('renders all digit keys', () => {
    render(<Keyboard />, { wrapper });
    const digitKeys = screen.getAllByTestId('keyboard-key');
    const digitValues = digitKeys.map((key) => key.textContent);
    DIGITS.forEach((digit) => {
      expect(digitValues).toContain(digit);
    });
  });

  it('renders operator keys', () => {
    render(<Keyboard />, { wrapper });
    const keys = screen.getAllByTestId('keyboard-key');
    const keyValues = keys.map((key) => key.textContent);
    // Operators appear twice (mobile and desktop layouts)
    expect(keyValues.filter((value) => value === '+')).toHaveLength(2);
    expect(keyValues.filter((value) => value === '-')).toHaveLength(2);
  });

  it('renders control keys', () => {
    render(<Keyboard />, { wrapper });
    const keys = screen.getAllByTestId('keyboard-key');
    const keyValues = keys.map((key) => key.textContent);
    expect(keyValues).toContain('Enter');
    expect(keyValues).toContain('Delete');
  });

  describe('keyboard events', () => {
    it('calls onKeyPress when a valid key is pressed', async () => {
      const onKeyPress = vi.fn();
      render(<Keyboard />, {
        wrapper: ({ children }) => wrapper({ children, onKeyPress }),
      });

      await userEvent.keyboard('123');
      expect(onKeyPress).toHaveBeenCalledTimes(3);
      expect(onKeyPress).toHaveBeenNthCalledWith(1, '1');
      expect(onKeyPress).toHaveBeenNthCalledWith(2, '2');
      expect(onKeyPress).toHaveBeenNthCalledWith(3, '3');
    });

    it('handles backspace key correctly', async () => {
      const onKeyPress = vi.fn();
      render(<Keyboard />, {
        wrapper: ({ children }) => wrapper({ children, onKeyPress }),
      });

      await userEvent.keyboard('{Backspace}');
      expect(onKeyPress).toHaveBeenCalledWith('Delete');
    });

    it('ignores invalid keys', async () => {
      const onKeyPress = vi.fn();
      render(<Keyboard />, {
        wrapper: ({ children }) => wrapper({ children, onKeyPress }),
      });

      await userEvent.keyboard('abc');
      expect(onKeyPress).not.toHaveBeenCalled();
    });
  });
});
