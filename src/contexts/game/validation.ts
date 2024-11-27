import { tokenizeEquation } from '@/utils/equations';

import { isOperatorKey } from './keys';

export enum ValidationError {
  NOT_ENOUGH_NUMBERS_OR_OPERATORS = 'Not enough numbers or operators.',
  LEADING_ZEROS = 'Numbers cannot have leading zeros.',
  INVALID_OPERATOR_POSITION = 'The equation cannot start or end with an operator.',
  OPERATORS_IN_SEQUENCE = 'Operators cannot be in sequence.',
  EQUATION_RESULT = 'The equation result must be',
}

type ValidateEquationResult =
  | {
      isValid: true;
      error: null;
    }
  | {
      isValid: false;
      error: string;
    };

export function validateEquation(
  userEquation: string,
  gameEquation: string,
  equationResult: number,
): ValidateEquationResult {
  // Validate equation length
  if (userEquation.length < gameEquation.length) {
    return {
      isValid: false,
      error: ValidationError.NOT_ENOUGH_NUMBERS_OR_OPERATORS,
    };
  }

  // Tokenize equation
  const tokens = tokenizeEquation(userEquation, true);

  // Validate equation does not have leading zeros
  if (tokens.some((token) => token.length > 1 && token.startsWith('0'))) {
    return {
      isValid: false,
      error: ValidationError.LEADING_ZEROS,
    };
  }

  // Validate equation does not have two or more operators in sequence
  if (tokens.some((token, index) => isOperatorKey(token) && isOperatorKey(tokens[index + 1]))) {
    return {
      isValid: false,
      error: ValidationError.OPERATORS_IN_SEQUENCE,
    };
  }

  // Validate equation does not start or end with an operator
  if (isOperatorKey(userEquation[0]) || isOperatorKey(userEquation[userEquation.length - 1])) {
    return {
      isValid: false,
      error: ValidationError.INVALID_OPERATOR_POSITION,
    };
  }

  // Validate equation result is equal to the game equation result
  const result = eval(userEquation);
  if (result !== equationResult) {
    return {
      isValid: false,
      error: `${ValidationError.EQUATION_RESULT} ${equationResult}.`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
