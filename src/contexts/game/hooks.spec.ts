import { renderHook } from '@testing-library/react';

import { useGame } from './hooks';

describe('useGame', () => {
  it('should throw an error if used outside of a GameProvider', () => {
    // Temporarily mock console.error
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => undefined);

    // Run the test
    expect(() => renderHook(() => useGame())).toThrow();

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
