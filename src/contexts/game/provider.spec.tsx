import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { GUESS_LENGTH, GUESSES_COUNT } from './constants';
import { useGame } from './hooks';
import { GuessKey } from './keys';
import { GameProvider } from './provider';
import { Guess, GuessState, GuessValueKey } from './types';
function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

function createEmptyGuess(state: GuessState): Guess {
  return { guess: [], state };
}

function createGuessKey(key: GuessKey, state: GuessValueKey['state'] = null): GuessValueKey {
  return { key, state };
}

describe('GameProvider', () => {
  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.guesses).toHaveLength(GUESSES_COUNT);
      expect(result.current.guesses[0]).toEqual(createEmptyGuess('in-progress'));
      result.current.guesses
        .slice(1)
        .forEach((guess) => expect(guess).toEqual(createEmptyGuess('not-played')));
      expect(result.current.keys).toEqual({});
    });
  });

  describe('onKeyPress', () => {
    it('should append digits to the current guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('3'));

      expect(result.current.guesses[0].guess).toEqual([
        createGuessKey('1'),
        createGuessKey('2'),
        createGuessKey('3'),
      ]);
    });

    it('should append operators to the current guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('+'));
      act(() => result.current.onKeyPress('2'));

      expect(result.current.guesses[0].guess).toEqual([
        createGuessKey('1'),
        createGuessKey('+'),
        createGuessKey('2'),
      ]);
    });

    it('should delete the last character when Delete is pressed', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('Delete'));

      expect(result.current.guesses[0].guess).toEqual([createGuessKey('1')]);
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

      expect(result.current.guesses[0].guess).toEqual([
        createGuessKey('1'),
        createGuessKey('+'),
        createGuessKey('2'),
        createGuessKey('*'),
        createGuessKey('3'),
        createGuessKey('-'),
      ]);
    });

    it.todo('should only modify the in-progress guess');
    it.todo('should do nothing if there is no in-progress guess');
    it.todo('clears error on key press');
    // TODO Add tests for Enter key functionality once guess submission is implemented
  });
});
