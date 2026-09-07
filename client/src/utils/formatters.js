/**
 * Formatea un número como moneda estándar (USD)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Formatea una fecha ISO a formato local legible
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}
