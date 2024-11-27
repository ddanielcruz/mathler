import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { getDailyEquation } from '@/utils/equations';

import { GUESS_LENGTH, GUESSES_COUNT } from './constants';
import { useGame } from './hooks';
import { DIGITS, GuessKey } from './keys';
import { GameProvider } from './provider';
import { Guess, GuessState, GuessValueKey } from './types';
import * as validation from './validation';

const isValidEquationSpy = vi.spyOn(validation, 'isValidEquation');

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
  const { equation, result: equationResult, cumulativeEquations } = getDailyEquation();

  afterEach(() => {
    isValidEquationSpy.mockClear();
  });

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

    it('should only modify the in-progress guess', () => {
      isValidEquationSpy.mockReturnValueOnce(null);
      const { result } = renderHook(() => useGame(), { wrapper });

      // Fill first guess and submit it
      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('+'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('Enter'));

      // Try to modify the submitted guess by pressing keys
      act(() => result.current.onKeyPress('3'));
      act(() => result.current.onKeyPress('4'));

      // Verify the submitted guess remains unchanged
      expect(result.current.guesses[0].guess).toEqual([
        createGuessKey('1', expect.any(String)),
        createGuessKey('+', expect.any(String)),
        createGuessKey('2', expect.any(String)),
      ]);

      // Verify the new keys are added to the current in-progress guess
      expect(result.current.guesses[1].guess).toEqual([createGuessKey('3'), createGuessKey('4')]);
    });

    it('should do nothing if there is no in-progress guess', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Submit all guesses
      for (let i = 0; i < GUESSES_COUNT; i++) {
        isValidEquationSpy.mockReturnValueOnce(null);
        act(() => result.current.onKeyPress('Enter'));
      }

      const guessesBeforeKeyPress = [...result.current.guesses];

      // Try to press keys
      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('2'));

      // Verify no changes occurred
      expect(result.current.guesses).toEqual(guessesBeforeKeyPress);
    });

    describe('handleEnter', () => {
      it('should show error when equation validation fails', () => {
        const mockError = 'Mock validation error';
        isValidEquationSpy.mockReturnValueOnce(mockError);

        const { result } = renderHook(() => useGame(), { wrapper });

        act(() => result.current.onKeyPress('1'));
        act(() => result.current.onKeyPress('+'));
        act(() => result.current.onKeyPress('2'));
        act(() => result.current.onKeyPress('Enter'));

        expect(isValidEquationSpy).toHaveBeenCalledWith('1+2', result.current.equationResult);
        expect(result.current.error).toBe(mockError);
        expect(result.current.guesses[0].state).toBe('in-progress');
      });

      it('should mark guess as correct when equation matches exactly', () => {
        const { result } = renderHook(() => useGame(), { wrapper });

        equation.split('').forEach((key) => {
          act(() => result.current.onKeyPress(key as GuessKey));
        });
        act(() => result.current.onKeyPress('Enter'));

        expect(isValidEquationSpy).toHaveBeenCalledWith(equation, equationResult);
        expect(result.current.error).toBeNull();
        expect(result.current.guesses[0].state).toBe('correct');
        expect(result.current.guesses[0].guess).toEqual(
          equation.split('').map((key) => createGuessKey(key as GuessKey, 'correct')),
        );
      });

      it('should mark guess as correct when equation is a valid alternative', () => {
        isValidEquationSpy.mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        cumulativeEquations[0].split('').forEach((key) => {
          act(() => result.current.onKeyPress(key as GuessKey));
        });
        act(() => result.current.onKeyPress('Enter'));

        expect(isValidEquationSpy).toHaveBeenCalledWith(cumulativeEquations[0], equationResult);
        expect(result.current.error).toBeNull();
        expect(result.current.guesses[0].state).toBe('correct');
      });

      it('should mark guess as submitted when equation is valid but not a solution', () => {
        isValidEquationSpy.mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        act(() => result.current.onKeyPress('4'));
        act(() => result.current.onKeyPress('+'));
        act(() => result.current.onKeyPress('3'));
        act(() => result.current.onKeyPress('Enter'));

        expect(isValidEquationSpy).toHaveBeenCalledWith('4+3', equationResult);
        expect(result.current.error).toBeNull();
        expect(result.current.guesses[0].state).toBe('submitted');
        expect(result.current.guesses[1].state).toBe('in-progress');
      });

      it('should not allow submitting after game is won', () => {
        isValidEquationSpy.mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        // Submit correct guess
        equation.split('').forEach((key) => {
          act(() => result.current.onKeyPress(key as GuessKey));
        });
        act(() => result.current.onKeyPress('Enter'));

        const guessesAfterWin = [...result.current.guesses];

        // Try to submit another guess
        act(() => result.current.onKeyPress('4'));
        act(() => result.current.onKeyPress('+'));
        act(() => result.current.onKeyPress('3'));
        act(() => result.current.onKeyPress('Enter'));

        expect(result.current.guesses).toEqual(guessesAfterWin);
      });

      it('should mark keys as correct when they are in the right position', () => {
        isValidEquationSpy.mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        const equationKeys = equation.split('');
        equationKeys.forEach((key) => {
          act(() => result.current.onKeyPress(key as GuessKey));
        });
        act(() => result.current.onKeyPress('Enter'));

        for (const key of equationKeys) {
          expect(result.current.keys[key as GuessKey]).toBe('correct');
        }
      });

      it('should mark keys as present when they exist in the solution but in wrong position', () => {
        isValidEquationSpy.mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        const presentKey = equation.split('').find((key) => key !== equation[0]) as string;
        act(() => result.current.onKeyPress(presentKey as GuessKey));
        act(() => result.current.onKeyPress('Enter'));

        expect(result.current.keys[presentKey as GuessKey]).toBe('present');
      });

      it('should mark keys as absent when they do not exist in the solution', () => {
        isValidEquationSpy.mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        // Type a guess key not in the equation
        const keyToType = DIGITS.find((key) => !equation.includes(key)) as string;
        act(() => result.current.onKeyPress(keyToType as GuessKey));
        act(() => result.current.onKeyPress('Enter'));

        expect(result.current.keys[keyToType as GuessKey]).toBe('absent');
      });

      it('should not downgrade key states from correct to present or absent', () => {
        isValidEquationSpy.mockReturnValueOnce(null).mockReturnValueOnce(null);
        const { result } = renderHook(() => useGame(), { wrapper });

        // Type the first key correct and second key incorrect
        const correctDigit = equation[0] as GuessKey;
        const absentDigit = DIGITS.find((key) => !equation.includes(key)) as GuessKey;
        act(() => result.current.onKeyPress(correctDigit));
        act(() => result.current.onKeyPress(absentDigit));
        act(() => result.current.onKeyPress('Enter'));

        expect(result.current.keys[correctDigit]).toBe('correct');
        expect(result.current.keys[absentDigit]).toBe('absent');

        // The the correct key in a different position
        const otherDigit = DIGITS.find(
          (key) => key !== correctDigit && key !== absentDigit,
        ) as GuessKey;
        act(() => result.current.onKeyPress(otherDigit));
        act(() => result.current.onKeyPress(correctDigit));
        act(() => result.current.onKeyPress('Enter'));
        expect(result.current.keys[correctDigit]).toBe('correct');
        expect(result.current.keys[absentDigit]).toBe('absent');
      });

      it('should not update keys state when validation fails', () => {
        const mockError = 'Mock validation error';
        isValidEquationSpy.mockReturnValueOnce(mockError);
        const { result } = renderHook(() => useGame(), { wrapper });

        act(() => result.current.onKeyPress('1'));
        act(() => result.current.onKeyPress('+'));
        act(() => result.current.onKeyPress('2'));
        act(() => result.current.onKeyPress('Enter'));

        expect(result.current.keys).toEqual({});
      });
    });
  });

  describe('status', () => {
    it('should be "win" when all guesses are correct', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Submit correct guess
      equation.split('').forEach((key) => {
        act(() => result.current.onKeyPress(key as GuessKey));
      });
      act(() => result.current.onKeyPress('Enter'));

      expect(result.current.status).toBe('win');
    });

    it('should be "lose" when all guesses are submitted but none are correct', () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      // Submit incorrect guesses
      for (let i = 0; i < GUESSES_COUNT; i++) {
        isValidEquationSpy.mockReturnValueOnce(null);
        act(() => result.current.onKeyPress('Enter'));
      }

      expect(result.current.status).toBe('lose');
    });

    it('should be "in-progress" when there is an in-progress guess', () => {
      isValidEquationSpy.mockReturnValueOnce(null);
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.status).toBe('in-progress');

      // Type a guess
      act(() => result.current.onKeyPress('1'));
      act(() => result.current.onKeyPress('+'));
      act(() => result.current.onKeyPress('2'));
      act(() => result.current.onKeyPress('Enter'));

      expect(result.current.status).toBe('in-progress');
    });
  });
});
