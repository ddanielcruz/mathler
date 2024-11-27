import { describe, expect, it } from 'vitest';

import { validateEquation, ValidationError } from './validation';

describe('validateEquation', () => {
  const gameEquation = '1+2*3';
  const equationResult = 7;

  describe('equation length validation', () => {
    it('returns error when equation is too short', () => {
      const result = validateEquation('1+2', gameEquation, equationResult);
      expect(result).toEqual({
        isValid: false,
        error: ValidationError.NOT_ENOUGH_NUMBERS_OR_OPERATORS,
      });
    });

    it('accepts equation of correct length', () => {
      const result = validateEquation('2*3+1', gameEquation, equationResult);
      expect(result.isValid).toBe(true);
    });
  });

  describe('leading zeros validation', () => {
    it('returns error when numbers have leading zeros', () => {
      const result = validateEquation('01+2*3', gameEquation, equationResult);
      expect(result).toEqual({
        isValid: false,
        error: ValidationError.LEADING_ZEROS,
      });
    });

    it('accepts single zero numbers', () => {
      const result = validateEquation('0+7', '1+2', 7);
      expect(result.isValid).toBe(true);
    });
  });

  describe('operator position validation', () => {
    it('returns error when equation starts with an operator', () => {
      const result = validateEquation('+1*2*3', gameEquation, equationResult);
      expect(result).toEqual({
        isValid: false,
        error: ValidationError.INVALID_OPERATOR_POSITION,
      });
    });

    it('returns error when equation ends with an operator', () => {
      const result = validateEquation('1*2*3+', gameEquation, equationResult);
      expect(result).toEqual({
        isValid: false,
        error: ValidationError.INVALID_OPERATOR_POSITION,
      });
    });
  });

  describe('sequential operators validation', () => {
    it('returns error when operators are in sequence', () => {
      const result = validateEquation('1++2*3', gameEquation, equationResult);
      expect(result).toEqual({
        isValid: false,
        error: ValidationError.OPERATORS_IN_SEQUENCE,
      });
    });

    it('accepts valid operator placement', () => {
      const result = validateEquation('1+2*3', gameEquation, equationResult);
      expect(result.isValid).toBe(true);
    });
  });

  describe('equation result validation', () => {
    it('returns error when result is incorrect', () => {
      const result = validateEquation('2+2*3', gameEquation, equationResult);
      expect(result).toEqual({
        isValid: false,
        error: `${ValidationError.EQUATION_RESULT} ${equationResult}.`,
      });
    });

    it('accepts equation with correct result', () => {
      const result = validateEquation('1+2*3', gameEquation, equationResult);
      expect(result.isValid).toBe(true);
    });

    it('accepts different equation with same result', () => {
      const result = validateEquation('3*2+1', gameEquation, equationResult);
      expect(result.isValid).toBe(true);
    });
  });

  describe('valid equations', () => {
    it('accepts all valid permutations', () => {
      const validEquations = ['1+2*3', '3*2+1', '2*3+1'];
      validEquations.forEach((equation) => {
        const result = validateEquation(equation, gameEquation, equationResult);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });
  });
});
