/**
 * Throttle function - limits execution rate
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Throttled function
 */
export function throttle(func, wait) {
  let timeout = null
  let lastRan = null

  return function executedFunction(...args) {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (Date.now() - lastRan >= wait) {
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, wait - (Date.now() - lastRan))
    }
  }
}