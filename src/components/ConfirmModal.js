import { qs } from '../utils/dom.js';

/**
 * ConfirmModal
 * ------------
 * Reusable yes/no confirmation dialog. Used before deleting an answer
 * to prevent accidental data loss. Returns a Promise<boolean> so
 * callers can simply `await` the user's decision.
 */
export class ConfirmModal {
  constructor(selector = '#confirmModal') {
    this._el = qs(selector);
    this._titleEl = qs('#confirmTitle', this._el);
    this._bodyEl = qs('#confirmBody', this._el);
    this._confirmBtn = qs('#confirmYes', this._el);
    this._cancelBtn = qs('#confirmNo', this._el);
  }

  /**
   * @param {string} title
   * @param {string} body
   * @returns {Promise<boolean>}
   */
  open(title, body) {
    this._titleEl.textContent = title;
    this._bodyEl.textContent = body;
    this._el.classList.add('open');

    return new Promise((resolve) => {
      const cleanup = (result) => {
        this._el.classList.remove('open');
        this._confirmBtn.removeEventListener('click', onYes);
        this._cancelBtn.removeEventListener('click', onNo);
        resolve(result);
      };
      const onYes = () => cleanup(true);
      const onNo = () => cleanup(false);
      this._confirmBtn.addEventListener('click', onYes);
      this._cancelBtn.addEventListener('click', onNo);
    });
  }
}
