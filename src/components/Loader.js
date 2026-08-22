import { qs } from '../utils/dom.js';

/**
 * Loader
 * ------
 * Toggles a spinner overlay while an async operation (storage read,
 * migration between sync/local) is in flight. Kept as its own
 * component so any view can reuse the same overlay markup/behavior.
 */
export class Loader {
  constructor(selector = '#loader') {
    this._el = qs(selector);
  }

  show() {
    this._el.classList.add('show');
  }

  hide() {
    this._el.classList.remove('show');
  }

  /** Wrap an async function so the loader shows for its duration. */
  async wrap(asyncFn) {
    this.show();
    try {
      return await asyncFn();
    } finally {
      this.hide();
    }
  }
}
