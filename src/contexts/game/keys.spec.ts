import { isGuessKey } from './keys';

describe('keys', () => {
  describe('isGuessKey', () => {
    it.each(['1', '2', '+', '-'])('should return true for a valid guess key: %s', (key) => {
      expect(isGuessKey(key)).toBe(true);
    });

    it.each(['Enter', 'a', '%'])('should return false for an invalid key: %s', (key) => {
      expect(isGuessKey(key)).toBe(false);
    });
  });
});
