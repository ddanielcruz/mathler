export const OPERATORS = ['+', '-', '*', '/'] as const;
export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export const KEYS = [...OPERATORS, ...DIGITS] as const;

export type GuessKey = (typeof KEYS)[number];

export function isKey(key: string): key is GuessKey {
  return KEYS.includes(key as GuessKey);
}
