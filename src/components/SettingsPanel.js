import { qs, qsa, clear } from '../utils/dom.js';
import { buildSettingsTemplate } from './SettingsTemplate.js';

/**
 * SettingsPanel
 * -------------
 * Builds the settings body DOM once, renders current settings into
 * the controls, and wires change events back out via callbacks.
 * Contains no storage or migration logic itself (that lives in the
 * app controller) — keeps this class focused purely on view sync.
 */
export class SettingsPanel {
  constructor(selector = '#settingsView', bodySelector = '#settingsBody') {
    this._el = qs(selector);
    const body = qs(bodySelector);
    clear(body);
    buildSettingsTemplate().forEach((node) => body.appendChild(node));
  }

  /** @param {typeof import('../repository/SettingsRepository.js').DEFAULT_SETTINGS} settings */
  render(settings) {
    qsa('[data-theme-option]', this._el).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.themeOption === settings.theme);
    });
    qsa('[data-density-option]', this._el).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.densityOption === settings.listDensity);
    });
    this._toggle('#syncModeSwitch', settings.storageMode === 'sync');
    this._toggle('#confirmDeleteSwitch', settings.confirmBeforeDelete);
  }

  _toggle(selector, on) {
    qs(selector, this._el)?.classList.toggle('on', on);
  }

  /** @param {Object<string, Function>} handlers keyed by data attribute action */
  bind(handlers) {
    qsa('[data-theme-option]', this._el).forEach((btn) =>
      btn.addEventListener('click', () => handlers.onThemeChange(btn.dataset.themeOption))
    );
    qsa('[data-density-option]', this._el).forEach((btn) =>
      btn.addEventListener('click', () => handlers.onDensityChange(btn.dataset.densityOption))
    );
    qs('#syncModeSwitch', this._el)?.addEventListener('click', handlers.onStorageModeToggle);
    qs('#confirmDeleteSwitch', this._el)?.addEventListener('click', handlers.onConfirmDeleteToggle);
    qs('#clearAllBtn', this._el)?.addEventListener('click', handlers.onClearAll);
  }
}
