/**
 * Returns a debounced version of fn that waits `delay` ms of silence
 * before running. Used on the search input so filtering doesn't
 * re-render on every single keystroke.
 * @param {Function} fn
 * @param {number} [delay=120]
 */
export function debounce(fn, delay = 120) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
