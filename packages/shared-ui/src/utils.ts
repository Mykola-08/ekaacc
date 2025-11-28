import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single string, merging Tailwind CSS classes intelligently.
 * 
 * @param inputs - Class values to combine (strings, arrays, objects, etc.)
 * @returns A single string of merged and deduplicated class names
 * @example
 * cn('p-4', 'text-red-500', 'p-2') // Returns 'text-red-500 p-2'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
