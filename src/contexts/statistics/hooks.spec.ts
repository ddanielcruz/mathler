import { renderHook } from '@testing-library/react';

import { useStatistics } from './hooks';

describe('useStatistics', () => {
  it('should throw an error if used outside of a GameProvider', () => {
    // Temporarily mock console.error
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => undefined);

    // Run the test
    expect(() => renderHook(() => useStatistics())).toThrow();

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
