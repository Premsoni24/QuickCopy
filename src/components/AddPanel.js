import { qs } from '../utils/dom.js';

/**
 * AddPanel
 * --------
 * Controls the "Add new answer" slide-over form. Delegates actual
 * validation + persistence to the caller via onSubmit, and only
 * handles panel open/close state and displaying returned errors.
 */
export class AddPanel {
  constructor(selector = '#addPanel') {
    this._el = qs(selector);
    this._keyInput = qs('#addKeyInput', this._el);
    this._valueInput = qs('#addValueInput', this._el);
    this._sensitiveInput = qs('#addSensitiveInput', this._el);
    this._errorEl = qs('#addError', this._el);
    this._saveBtn = qs('#addSaveBtn', this._el);
  }

  open() {
  this._keyInput.value = '';
  this._valueInput.value = '';
  this._sensitiveInput.checked = false;
  this._setError(null);
  this._el.classList.add('open');
  this._keyInput.focus();
}

  close() {
    this._el.classList.remove('open');
  }

  /** @param {(key:string, value:string) => Promise<{success:boolean,error?:string}>} onSubmit */
  bindSave(onSubmit) {
    this._saveBtn.addEventListener('click', async () => {
      const key = this._keyInput.value;
      const value = this._valueInput.value;
      const sensitive = this._sensitiveInput.checked;
      const result = await onSubmit(key, value, sensitive);
      if (!result.success) {
        this._setError(result.error);
        return;
      }
      this.close();
    });
  }

  _setError(message) {
    this._errorEl.textContent = message || '';
    this._errorEl.style.display = message ? 'block' : 'none';
  }
}
