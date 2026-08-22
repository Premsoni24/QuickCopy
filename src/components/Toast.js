import { qs } from '../utils/dom.js';

const AUTO_DISMISS_MS = 3000;

/**
 * Toast
 * -----
 * Single reusable toast element. Only one toast is ever shown at a
 * time in this popup, so it manages its own timer internally rather
 * than queuing — simplest correct behavior for this UI.
 */
export class Toast {
  constructor(selector = '#toast') {
    this._el = qs(selector);
    this._textEl = qs('#toastText', this._el);
    this._timer = null;
  }

  /** @param {string} message */
  show(message = 'Copied to clipboard') {
    this._textEl.textContent = message;
    clearTimeout(this._timer);
    this._el.classList.add('show');
    this._timer = setTimeout(() => this._el.classList.remove('show'), AUTO_DISMISS_MS);
  }
}
