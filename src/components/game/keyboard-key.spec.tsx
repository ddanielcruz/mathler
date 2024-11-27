import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { GameContext, initialGameState } from '@/contexts/game';
import { GuessKeyState } from '@/contexts/game/types';

import { KeyboardKey } from './keyboard-key';

function wrapper({
  children,
  onKeyPress = vi.fn(),
  keys = {},
}: {
  children: ReactNode;
  onKeyPress?: (key: string) => void;
  keys?: Record<string, GuessKeyState>;
}) {
  return (
    <GameContext.Provider value={{ ...initialGameState, keys, onKeyPress }}>
      {children}
    </GameContext.Provider>
  );
}

describe('KeyboardKey', () => {
  it('renders with the provided value', () => {
    render(<KeyboardKey value="1" />, { wrapper });
    expect(screen.getByTestId('keyboard-key')).toBeInTheDocument();
  });

  it('calls onKeyPress when clicked', async () => {
    const onKeyPress = vi.fn();
    render(<KeyboardKey value="2" />, {
      wrapper: ({ children }) => wrapper({ children, onKeyPress }),
    });

    const button = screen.getByTestId('keyboard-key');
    await userEvent.click(button);

    expect(onKeyPress).toHaveBeenCalledWith('2');
  });

  describe('state styling and data attributes', () => {
    it('has no data-state when no state is provided', () => {
      render(<KeyboardKey value="3" />, { wrapper });
      const button = screen.getByTestId('keyboard-key');
      expect(button).toHaveClass('bg-white', 'text-black');
      expect(button).not.toHaveAttribute('data-state');
    });

    it('applies absent state styling and data-state', () => {
      render(<KeyboardKey value="4" />, {
        wrapper: ({ children }) => wrapper({ children, keys: { '4': 'absent' } }),
      });
      const button = screen.getByTestId('keyboard-key');
      expect(button).toHaveClass('bg-gray-500', 'text-white');
      expect(button).toHaveAttribute('data-state', 'absent');
    });

    it('applies present state styling and data-state', () => {
      render(<KeyboardKey value="5" />, {
        wrapper: ({ children }) => wrapper({ children, keys: { '5': 'present' } }),
      });
      const button = screen.getByTestId('keyboard-key');
      expect(button).toHaveClass('bg-yellow-500', 'text-white');
      expect(button).toHaveAttribute('data-state', 'present');
    });

    it('applies correct state styling and data-state', () => {
      render(<KeyboardKey value="6" />, {
        wrapper: ({ children }) => wrapper({ children, keys: { '6': 'correct' } }),
      });
      const button = screen.getByTestId('keyboard-key');
      expect(button).toHaveClass('bg-green-500', 'text-white');
      expect(button).toHaveAttribute('data-state', 'correct');
    });
  });

  it('applies wide styling when wide prop is true', () => {
    render(<KeyboardKey value="Enter" wide />, { wrapper });
    const button = screen.getByTestId('keyboard-key');
    expect(button).toHaveClass('w-20', 'sm:w-24');
  });

  it('applies custom className when provided', () => {
    render(<KeyboardKey value="7" className="text-purple-500" />, { wrapper });
    const button = screen.getByTestId('keyboard-key');
    expect(button).toHaveClass('text-purple-500');
  });
});
