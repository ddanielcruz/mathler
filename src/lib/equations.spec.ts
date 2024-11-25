import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import equations from '@/data/equations.json';

import { getDailyEquation } from './equations';

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
    test('all equations evaluate to valid numbers', () => {
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
      // If we have 100 equations and set date to day 101,
      // it should give us equation at index 0
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
});
