import { describe, expect, it } from 'vitest';

import { getGuessSolutionMap, isValidEquation, ValidationError } from './validation';

describe('validation', () => {
  describe('validateEquation', () => {
    describe('equation length validation', () => {
      it('returns error when equation is too short', () => {
        const result = isValidEquation('1+2', 3);
        expect(result).toEqual(ValidationError.NOT_ENOUGH_NUMBERS_OR_OPERATORS);
      });

      it('accepts equation of correct length', () => {
        const result = isValidEquation('2*10+6', 26);
        expect(result).toBeNull();
      });
    });

    describe('leading zeros validation', () => {
      it('returns error when numbers have leading zeros', () => {
        const result = isValidEquation('01+2*2', 5);
        expect(result).toEqual(ValidationError.LEADING_ZEROS);
      });

      it('accepts single zero numbers', () => {
        const result = isValidEquation('0+7+10', 17);
        expect(result).toBeNull();
      });
    });

    describe('operator position validation', () => {
      it('returns error when equation starts with an operator', () => {
        const result = isValidEquation('+1*2*3', 7);
        expect(result).toEqual(ValidationError.INVALID_OPERATOR_POSITION);
      });

      it('returns error when equation ends with an operator', () => {
        const result = isValidEquation('1*2*3+', 7);
        expect(result).toEqual(ValidationError.INVALID_OPERATOR_POSITION);
      });
    });

    describe('sequential operators validation', () => {
      it('returns error when operators are in sequence', () => {
        const result = isValidEquation('1++2*3', 7);
        expect(result).toEqual(ValidationError.OPERATORS_IN_SEQUENCE);
      });

      it('accepts valid operator placement', () => {
        const result = isValidEquation('10+2*3', 16);
        expect(result).toBeNull();
      });
    });

    describe('equation result validation', () => {
      it('returns error when result is incorrect', () => {
        const result = isValidEquation('20+2*3', 20);
        expect(result).toEqual(expect.stringContaining(ValidationError.EQUATION_RESULT));
      });

      it('accepts equation with correct result', () => {
        const result = isValidEquation('10+2*3', 16);
        expect(result).toBeNull();
      });
    });
  });

  describe('getGuessSolutionMap', () => {
    it('returns correct solution map', () => {
      const result = getGuessSolutionMap(['1', '2', '+', '3', '*', '2'], '1+23/2');
      expect(result).toEqual([
        { key: '1', state: 'correct' },
        { key: '2', state: 'present' },
        { key: '+', state: 'present' },
        { key: '3', state: 'correct' },
        { key: '*', state: 'absent' },
        { key: '2', state: 'correct' },
      ]);
    });
  });
});
