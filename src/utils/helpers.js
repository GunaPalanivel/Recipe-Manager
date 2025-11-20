/**
 * Debounce function to limit function call frequency
 * @param {Function} func The function to debounce
 * @param {number} wait The debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
