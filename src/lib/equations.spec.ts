import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import equations from '@/data/equations.json';

import { getCumulativeEquations, getDailyEquation } from './equations';

describe('equations', () => {
  beforeEach(() => {
    // Tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore date after each test run
    vi.useRealTimers();
  });

  describe('equations dataset', () => {
    it('all equations evaluate to valid numbers', () => {
      equations.forEach((equation) => {
        const result = eval(equation);
        expect(typeof result).toBe('number');
        expect(Number.isFinite(result)).toBe(true);
        expect(Number.isNaN(result)).toBe(false);
      });
    });
  });

  describe('getDailyEquation', () => {
    it('returns an equation and result', () => {
      const { equation, result } = getDailyEquation();
      expect(equation).toBeDefined();
      expect(result).toBeDefined();
    });

    it('returns consistent equation for a given date', () => {
      // Set a specific date
      const testDate = new Date(2024, 0, 1); // January 1, 2024
      vi.setSystemTime(testDate);

      const { equation, result } = getDailyEquation();

      // Get the same equation again
      const { equation: equation2, result: result2 } = getDailyEquation();

      expect(equation).toBe(equation2);
      expect(result).toBe(result2);
    });

    it('returns different equations for different dates', () => {
      // First date
      vi.setSystemTime(new Date(2024, 0, 1));
      const firstDay = getDailyEquation();

      // Second date
      vi.setSystemTime(new Date(2024, 0, 2));
      const secondDay = getDailyEquation();

      expect(firstDay.equation).not.toBe(secondDay.equation);
    });

    it('cycles through equations array based on date', () => {
      const totalEquations = equations.length;

      // Set date to exactly totalEquations days from start
      vi.setSystemTime(new Date(2024, 0, totalEquations));
      const wrappedDay = getDailyEquation();

      // Set date to first day
      vi.setSystemTime(new Date(2024, 0, 0));
      const firstDay = getDailyEquation();

      expect(wrappedDay.equation).toBe(firstDay.equation);
    });

    it('evaluates equation result correctly', () => {
      vi.setSystemTime(new Date(2024, 0, 1));
      const { equation, result } = getDailyEquation();

      // Safely evaluate the equation
      const expectedResult = Function(`return ${equation}`)();
      expect(result).toBe(expectedResult);
    });
  });

  describe('getCumulativeEquations', () => {
    it('returns the original equation in the results', () => {
      const equation = '1+2';
      const results = getCumulativeEquations(equation);
      expect(results).toContain(equation);
    });

    it('finds all valid permutations for addition', () => {
      const results = getCumulativeEquations('1+2');
      expect(results).toEqual(expect.arrayContaining(['1+2', '2+1']));
      expect(results).toHaveLength(2);
    });

    it('finds all valid permutations for multiplication', () => {
      const results = getCumulativeEquations('2*3');
      expect(results).toEqual(expect.arrayContaining(['2*3', '3*2']));
      expect(results).toHaveLength(2);
    });

    it('handles complex equations with multiple operators', () => {
      const results = getCumulativeEquations('1+2*3');
      expect(results).toEqual(expect.arrayContaining(['1+2*3', '1+3*2', '2*3+1', '3*2+1']));
    });

    it('maintains operator precedence in results', () => {
      const results = getCumulativeEquations('1+2*3');
      results.forEach((equation) => {
        expect(eval(equation)).toBe(7); // 1+2*3 = 7
      });
    });

    it('handles subtraction correctly', () => {
      const results = getCumulativeEquations('5-2');
      expect(results).toHaveLength(1); // Subtraction is not commutative
      expect(results).toContain('5-2');
    });

    it('handles division correctly', () => {
      const results = getCumulativeEquations('6/2');
      expect(results).toHaveLength(1); // Division is not commutative
      expect(results).toContain('6/2');
    });

    it('handles equations with same numbers correctly', () => {
      const results = getCumulativeEquations('2+2');
      expect(results).toHaveLength(1); // Should only have one permutation
      expect(results).toContain('2+2');
    });

    it('handles complex equations with multiple same operators', () => {
      const results = getCumulativeEquations('1+2+3');
      expect(results).toEqual(
        expect.arrayContaining(['1+2+3', '1+3+2', '2+1+3', '2+3+1', '3+1+2', '3+2+1']),
      );
    });

    it('maintains floating point precision', () => {
      const results = getCumulativeEquations('2.5*2');
      results.forEach((equation) => {
        expect(Math.abs(eval(equation) - 5)).toBeLessThan(Number.EPSILON);
      });
    });
  });
});
