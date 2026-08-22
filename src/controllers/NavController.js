import { qs } from '../utils/dom.js';

/**
 * NavController
 * -------------
 * Owns just the main-view <-> settings-view switch and the add-panel
 * open/close wiring that doesn't need any data.
 */
export class NavController {
  constructor(addPanel) {
    this._addPanel = addPanel;
  }

  bind() {
    qs('#openSettingsBtn').addEventListener('click', () => this._showSettings());
    qs('#closeSettingsBtn').addEventListener('click', () => this._showMain());
    qs('#openAddBtn').addEventListener('click', () => this._addPanel.open());
    qs('#closeAddBtn').addEventListener('click', () => this._addPanel.close());
    qs('#cancelAddBtn').addEventListener('click', () => this._addPanel.close());
  }

  _showSettings() {
    qs('#mainView').style.display = 'none';
    qs('#settingsView').classList.add('open');
  }

  _showMain() {
    qs('#mainView').style.display = 'block';
    qs('#settingsView').classList.remove('open');
  }
}
