import { describe, expect, it } from 'vitest';

import { cn } from './tailwind';

describe('cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
  });

  it('should handle conditional classes', () => {
    const isFocused = true;
    expect(cn('border', isFocused && 'border-blue-500')).toBe('border border-blue-500');
  });

  it('should handle array of classes', () => {
    expect(cn(['px-2', 'py-1'])).toBe('px-2 py-1');
  });

  it('should handle object of classes', () => {
    expect(cn({ 'bg-red-500': true, 'text-white': false })).toBe('bg-red-500');
  });

  it('should merge and dedupe conflicting classes', () => {
    // eslint-disable-next-line tailwindcss/no-contradicting-classname
    expect(cn('bg-red-500 px-2', 'bg-blue-500 px-4')).toBe('bg-blue-500 px-4');
  });

  it('should handle empty or falsy inputs', () => {
    expect(cn('', null, undefined, false, 'px-2')).toBe('px-2');
  });
});
