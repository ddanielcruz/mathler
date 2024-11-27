import {
  DIGITS,
  isControlKey,
  isDigitKey,
  isGuessKey,
  isKeyboardKey,
  isOperatorKey,
  OPERATORS,
} from './keys';

describe('keys', () => {
  describe('isOperatorKey', () => {
    it.each(OPERATORS)('should return true for a valid operator key: %s', (key) => {
      expect(isOperatorKey(key)).toBe(true);
    });

    it.each(['1', 'Enter'])('should return false for an invalid operator key: %s', (key) => {
      expect(isOperatorKey(key)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isOperatorKey(null)).toBe(false);
      expect(isOperatorKey(undefined)).toBe(false);
      expect(isOperatorKey(123)).toBe(false);
    });
  });

  describe('isDigitKey', () => {
    it.each(DIGITS.slice(4))('should return true for a valid digit key: %s', (key) => {
      expect(isDigitKey(key)).toBe(true);
    });

    it.each(['+', 'Enter'])('should return false for an invalid digit key: %s', (key) => {
      expect(isDigitKey(key)).toBe(false);
    });
  });

  describe('isGuessKey', () => {
    it.each(['1', '2', '+', '-'])('should return true for a valid guess key: %s', (key) => {
      expect(isGuessKey(key)).toBe(true);
    });

    it.each(['Enter', 'a', '%'])('should return false for an invalid key: %s', (key) => {
      expect(isGuessKey(key)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isGuessKey(null)).toBe(false);
      expect(isGuessKey(undefined)).toBe(false);
      expect(isGuessKey(123)).toBe(false);
    });
  });

  describe('isControlKey', () => {
    it.each(['Enter', 'Delete'])('should return true for a valid control key: %s', (key) => {
      expect(isControlKey(key)).toBe(true);
    });

    it.each(['1', '+', 'Escape'])('should return false for an invalid control key: %s', (key) => {
      expect(isControlKey(key)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isControlKey(null)).toBe(false);
      expect(isControlKey(undefined)).toBe(false);
      expect(isControlKey(123)).toBe(false);
    });
  });

  describe('isKeyboardKey', () => {
    it.each(['1', '2', '+', '-', 'Enter', 'Delete'])(
      'should return true for a valid keyboard key: %s',
      (key) => {
        expect(isKeyboardKey(key)).toBe(true);
      },
    );

    it.each(['a', '%', 'Escape'])('should return false for an invalid keyboard key: %s', (key) => {
      expect(isKeyboardKey(key)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isKeyboardKey(null)).toBe(false);
      expect(isKeyboardKey(undefined)).toBe(false);
      expect(isKeyboardKey(123)).toBe(false);
    });
  });
});
