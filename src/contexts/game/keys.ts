export const OPERATORS = ['+', '-', '*', '/'] as const;
export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export const CONTROL_KEYS = ['Enter', 'Delete'] as const;

export type OperatorKey = (typeof OPERATORS)[number];
export type DigitKey = (typeof DIGITS)[number];
export type GuessKey = OperatorKey | DigitKey;
export type ControlKey = (typeof CONTROL_KEYS)[number];
export type KeyboardKey = GuessKey | ControlKey;

export function isOperatorKey(value: unknown): value is OperatorKey {
  return typeof value === 'string' && OPERATORS.includes(value as OperatorKey);
}

export function isDigitKey(value: unknown): value is DigitKey {
  return typeof value === 'string' && DIGITS.includes(value as DigitKey);
}

export function isGuessKey(value: unknown): value is GuessKey {
  return isOperatorKey(value) || isDigitKey(value);
}

export function isControlKey(value: unknown): value is ControlKey {
  return typeof value === 'string' && CONTROL_KEYS.includes(value as ControlKey);
}

export function isKeyboardKey(value: unknown): value is KeyboardKey {
  return isGuessKey(value) || isControlKey(value);
}
