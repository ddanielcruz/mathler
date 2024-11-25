import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names into a single string using tailwind-merge.
 *
 * @param {...ClassValue[]} inputs - The class names to merge
 * @returns {string} The merged class names
 * @example
 * cn('bg-red-500', 'text-white') // returns 'bg-red-500 text-white'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
