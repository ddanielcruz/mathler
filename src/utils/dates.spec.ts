import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getTodayTimestamp } from './dates';

describe('getTodayTimestamp', () => {
  beforeEach(() => {
    // Set up fake timers before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Clean up fake timers after each test
    vi.useRealTimers();
  });

  it('should return timestamp for start of current day in UTC', () => {
    const mockDate = new Date('2024-03-14T15:30:45.123Z');
    vi.setSystemTime(mockDate);

    // Expected timestamp should be start of day (00:00:00.000) in UTC
    const expected = new Date(2024, 2, 14).getTime();

    expect(getTodayTimestamp()).toBe(expected);
  });

  it('should handle different times on same day', () => {
    const morningDate = new Date('2024-03-14T05:00:00.000Z');
    vi.setSystemTime(morningDate);
    const morningTimestamp = getTodayTimestamp();

    const eveningDate = new Date('2024-03-14T20:00:00.000Z');
    vi.setSystemTime(eveningDate);
    const eveningTimestamp = getTodayTimestamp();

    expect(morningTimestamp).toBe(eveningTimestamp);
  });

  it('should return different timestamps for different days', () => {
    const dayOne = new Date('2024-03-14T15:30:45.123Z');
    vi.setSystemTime(dayOne);
    const timestampOne = getTodayTimestamp();

    const dayTwo = new Date('2024-03-15T15:30:45.123Z');
    vi.setSystemTime(dayTwo);
    const timestampTwo = getTodayTimestamp();

    expect(timestampOne).not.toBe(timestampTwo);
    expect(timestampTwo - timestampOne).toBe(24 * 60 * 60 * 1000); // One day in milliseconds
  });
});
