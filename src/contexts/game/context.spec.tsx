import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { GUESS_LENGTH, GUESSES_COUNT } from './constants';
import { GameProvider, useGame } from './context';

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe('GameContext', () => {
  describe('useGame', () => {
    it('should throw an error if used outside of a GameProvider', () => {
      expect(() => renderHook(() => useGame())).toThrow();
    });
  });

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.guesses).toHaveLength(GUESSES_COUNT);
      expect(result.current.guesses[0]).toEqual({ guess: '', state: 'in-progress' });
      result.current.guesses
        .slice(1)
        .forEach((guess) => expect(guess).toEqual({ guess: '', state: 'not-played' }));
      expect(result.current.keys).toEqual({});
    });
  });

  describe('onKeyPress', () => {
    it('should append digits to the current guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('3'));
      expect(result.current.guesses[0].guess).toBe('123');
    });

    it('should append operators to the current guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('+'));
      act(() => result.current.onKeyPress('2'));

      expect(result.current.guesses[0].guess).toBe('1+2');
    });

    it('should delete the last character when Delete is pressed', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('Delete'));

      expect(result.current.guesses[0].guess).toBe('1');
    });

    it(`should limit the guess to ${GUESS_LENGTH} characters`, () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Add characters one by one
      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('+'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('*'));
      act(() => result.current.onKeyPress('3'));
      act(() => result.current.onKeyPress('-'));
      act(() => result.current.onKeyPress('4')); // This should be ignored

      expect(result.current.guesses[0].guess).toBe('1+2*3-');
    });

    it('should only modify the in-progress guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Modify the first guess
      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('2'));

      // Complete the first guess and make the second guess in progress
      result.current.guesses[0].state = 'submitted';
      result.current.guesses[1].state = 'in-progress';

      // Add new characters
      act(() => result.current.onKeyPress('3'));
      act(() => result.current.onKeyPress('4'));

      expect(result.current.guesses[0].guess).toBe('12');
      expect(result.current.guesses[1].guess).toBe('34');
    });

    it('should do nothing if there is no in-progress guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Set all guesses to completed using the proper state update
      result.current.guesses.forEach((guess) => {
        guess.state = 'correct';
      });

      act(() => result.current.onKeyPress('1'));

      expect(result.current.guesses[0].guess).toBe('');
    });

    // TODO Add tests for Enter key functionality once guess submission is implemented
  });
});
