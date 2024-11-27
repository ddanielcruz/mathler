import { isOperatorKey, OperatorKey } from '@/contexts/game';
import equations from '@/data/equations.json';

import { getTodayTimestamp } from './dates';

export interface DailyEquation {
  equation: string;
  result: number;
  cumulativeEquations: string[];
}

/**
 * Gets the equation for the current day and its related information.
 * The equation is determined by the current date to ensure all users get the same equation on the same day.
 *
 * @returns {DailyEquation} An object containing:
 *   - equation: The equation string for today
 *   - result: The numerical result of evaluating the equation
 *   - cumulativeEquations: Array of all valid equations that yield the same result
 */
export function getDailyEquation(): DailyEquation {
  // Get the timestamp of the start of today
  const timestamp = getTodayTimestamp();

  // Use the timestamp to get the equation
  const equation = equations[timestamp % equations.length];
  const result: number = eval(equation);

  // Calculate the cumulative equations
  const cumulativeEquations = getCumulativeEquations(equation);

  return { equation, result, cumulativeEquations };
}

type Token<T extends boolean = false> = T extends true
  ? string | OperatorKey
  : number | OperatorKey;

/**
 * Converts a string equation into an array of tokens (numbers and operators).
 *
 * @param {string} equation - The equation string to tokenize (e.g., "1+2*3")
 * @param {boolean} [preserveStringNumbers=false] - If true, keeps numbers as strings to preserve leading zeros
 * @returns {Token[]} An array of tokens where each token is either a number/string and operator
 * @example
 * tokenizeEquation("1+2*3") // returns [1, "+", 2, "*", 3]
 * tokenizeEquation("01+2*3", true) // returns ["01", "+", "2", "*", "3"]
 */
export function tokenizeEquation<T extends boolean = false>(
  equation: string,
  preserveStringNumbers?: T,
): Token<T>[] {
  const tokens: (string | OperatorKey)[] = [];
  let currentNumber = '';

  for (const char of equation) {
    if (isOperatorKey(char)) {
      if (currentNumber) {
        tokens.push(currentNumber);
        currentNumber = '';
      }

      tokens.push(char as OperatorKey);
    } else if (/\d/.test(char)) {
      currentNumber += char;
    }
  }

  if (currentNumber) {
    tokens.push(currentNumber);
  }

  return (
    preserveStringNumbers
      ? tokens
      : tokens.map((token) => (isOperatorKey(token) ? token : Number(token)))
  ) as Token<T>[];
}

/**
 * Generates all possible permutations of an array.
 *
 * @template T The type of elements in the array
 * @param {T[]} arr - The array to generate permutations for
 * @returns {T[][]} An array containing all possible permutations of the input array
 * @example
 * generatePermutations([1, 2]) // returns [[1, 2], [2, 1]]
 */
function generatePermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];

  const result: T[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = generatePermutations(remaining);

    for (const perm of perms) {
      result.push([current, ...perm]);
    }
  }

  return result;
}

/**
 * Converts an array of tokens back into an equation string.
 *
 * @param {Token[]} tokens - Array of tokens (numbers and operators)
 * @returns {string} The equation string
 * @example
 * tokensToEquation([1, "+", 2]) // returns "1+2"
 */
function tokensToEquation<T extends boolean = false>(tokens: Token<T>[]): string {
  return tokens.join('');
}

/**
 * Finds all valid equations that are mathematically equivalent to the input equation.
 * An equation is considered cumulative if it:
 * 1. Uses the same numbers and operators as the input equation
 * 2. Evaluates to the same result
 * 3. Respects operator precedence
 *
 * Note: Non-commutative operators (subtraction and division) maintain their original order.
 *
 * @param {string} equation - The input equation string
 * @returns {string[]} Array of all valid cumulative equations
 * @example
 * getCumulativeEquations("1+2*3")
 * // returns ["1+2*3", "1+3*2", "2*3+1", "3*2+1"]
 */
export function getCumulativeEquations(equation: string): string[] {
  const tokens = tokenizeEquation(equation);
  const numbers = tokens.filter((token): token is number => typeof token === 'number');
  const operators = tokens.filter(
    (token): token is OperatorKey => typeof token === 'string',
  ) as OperatorKey[];

  const targetResult = eval(equation);
  const numberPermutations = generatePermutations(numbers);
  const operatorPermutations = generatePermutations(operators);

  const results = new Set<string>();

  for (const numberPerm of numberPermutations) {
    for (const operatorPerm of operatorPermutations) {
      const combinedTokens: Token<false>[] = [];
      let numIndex = 0;
      let opIndex = 0;

      while (numIndex < numberPerm.length || opIndex < operatorPerm.length) {
        if (numIndex < numberPerm.length) {
          combinedTokens.push(numberPerm[numIndex++]);
        }
        if (opIndex < operatorPerm.length) {
          combinedTokens.push(operatorPerm[opIndex++]);
        }
      }

      const newEquation = tokensToEquation(combinedTokens);

      if (Math.abs(eval(newEquation) - targetResult) < Number.EPSILON) {
        results.add(newEquation);
      }
    }
  }

  return Array.from(results);
}
