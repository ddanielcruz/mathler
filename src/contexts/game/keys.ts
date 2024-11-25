export const OPERATORS = ['+', '-', '*', '/'] as const;
export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export const KEYS = [...OPERATORS, ...DIGITS] as const;

export type OperatorKey = (typeof OPERATORS)[number];
export type DigitKey = (typeof DIGITS)[number];
export type GuessKey = OperatorKey | DigitKey;
export type KeyboardKey = GuessKey | 'Enter' | 'Delete';

export function isGuessKey(value: unknown): value is GuessKey {
  return typeof value === 'string' && KEYS.includes(value as GuessKey);
}
