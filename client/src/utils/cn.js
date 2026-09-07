import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases condicionales y resuelve conflictos de utilidades de Tailwind CSS.
 * @param {...(string|undefined|null|boolean|Record<string, boolean>)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
