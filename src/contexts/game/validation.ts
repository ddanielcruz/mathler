import { tokenizeEquation } from '@/utils/equations';

import { GUESS_LENGTH } from './constants';
import { isOperatorKey } from './keys';

export enum ValidationError {
  NOT_ENOUGH_NUMBERS_OR_OPERATORS = 'Not enough numbers or operators.',
  LEADING_ZEROS = 'Numbers cannot have leading zeros.',
  INVALID_OPERATOR_POSITION = 'The equation cannot start or end with an operator.',
  OPERATORS_IN_SEQUENCE = 'Operators cannot be in sequence.',
  EQUATION_RESULT = 'The equation result must be',
}

export function isValidEquation(equation: string, equationResult: number): string | null {
  // Validate equation length
  if (equation.length < GUESS_LENGTH) {
    return ValidationError.NOT_ENOUGH_NUMBERS_OR_OPERATORS;
  }

  // Tokenize equation
  const tokens = tokenizeEquation(equation, true);

  // Validate equation does not have leading zeros
  if (tokens.some((token) => token.length > 1 && token.startsWith('0'))) {
    return ValidationError.LEADING_ZEROS;
  }

  // Validate equation does not have two or more operators in sequence
  if (tokens.some((token, index) => isOperatorKey(token) && isOperatorKey(tokens[index + 1]))) {
    return ValidationError.OPERATORS_IN_SEQUENCE;
  }

  // Validate equation does not start or end with an operator
  if (isOperatorKey(equation[0]) || isOperatorKey(equation[equation.length - 1])) {
    return ValidationError.INVALID_OPERATOR_POSITION;
  }

  // Validate equation result is equal to the game equation result
  const result = eval(equation);
  if (result !== equationResult) {
    return `${ValidationError.EQUATION_RESULT} ${equationResult}.`;
  }

  return null;
}
