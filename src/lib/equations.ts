import { OperatorKey, OPERATORS } from '@/contexts/game';
import equations from '@/data/equations.json';

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timestamp = today.getTime();

  // Use the timestamp to get the equation
  const equation = equations[timestamp % equations.length];
  const result: number = eval(equation);

  // Calculate the cumulative equations
  const cumulativeEquations = getCumulativeEquations(equation);

  return { equation, result, cumulativeEquations };
}

type Token = number | (typeof OPERATORS)[number];

/**
 * Converts a string equation into an array of tokens (numbers and operators).
 *
 * @param {string} equation - The equation string to tokenize (e.g., "1+2*3")
 * @returns {Token[]} An array of tokens where each token is either a number or an operator
 * @example
 * tokenizeEquation("1+2*3") // returns [1, "+", 2, "*", 3]
 */
function tokenizeEquation(equation: string): Token[] {
  const tokens: Token[] = [];
  let currentNumber = '';

  for (const char of equation) {
    if (OPERATORS.includes(char as OperatorKey)) {
      if (currentNumber) {
        tokens.push(Number(currentNumber));
        currentNumber = '';
      }
      tokens.push(char as OperatorKey);
    } else if (/\d/.test(char)) {
      currentNumber += char;
    }
  }

  if (currentNumber) {
    tokens.push(Number(currentNumber));
  }

  return tokens;
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
function tokensToEquation(tokens: Token[]): string {
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
  const numbers = tokens.filter((token) => typeof token === 'number') as number[];
  const operators = tokens.filter((token) => typeof token === 'string') as OperatorKey[];

  // Get the target result
  const targetResult = eval(equation);

  // Generate all possible number permutations
  const numberPermutations = generatePermutations(numbers);

  // Generate all possible operator permutations
  const operatorPermutations = generatePermutations(operators);

  const results = new Set<string>();

  // Combine numbers and operators to form equations
  for (const numberPerm of numberPermutations) {
    for (const operatorPerm of operatorPermutations) {
      const combinedTokens: Token[] = [];
      let numIndex = 0;
      let opIndex = 0;

      // Reconstruct the equation
      while (numIndex < numberPerm.length || opIndex < operatorPerm.length) {
        if (numIndex < numberPerm.length) {
          combinedTokens.push(numberPerm[numIndex++]);
        }
        if (opIndex < operatorPerm.length) {
          combinedTokens.push(operatorPerm[opIndex++] as OperatorKey);
        }
      }

      const newEquation = tokensToEquation(combinedTokens);

      // Check if the equation yields the same result
      if (Math.abs(eval(newEquation) - targetResult) < Number.EPSILON) {
        results.add(newEquation);
      }
    }
  }

  return Array.from(results);
}
